import pytest
from app.leakage import compute_spread_bps, compute_leakage, sanity_check_rate


def test_spread_bps_typical_case():
    # ZAR/USD: mid 0.0535, applied 0.05296 => ~101 bps spread
    bps = compute_spread_bps(0.0535, 0.05296)
    assert 95 <= bps <= 105


def test_spread_bps_zero_mid():
    assert compute_spread_bps(0, 0.05) == 0


def test_spread_bps_equal_rates():
    assert compute_spread_bps(1.27, 1.27) == 0


def test_spread_bps_negative_when_better_rate():
    bps = compute_spread_bps(0.0535, 0.0536)
    assert bps < 0


def test_leakage_on_realistic_zar_payment():
    # Paying R500,000 to a US vendor
    # mid 0.0535, applied 0.0530 => spread 93bps
    # USD at mid = 26,750. USD at applied = 26,500. Leakage = $250
    leak = compute_leakage(0.0535, 0.0530, 500_000)
    assert 240 <= leak <= 260


def test_leakage_zero_when_rates_equal():
    assert compute_leakage(1.27, 1.27, 1_000_000) == 0.0


def test_leakage_rounds_to_cents():
    leak = compute_leakage(0.05, 0.04999, 12_345.67)
    # Difference is tiny but should round cleanly
    assert leak == round(leak, 2)


def test_sanity_check_within_tolerance():
    assert sanity_check_rate(0.054, 0.0535, tolerance_pct=5) is True


def test_sanity_check_outside_tolerance():
    # 20% deviation with 15% tolerance
    assert sanity_check_rate(0.065, 0.0535, tolerance_pct=15) is False


def test_sanity_check_zero_baseline():
    assert sanity_check_rate(1.0, 0, tolerance_pct=5) is False
