# Atlas Calendar Sentinel

Python FastAPI + MCP service solving NP-19 + NP-10 (payroll calendar drift
and multi-country timezone cutoffs). Cross-references seeded payroll cycles
against public holidays + weekends, flags conflicts, and exposes a
conversational interface via MCP for Claude Desktop.

Extends the Dedukto MCP server pattern.

## Endpoints (HTTP)

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Liveness |
| POST | `/refresh` | Clear unresolved + recompute conflicts |
| GET | `/conflicts` | List (filter: country_iso, severity, include_resolved) |
| GET | `/cutoff/{iso}` | Next cutoff in UTC / country TZ / employer TZ |

## MCP tools (stdio)

- `check_date(country_iso, date)`
- `list_conflicts(country_iso?, severity?)`
- `next_cutoff(country_iso, employer_tz?)`

## Tests

```bash
python -m pytest tests/ -v
```

8 tests on weekend detection, business-day walk, conflict detection,
timezone conversion. Offline.

## Claude Desktop config

```json
{
  "mcpServers": {
    "atlas-calendar-sentinel": {
      "command": "python",
      "args": ["-m", "app.mcp_server"],
      "cwd": "/path/to/atlas/services/calendar-sentinel-mcp",
      "env": {
        "SUPABASE_URL": "https://lyvtxizoenxigezrqibz.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "..."
      }
    }
  }
}
```
