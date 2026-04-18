"""ExchangeRate-API client.

Free tier: 1500 requests/month with the Standard plan, or unlimited with
the "Open Access" endpoint which uses USD as base and returns all rates
in one call (which is what we want for multi-pair leakage computation).
"""
import os
import httpx


FX_BASE_URL = os.getenv(
    "EXCHANGERATE_API_BASE",
    "https://open.er-api.com/v6/latest/USD",
)


async def fetch_mid_market_rates() -> dict[str, float]:
    """Returns a dict mapping ISO currency code -> rate to USD (1 unit FOREIGN = X USD).

    The upstream API returns rates as 1 USD = Y FOREIGN, so we invert.
    """
    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.get(FX_BASE_URL)
        resp.raise_for_status()
        data = resp.json()

    rates_per_usd = data.get("rates", {})
    # Invert: 1 foreign unit = (1 / rate_per_usd) USD
    return {
        code: 1.0 / rate for code, rate in rates_per_usd.items() if rate != 0
    }
