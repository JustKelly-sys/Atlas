import pytest
from app.narrate import build_narration_prompt, classify_cause


def test_prompt_includes_all_key_fields():
    cycle = {
        "country_name": "Germany",
        "country_iso": "DE",
        "cycle_month": "2026-03-01",
        "total_gross_amount": 34100.0,
        "prior_total_gross_amount": 32700.0,
        "currency": "EUR",
    }
    variance = {"variance_pct": 4.2, "variance_amount": 1400.0, "cause_hint": "headcount"}
    events = [
        {"event_type": "hire", "effective_date": "2026-03-15", "details": "SWE hire"},
    ]
    p = build_narration_prompt(cycle, variance, events)
    assert "Germany" in p
    assert "DE" in p
    assert "4.2" in p
    assert "1,400" in p or "1400" in p
    assert "hire" in p.lower()


def test_prompt_handles_no_events():
    cycle = {
        "country_name": "UK",
        "country_iso": "GB",
        "cycle_month": "2026-02-01",
        "total_gross_amount": 50000.0,
        "prior_total_gross_amount": 49000.0,
        "currency": "GBP",
    }
    variance = {"variance_pct": 2.0, "variance_amount": 1000.0, "cause_hint": "none"}
    p = build_narration_prompt(cycle, variance, [])
    assert "no events on record" in p.lower()


def test_classify_cause_uses_hint_when_provided():
    v = {"variance_pct": 5.0, "variance_amount": 1000, "cause_hint": "bonus"}
    assert classify_cause(v, []) == "bonus"


def test_classify_cause_infers_headcount_from_hire_event():
    v = {"variance_pct": 5.0, "variance_amount": 1000, "cause_hint": ""}
    events = [{"event_type": "hire", "effective_date": "2026-03-15", "details": ""}]
    assert classify_cause(v, events) == "headcount"


def test_classify_cause_infers_rate_from_rate_change():
    v = {"variance_pct": 5.0, "variance_amount": 1000, "cause_hint": ""}
    events = [{"event_type": "rate_change", "effective_date": "2026-03-01", "details": ""}]
    assert classify_cause(v, events) == "rate"


def test_classify_cause_infers_bonus():
    v = {"variance_pct": 5.0, "variance_amount": 1000, "cause_hint": ""}
    events = [{"event_type": "bonus", "effective_date": "2026-03-10", "details": ""}]
    assert classify_cause(v, events) == "bonus"


def test_classify_cause_unexplained_when_no_signals():
    v = {"variance_pct": 5.0, "variance_amount": 1000, "cause_hint": ""}
    assert classify_cause(v, []) == "unexplained"


def test_negative_variance_formatted_with_sign():
    cycle = {
        "country_name": "US",
        "country_iso": "US",
        "cycle_month": "2026-03-01",
        "total_gross_amount": 80000.0,
        "prior_total_gross_amount": 85000.0,
        "currency": "USD",
    }
    v = {"variance_pct": -5.9, "variance_amount": -5000.0, "cause_hint": "headcount"}
    p = build_narration_prompt(cycle, v, [])
    assert "-5.9" in p
