"""Atlas FX Watchdog HTTP service.

Endpoints:
  GET  /health         — liveness check for Render
  POST /run            — fetch today's mid-market rates, compare to applied
                         rates per active cycle, write fx_rates + fx_leakage.
  GET  /rates/today    — return today's rate snapshot (for UI polling).

Auth: shared HMAC-style secret in X-Playroll-Auth header on mutating routes.
"""
import os
from datetime import date
from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel

from app.fx_api import fetch_mid_market_rates
from app.leakage import compute_spread_bps, compute_leakage, sanity_check_rate
from app.supabase_client import get_supabase


app = FastAPI(title="Atlas FX Watchdog", version="0.1.0")

SECRET = os.environ.get("PYTHON_SERVICE_SECRET", "")


def require_auth(header_value: str | None) -> None:
    if not SECRET:
        # In local dev with no SECRET set, allow through
        return
    if header_value != SECRET:
        raise HTTPException(status_code=401, detail="unauthorized")


@app.get("/health")
async def health():
    return {"ok": True, "service": "fx-watchdog", "version": "0.1.0"}


class RunResponse(BaseModel):
    pairs_updated: int
    cycles_checked: int
    leakage_rows_written: int
    total_leakage_usd: float


@app.post("/run", response_model=RunResponse)
async def run(x_playroll_auth: str | None = Header(default=None)):
    require_auth(x_playroll_auth)
    sb = get_supabase()

    # 1. Fetch today's mid-market rates
    mid_rates = await fetch_mid_market_rates()

    # 2. Load active FX pairs
    pairs_resp = sb.table("fx_pairs").select("id,base_currency,quote_currency").eq("is_active", True).execute()
    pairs = pairs_resp.data or []

    today = date.today().isoformat()
    pairs_updated = 0

    # Baselines for sanity-checking (same ones used in the seed)
    FX_BASELINE = {
        "ZAR": 0.0535,
        "GBP": 1.27,
        "EUR": 1.08,
        "AUD": 0.66,
        "AED": 0.2723,
    }

    rate_rows = []
    for pair in pairs:
        base = pair["base_currency"]
        if pair["quote_currency"] != "USD":
            continue
        mid = mid_rates.get(base)
        if mid is None:
            continue
        baseline = FX_BASELINE.get(base)
        if baseline and not sanity_check_rate(mid, baseline, tolerance_pct=25):
            # Skip obviously bad data
            continue

        # Applied rate — assume a 50 bps spread for the demo (we do not have a real EOR invoice to OCR yet)
        applied = mid * (1 - 0.005)
        spread_bps = compute_spread_bps(mid, applied)

        rate_rows.append({
            "pair_id": pair["id"],
            "rate_date": today,
            "mid_market_rate": mid,
            "provider_applied_rate": applied,
            "spread_bps": spread_bps,
            "source": "exchangerate-api",
        })
        pairs_updated += 1

    # Upsert today's rates (on conflict: pair_id + rate_date + source)
    if rate_rows:
        sb.table("fx_rates").upsert(rate_rows, on_conflict="pair_id,rate_date,source").execute()

    # 3. Compute leakage for all active cycles (status != 'closed')
    cycles_resp = sb.table("payroll_cycles").select(
        "id,country_id,total_gross_amount,countries(currency)"
    ).neq("status", "closed").execute()
    cycles = cycles_resp.data or []

    leakage_rows = []
    total_leakage = 0.0
    for cycle in cycles:
        country = cycle.get("countries") or {}
        currency = country.get("currency")
        if not currency or currency == "USD":
            continue
        mid = mid_rates.get(currency)
        if mid is None:
            continue
        applied = mid * (1 - 0.005)
        gross = float(cycle.get("total_gross_amount") or 0)
        cycle_leak = compute_leakage(mid, applied, gross)
        # Find the pair for this currency
        pair = next((p for p in pairs if p["base_currency"] == currency and p["quote_currency"] == "USD"), None)
        if not pair:
            continue
        # YTD: look up existing row if present, otherwise start at cycle_leak
        existing = sb.table("fx_leakage").select("ytd_leakage_amount").eq("cycle_id", cycle["id"]).eq("pair_id", pair["id"]).execute()
        prior_ytd = 0.0
        if existing.data:
            prior_ytd = float(existing.data[0]["ytd_leakage_amount"])
        new_ytd = prior_ytd + cycle_leak
        leakage_rows.append({
            "cycle_id": cycle["id"],
            "pair_id": pair["id"],
            "cycle_leakage_amount": cycle_leak,
            "ytd_leakage_amount": new_ytd,
        })
        total_leakage += cycle_leak

    if leakage_rows:
        sb.table("fx_leakage").upsert(leakage_rows, on_conflict="cycle_id,pair_id").execute()

    return RunResponse(
        pairs_updated=pairs_updated,
        cycles_checked=len(cycles),
        leakage_rows_written=len(leakage_rows),
        total_leakage_usd=round(total_leakage, 2),
    )


@app.get("/rates/today")
async def rates_today():
    """Return today's snapshot for UI polling. No auth — read-only."""
    sb = get_supabase()
    today = date.today().isoformat()
    resp = sb.table("fx_rates").select(
        "pair_id,mid_market_rate,provider_applied_rate,spread_bps,fx_pairs(base_currency,quote_currency)"
    ).eq("rate_date", today).execute()
    return {"date": today, "rates": resp.data or []}
