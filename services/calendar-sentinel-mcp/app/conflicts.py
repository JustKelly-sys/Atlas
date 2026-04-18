"""Pure functions for calendar conflict detection.

A 'conflict' is any situation that causes payroll to miss its cutoff
or pay employees late. Three types supported:

  holiday_on_cutoff    — cutoff date is a public holiday in that country
                         OR a weekend (banks closed).
  timezone_cutoff_miss — approver in TZ-A submits before local cutoff
                         but it's already past UTC cutoff on the
                         employer's side.
  approver_unavailable — reserved for future; we don't compute this yet.
"""
from datetime import date, timedelta, datetime
from zoneinfo import ZoneInfo
from typing import TypedDict


class Holiday(TypedDict):
    date: str  # ISO 8601 YYYY-MM-DD
    name: str


class Cycle(TypedDict):
    cycle_id: str
    country_iso: str
    cycle_month: str
    cutoff_at: str  # ISO 8601 timestamptz


class Conflict(TypedDict):
    country_iso: str
    cycle_id: str | None
    conflict_date: str
    conflict_type: str
    severity: str  # info | warn | crit
    suggested_shift_date: str | None
    explanation: str


def is_weekend(d: date) -> bool:
    return d.weekday() >= 5


def previous_business_day(d: date, holidays: set[str]) -> date:
    """Walk backwards until we hit a weekday that is not a holiday."""
    current = d - timedelta(days=1)
    while is_weekend(current) or current.isoformat() in holidays:
        current -= timedelta(days=1)
        # Safety: bail after 14 days so we never loop forever on bad data
        if (d - current).days > 14:
            return d - timedelta(days=1)
    return current


def detect_holiday_conflicts(
    cycles: list[Cycle],
    holidays_by_country: dict[str, list[Holiday]],
) -> list[Conflict]:
    """For each cycle, check if the cutoff date falls on a weekend or holiday."""
    conflicts: list[Conflict] = []
    for cycle in cycles:
        cutoff = datetime.fromisoformat(cycle["cutoff_at"].replace("Z", "+00:00"))
        cutoff_date = cutoff.date()

        country_holidays = holidays_by_country.get(cycle["country_iso"], [])
        holiday_dates = {h["date"] for h in country_holidays}
        holiday_name_map = {h["date"]: h["name"] for h in country_holidays}

        conflict_reason = None
        if cutoff_date.isoformat() in holiday_dates:
            conflict_reason = f"{holiday_name_map[cutoff_date.isoformat()]} (public holiday)"
            severity = "crit"
        elif is_weekend(cutoff_date):
            conflict_reason = f"{cutoff_date.strftime('%A')} (weekend, banks closed)"
            severity = "warn"
        else:
            continue

        shifted = previous_business_day(cutoff_date, holiday_dates)
        conflicts.append({
            "country_iso": cycle["country_iso"],
            "cycle_id": cycle["cycle_id"],
            "conflict_date": cutoff_date.isoformat(),
            "conflict_type": "holiday_on_cutoff",
            "severity": severity,
            "suggested_shift_date": shifted.isoformat(),
            "explanation": (
                f"Cutoff on {cutoff_date.isoformat()} conflicts with "
                f"{conflict_reason}. Shift submission to "
                f"{shifted.isoformat()} to clear ACH on time."
            ),
        })
    return conflicts


def next_cutoff_in_tz(
    cycle: Cycle,
    employer_tz: str = "UTC",
) -> dict:
    """Given a cycle and the employer's timezone, return cutoff
    converted to: employer local time, country local time, and UTC."""
    cutoff = datetime.fromisoformat(cycle["cutoff_at"].replace("Z", "+00:00"))
    country_tz_map = {
        "ZA": "Africa/Johannesburg",
        "GB": "Europe/London",
        "US": "America/New_York",
        "DE": "Europe/Berlin",
        "AU": "Australia/Sydney",
        "AE": "Asia/Dubai",
    }
    country_tz = country_tz_map.get(cycle["country_iso"], "UTC")
    return {
        "country_iso": cycle["country_iso"],
        "cutoff_utc": cutoff.astimezone(ZoneInfo("UTC")).isoformat(),
        "cutoff_country": cutoff.astimezone(ZoneInfo(country_tz)).isoformat(),
        "cutoff_employer": cutoff.astimezone(ZoneInfo(employer_tz)).isoformat(),
    }
