# Atlas n8n

Self-hosted n8n running on Render. Hosts two workflows:

- **`input-parser`** — NP-01. Unstructured payroll messages → structured change records via Claude Haiku.
- **`termination-checklist`** — NP-20 + NP-07. BambooHR-style termination payload → jurisdiction-aware checklist via Claude Sonnet.

Exported workflow JSON lives in `workflows/` and is the source of truth. Import on first deploy.

## Deployment

### One-time setup (Render dashboard)

1. **New → Blueprint** at https://dashboard.render.com/blueprints
2. Connect the repo: `JustKelly-sys/Atlas`
3. Point at `services/n8n/render.yaml`
4. Render detects one service: `atlas-n8n`. Click **Apply**.
5. Fill the four `sync:false` env vars when prompted:

   | Key | Value (from `.env.local`) |
   |---|---|
   | `N8N_BASIC_AUTH_PASSWORD` | `x6xOxWjegxY5wiyJs.sN` |
   | `N8N_ENCRYPTION_KEY` | `5e88ba78ad71be371452af86999db2263aba24f87356bff0a9469aa5ee1b98c3` |
   | `DB_POSTGRESDB_PASSWORD` | (Supabase DB password) |

6. **Create Blueprint**. First build takes ~5 minutes.

### First-login flow

Once live at `https://atlas-n8n.onrender.com`:

1. Authenticate with basic auth: user `admin`, password from step 5 above.
2. Complete the n8n setup wizard (owner account — reuse `demo@atlas-ops.app` or a personal email).
3. Skip telemetry prompts.

### Configure credentials inside n8n

Three credentials need to exist before the workflows will run. Create each under **Credentials → New**:

1. **Supabase** (`HTTP Header Auth`)
   - Name: `Supabase service role`
   - Header name: `apikey`
   - Header value: the Supabase service role JWT
   - (We also send `Authorization: Bearer <same>` in workflow HTTP nodes)

2. **Anthropic** (`Header Auth`)
   - Name: `Anthropic API`
   - Header name: `x-api-key`
   - Header value: the Anthropic API key

3. **Slack** (optional, skip if no demo workspace)
   - Name: `Atlas demo Slack`
   - Token: bot user OAuth token

### Import workflows

Once the above credentials exist, import each JSON file under `workflows/` via **Workflows → Import from file**. The workflows reference credentials by name, so names must match exactly.

## Local dev (optional)

```bash
docker run --rm -it -p 5678:5678 \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=localdev \
  -e N8N_ENCRYPTION_KEY=$(openssl rand -hex 32) \
  -v atlas-n8n-data:/home/node/.n8n \
  n8nio/n8n:latest
```

Open `http://localhost:5678`.

## Webhook URLs

After deploy, the workflows listen at:

- `https://atlas-n8n.onrender.com/webhook/input-parser`
- `https://atlas-n8n.onrender.com/webhook/termination`

Both require `X-Playroll-Auth: <N8N_WEBHOOK_SECRET>` header. The Next.js API routes add this automatically.

## Cold starts

Render free tier spins down after 15 minutes of inactivity. First request after that takes ~30 seconds. Before any demo click-through, hit `https://atlas-n8n.onrender.com/healthz` to warm the service.
