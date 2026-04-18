# Atlas Variance Narrator

Python FastAPI + MCP service solving NP-06 (variance investigation with no
audit trail / narrative). Reads payroll variances from Supabase, generates
plain-English explanations via Gemini 2.5 Flash, persists back to the DB.

Extends the Dedukto MCP server architecture — same pattern, different domain.

## Two modes

- **HTTP mode** (FastAPI, `uvicorn app.main:app`) — used by the Next.js
  app for live narration requests.
- **MCP stdio mode** (`python -m app.mcp_server`) — lets a hiring manager
  point their Claude Desktop config at this server and query variance
  data conversationally.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Liveness |
| POST | `/narrate/{id}` | Generate narration for variance id |
| GET | `/variances` | List variances (cycle_id / country_iso filters) |

## MCP tools

| Tool | Purpose |
|---|---|
| `list_variances` | List variances filtered by cycle or country |
| `narrate_variance` | Generate + persist narration for a specific variance |
| `query_cycle_summary` | Totals + variance summary for a cycle |

## Claude Desktop config

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "atlas-variance-narrator": {
      "command": "python",
      "args": ["-m", "app.mcp_server"],
      "cwd": "/path/to/atlas/services/variance-narrator-mcp",
      "env": {
        "SUPABASE_URL": "https://lyvtxizoenxigezrqibz.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "...",
        "GEMINI_API_KEY": "..."
      }
    }
  }
}
```

## Tests

```bash
python -m pytest tests/ -v
```

8 tests on prompt construction + cause classification. Network-free.
