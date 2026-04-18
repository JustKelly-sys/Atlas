"""Pure functions for FX leakage computation.

All math is unit-tested — we avoid any IO here so the tests run offline.
"""
from decimal import Decimal, ROUND_HALF_UP


def compute_spread_bps(mid_market: float, applied: float) -> int:
    """Basis points between mid-market and the rate actually applied.

    Positive spread means the provider gave you a worse rate (common).
    Returns 0 for equal rates. Can be negative if somehow you got better
    than mid-market.
    """
    if mid_market == 0:
        return 0
    spread_pct = (mid_market - applied) / mid_market
    return int(round(spread_pct * 10_000))


def compute_leakage(
    mid_market: float,
    applied: float,
    amount_local: float,
) -> float:
    """Absolute leakage in USD for a single-currency conversion.

    amount_local is in the source currency (e.g. ZAR 50000).
    Returns USD leakage — what the payer lost vs. mid-market.
    """
    if mid_market == 0:
        return 0.0
    usd_at_mid = amount_local * mid_market
    usd_at_applied = amount_local * applied
    leak = usd_at_mid - usd_at_applied
    # Round to 2 dp using banker-safe rounding
    return float(Decimal(str(leak)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))


def sanity_check_rate(rate: float, baseline: float, tolerance_pct: float = 15.0) -> bool:
    """Guard against bad FX data. Returns True if rate is within tolerance of baseline."""
    if baseline == 0:
        return False
    deviation = abs(rate - baseline) / baseline * 100
    return deviation <= tolerance_pct
