from datetime import date
from app.conflicts import (
    is_weekend,
    previous_business_day,
    detect_holiday_conflicts,
    next_cutoff_in_tz,
)


def test_is_weekend():
    assert is_weekend(date(2026, 4, 18))  # Saturday
    assert is_weekend(date(2026, 4, 19))  # Sunday
    assert not is_weekend(date(2026, 4, 17))  # Friday


def test_previous_business_day_skips_weekend():
    # Monday 2026-04-20 -> previous business day should be Friday 2026-04-17
    result = previous_business_day(date(2026, 4, 20), holidays=set())
    assert result == date(2026, 4, 17)


def test_previous_business_day_skips_holiday():
    # If Friday is a holiday, should go to Thursday
    result = previous_business_day(
        date(2026, 4, 20),
        holidays={"2026-04-17"},
    )
    assert result == date(2026, 4, 16)


def test_detect_holiday_conflict_when_cutoff_on_public_holiday():
    cycles = [{
        "cycle_id": "c1",
        "country_iso": "ZA",
        "cycle_month": "2026-04-01",
        "cutoff_at": "2026-04-27T17:00:00+00:00",  # Freedom Day (ZA)
    }]
    holidays = {
        "ZA": [{"date": "2026-04-27", "name": "Freedom Day"}],
    }
    conflicts = detect_holiday_conflicts(cycles, holidays)
    assert len(conflicts) == 1
    assert conflicts[0]["severity"] == "crit"
    assert "Freedom Day" in conflicts[0]["explanation"]
    assert conflicts[0]["suggested_shift_date"] == "2026-04-24"  # Previous Friday


def test_detect_holiday_conflict_when_cutoff_on_weekend():
    cycles = [{
        "cycle_id": "c2",
        "country_iso": "GB",
        "cycle_month": "2026-04-01",
        "cutoff_at": "2026-04-18T17:00:00+00:00",  # Saturday
    }]
    holidays = {"GB": []}
    conflicts = detect_holiday_conflicts(cycles, holidays)
    assert len(conflicts) == 1
    assert conflicts[0]["severity"] == "warn"
    assert "Saturday" in conflicts[0]["explanation"]
    assert conflicts[0]["suggested_shift_date"] == "2026-04-17"  # Friday


def test_no_conflict_when_cutoff_on_weekday():
    cycles = [{
        "cycle_id": "c3",
        "country_iso": "US",
        "cycle_month": "2026-04-01",
        "cutoff_at": "2026-04-22T17:00:00+00:00",  # Wednesday, no holiday
    }]
    holidays = {"US": []}
    conflicts = detect_holiday_conflicts(cycles, holidays)
    assert len(conflicts) == 0


def test_next_cutoff_in_tz_converts_across_zones():
    cycle = {
        "cycle_id": "c4",
        "country_iso": "ZA",
        "cycle_month": "2026-04-01",
        "cutoff_at": "2026-04-25T15:00:00+00:00",
    }
    result = next_cutoff_in_tz(cycle, employer_tz="Europe/London")
    assert result["country_iso"] == "ZA"
    # ZA is UTC+2, so 15:00 UTC = 17:00 SAST
    assert "17:00:00" in result["cutoff_country"]
    # BST in April is UTC+1, so 15:00 UTC = 16:00 BST
    assert "16:00:00" in result["cutoff_employer"]


def test_cycle_in_country_with_no_holidays_still_works():
    cycles = [{
        "cycle_id": "c5",
        "country_iso": "XX",  # unknown country
        "cycle_month": "2026-04-01",
        "cutoff_at": "2026-04-22T17:00:00+00:00",
    }]
    conflicts = detect_holiday_conflicts(cycles, holidays_by_country={})
    assert conflicts == []
