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


def fetch_cycles_for_window(days: int = 90) -> list[dict]:
    sb = get_supabase()
    resp = sb.table("payroll_cycles").select(
        "id,country_id,cycle_month,cutoff_at,status,countries(iso_code)"
    ).execute()
    out = []
    for c in resp.data or []:
        out.append({
            "cycle_id": c["id"],
            "country_iso": c["countries"]["iso_code"],
            "cycle_month": c["cycle_month"],
            "cutoff_at": c["cutoff_at"],
        })
    return out


def fetch_holidays_by_country() -> dict[str, list[dict]]:
    sb = get_supabase()
    resp = sb.table("public_holidays").select(
        "holiday_date,name,countries(iso_code)"
    ).execute()
    by_country: dict[str, list[dict]] = {}
    for h in resp.data or []:
        iso = h["countries"]["iso_code"]
        by_country.setdefault(iso, []).append({
            "date": h["holiday_date"],
            "name": h["name"],
        })
    return by_country


def upsert_conflicts(country_id_by_iso: dict[str, str], conflicts: list[dict]) -> int:
    if not conflicts:
        return 0
    sb = get_supabase()
    rows = []
    for c in conflicts:
        cid = country_id_by_iso.get(c["country_iso"])
        if not cid:
            continue
        rows.append({
            "country_id": cid,
            "cycle_id": c.get("cycle_id"),
            "conflict_date": c["conflict_date"],
            "conflict_type": c["conflict_type"],
            "severity": c["severity"],
            "suggested_shift_date": c.get("suggested_shift_date"),
            "explanation": c["explanation"],
        })
    if not rows:
        return 0
    # We don't have a unique constraint that would trigger upsert semantics,
    # so insert fresh rows. Call sites dedupe before calling.
    sb.table("calendar_conflicts").insert(rows).execute()
    return len(rows)


def get_country_id_map() -> dict[str, str]:
    sb = get_supabase()
    resp = sb.table("countries").select("id,iso_code").execute()
    return {c["iso_code"]: c["id"] for c in (resp.data or [])}
