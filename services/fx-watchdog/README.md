# Atlas FX Watchdog

Python FastAPI service that solves NP-02 (FX spread opacity). Fetches today's
mid-market exchange rates from ExchangeRate-API, compares to the applied rate
(seeded; would be OCR'd from real EOR invoices in production), computes per-cycle
and YTD leakage in USD, writes to Supabase.

## Endpoints

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/health` | — | Liveness check |
| GET | `/rates/today` | — | Today's rate snapshot for UI |
| POST | `/run` | `X-Playroll-Auth` | Run FX check, write rates + leakage |

## Local dev

```bash
pip install -r requirements.txt
cp ../../.env.local .env
uvicorn app.main:app --reload --port 10000
```

Then:

```bash
curl -X POST -H "X-Playroll-Auth: <secret>" http://localhost:10000/run
curl http://localhost:10000/rates/today
```

## Tests

```bash
python -m pytest tests/ -v
```

10 tests on pure leakage math. No network required.

## Deploy

```bash
# From repo root
git push — Render auto-deploys on push to main
```

First deploy needs env vars set in Render dashboard: `SUPABASE_SERVICE_ROLE_KEY`
and `PYTHON_SERVICE_SECRET`.
