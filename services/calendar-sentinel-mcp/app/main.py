"""Atlas Calendar Sentinel — FastAPI HTTP service.

Endpoints:
  GET  /health            — liveness
  POST /refresh           — recompute conflicts for all cycles (clears + writes)
  GET  /conflicts         — list current conflicts
  GET  /cutoff/{iso}      — next cutoff for a country in multiple timezones

Auth: X-Playroll-Auth header on POST routes.
"""
import os
from fastapi import FastAPI, Header, HTTPException, Path as FPath, Query
from pydantic import BaseModel

from app.conflicts import detect_holiday_conflicts, next_cutoff_in_tz
from app.supabase_client import (
    get_supabase,
    fetch_cycles_for_window,
    fetch_holidays_by_country,
    upsert_conflicts,
    get_country_id_map,
)


app = FastAPI(title="Atlas Calendar Sentinel", version="0.1.0")

SECRET = os.environ.get("PYTHON_SERVICE_SECRET", "")


def require_auth(header_value: str | None) -> None:
    if SECRET and header_value != SECRET:
        raise HTTPException(status_code=401, detail="unauthorized")


@app.get("/health")
async def health():
    return {"ok": True, "service": "calendar-sentinel", "version": "0.1.0"}


class RefreshResponse(BaseModel):
    cycles_checked: int
    conflicts_detected: int
    conflicts_written: int


@app.post("/refresh", response_model=RefreshResponse)
async def refresh(x_playroll_auth: str | None = Header(default=None)):
    require_auth(x_playroll_auth)

    sb = get_supabase()

    # Clear existing unresolved conflicts so we don't accumulate duplicates
    sb.table("calendar_conflicts").delete().is_("resolved_at", "null").execute()

    cycles = fetch_cycles_for_window()
    holidays = fetch_holidays_by_country()
    conflicts = detect_holiday_conflicts(cycles, holidays)

    country_id_map = get_country_id_map()
    written = upsert_conflicts(country_id_map, conflicts)

    return RefreshResponse(
        cycles_checked=len(cycles),
        conflicts_detected=len(conflicts),
        conflicts_written=written,
    )


@app.get("/conflicts")
async def list_conflicts(
    country_iso: str | None = Query(default=None),
    severity: str | None = Query(default=None),
    include_resolved: bool = Query(default=False),
):
    sb = get_supabase()
    q = sb.table("calendar_conflicts").select(
        "id,country_id,cycle_id,conflict_date,conflict_type,severity,"
        "suggested_shift_date,explanation,resolved_at,countries(iso_code,name)"
    ).order("conflict_date")
    if not include_resolved:
        q = q.is_("resolved_at", "null")
    if severity:
        q = q.eq("severity", severity)
    resp = q.execute()
    rows = resp.data or []
    if country_iso:
        rows = [r for r in rows if r["countries"]["iso_code"] == country_iso]
    return {"conflicts": rows, "count": len(rows)}


@app.get("/cutoff/{country_iso}")
async def cutoff_for_country(
    country_iso: str = FPath(...),
    employer_tz: str = Query(default="UTC"),
):
    """Return the next cutoff for the given country in UTC + country TZ + employer TZ."""
    sb = get_supabase()
    from datetime import date
    today = date.today().isoformat()
    resp = sb.table("payroll_cycles").select(
        "id,cycle_month,cutoff_at,status,countries(iso_code)"
    ).gte("cutoff_at", today).order("cutoff_at").limit(1).execute()
    rows = [r for r in (resp.data or []) if r["countries"]["iso_code"] == country_iso]
    if not rows:
        raise HTTPException(status_code=404, detail=f"no upcoming cycle for {country_iso}")
    c = rows[0]
    cycle = {
        "cycle_id": c["id"],
        "country_iso": country_iso,
        "cycle_month": c["cycle_month"],
        "cutoff_at": c["cutoff_at"],
    }
    return next_cutoff_in_tz(cycle, employer_tz=employer_tz)
