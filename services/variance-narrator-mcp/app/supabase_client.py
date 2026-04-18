"""Supabase REST client with service role key."""
import os
from supabase import create_client, Client

_client: Client | None = None


def get_supabase() -> Client:
    global _client
    if _client is None:
        _client = create_client(
            os.environ["SUPABASE_URL"],
            os.environ["SUPABASE_SERVICE_ROLE_KEY"],
        )
    return _client


def fetch_variance_context(variance_id: str) -> dict:
    """Bundle everything the narrator needs: variance + cycle + country + prior cycle + events."""
    sb = get_supabase()
    var_resp = (
        sb.table("variances")
        .select("*,payroll_cycles!inner(*,countries(*))")
        .eq("id", variance_id)
        .single()
        .execute()
    )
    v = var_resp.data
    cycle = v["payroll_cycles"]
    country = cycle["countries"]

    # Prior cycle: most recent closed cycle for this country before cycle_month
    prior_resp = (
        sb.table("payroll_cycles")
        .select("total_gross_amount,cycle_month")
        .eq("country_id", cycle["country_id"])
        .lt("cycle_month", cycle["cycle_month"])
        .order("cycle_month", desc=True)
        .limit(1)
        .execute()
    )
    prior_gross = 0.0
    if prior_resp.data:
        prior_gross = float(prior_resp.data[0]["total_gross_amount"] or 0)

    # Events during this cycle (by effective_date)
    from datetime import date, timedelta
    month_start = cycle["cycle_month"]
    # Add ~31 days to get end-of-month
    ms = date.fromisoformat(month_start)
    me = (ms.replace(day=28) + timedelta(days=4)).replace(day=1)
    evt_resp = (
        sb.table("employee_events")
        .select("event_type,effective_date,new_value")
        .gte("effective_date", month_start)
        .lt("effective_date", me.isoformat())
        .execute()
    )
    events = [
        {
            "event_type": e["event_type"],
            "effective_date": e["effective_date"],
            "details": "",
        }
        for e in (evt_resp.data or [])
    ]

    return {
        "variance": {
            "id": v["id"],
            "variance_amount": float(v["variance_amount"]),
            "variance_pct": float(v["variance_pct"]),
            "cause_hint": v.get("cause_category") or "",
        },
        "cycle": {
            "country_name": country["name"],
            "country_iso": country["iso_code"],
            "cycle_month": cycle["cycle_month"],
            "total_gross_amount": float(cycle.get("total_gross_amount") or 0),
            "prior_total_gross_amount": prior_gross,
            "currency": country["currency"],
        },
        "events": events,
    }


def save_narration(variance_id: str, text: str, model: str, tokens: int) -> None:
    sb = get_supabase()
    sb.table("variances").update(
        {
            "narration_text": text,
            "narration_model": model,
            "narration_tokens": tokens,
        }
    ).eq("id", variance_id).execute()
