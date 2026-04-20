# Atlas — Payroll Operations Dashboard

> A production-grade payroll ops platform. Covers 6 jurisdictions, 17 Supabase tables, 3 Python microservices, and a self-hosted n8n automation layer — all wired to a live Next.js 16 dashboard.

**Live:** [atlas-web-zeta.vercel.app](https://atlas-web-zeta.vercel.app) · **Sign in with:** any name

---

## What it does

Atlas is the internal dashboard a global payroll team would actually use. Not a mockup — real data, real queries, real automations.

**Five elevator pitches:**

1. **Input Parser (NP-01)** — Operators paste raw payroll instructions in natural language. n8n + Gemini parses them into structured line items, flags ambiguities, and queues them for review. Eliminates manual data entry on cycle open day.

2. **FX Watchdog (NP-02)** — Monitors live exchange rates against payroll obligations across ZA, GB, DE, AU, AE, US. Surfaces cycle leakage in real time so finance can hedge before payroll runs, not after.

3. **Variance Narrator (NP-06)** — A Python MCP server that reads variance records, calls Claude, and returns a plain-English explanation of why an employee's pay changed. Kills the "why did my salary change?" ticket queue.

4. **Termination Bot (NP-20)** — When HR logs a termination, n8n triggers a Gemini prompt seeded with jurisdiction-specific rules (BCEA for ZA, ERA for GB, etc.) and generates a statutory checklist — final pay deadlines, COBRA notices, pension deregistration — per country, per case.

5. **Calendar Sentinel (NP-19)** — A Python MCP server that cross-references payroll cutoff dates against public holiday calendars for every active jurisdiction. Flags conflicts 90 days out with AI-generated shift suggestions.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 · React 19 · TypeScript · Tailwind v4 · shadcn/ui |
| Database | Supabase (PostgreSQL · RLS · 17 tables across 7 groups) |
| Automations | n8n self-hosted on Render (Input Parser, Termination Checklist) |
| AI Services | Python FastAPI microservices on Render (Variance Narrator MCP, Calendar Sentinel MCP, FX Watchdog) |
| AI Models | Gemini 2.5 Flash (automations) · Claude Sonnet (variance narration) |
| Hosting | Vercel (frontend) · Render (n8n + Python services) |

---

## Pages

| Route | Description |
|---|---|
| `/app/dashboard` | Live ops overview — cycle status, alerts, automation strip, KPIs, country grid |
| `/app/payroll/cycle` | 7-stage cycle Gantt with timezone-aware cutoffs per country |
| `/app/payroll/runs` | Every regular and off-cycle run, reverse-chronological |
| `/app/payroll/variance` | Variance table with Claude-narrated explanations |
| `/app/payroll/inputs` | n8n-parsed payroll inputs queue |
| `/app/payroll/fx` | FX leakage tracker per cycle and YTD |
| `/app/people` | Employee directory across all jurisdictions |
| `/app/people/terminations` | Active terminations with jurisdiction-specific checklists |
| `/app/compliance/filings` | Statutory filing schedule with urgency indicators |
| `/app/compliance/calendar` | Calendar conflict detector with AI shift suggestions |
| `/app/compliance/audit` | Full audit log |
| `/app/automations` | Live automation catalog (NP-01 through NP-20) |

---

## Architecture

```
Browser → Next.js 16 (Vercel)
            ├── Server components → Supabase (service role, direct queries)
            ├── Client components → Supabase (anon key, RLS-off demo mode)
            ├── API routes → n8n webhooks (Input Parser, Termination Bot)
            └── API routes → Python MCP servers (Variance, Calendar, FX)

n8n (Render)
  ├── Input Parser workflow → Gemini 2.5 Flash → Supabase
  └── Termination Checklist workflow → Gemini 2.5 Flash → Supabase

Python services (Render, FastAPI)
  ├── variance-narrator-mcp → Claude Sonnet → structured narration
  ├── calendar-sentinel-mcp → public holiday APIs → conflict detection
  └── fx-watchdog → ExchangeRate API → leakage calculation
```

---

## MCP Configuration

To connect the Variance Narrator and Calendar Sentinel to Claude Desktop or Claude Code:

```json
{
  "mcpServers": {
    "variance-narrator": {
      "url": "https://atlas-variance-narrator.onrender.com/mcp",
      "headers": {
        "x-service-secret": "<PYTHON_SERVICE_SECRET>"
      }
    },
    "calendar-sentinel": {
      "url": "https://atlas-calendar-sentinel.onrender.com/mcp",
      "headers": {
        "x-service-secret": "<PYTHON_SERVICE_SECRET>"
      }
    }
  }
}
```

---

## Local Development

```bash
# Clone
git clone https://github.com/JustKelly-sys/Atlas.git
cd Atlas

# Install (pnpm workspace)
pnpm install

# Set env vars
cp apps/web/.env.local.example apps/web/.env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# Run
pnpm --filter atlas-web dev
```

Open [localhost:3000](http://localhost:3000) and enter any name to sign in.

---

## Design

Editorial dashboard aesthetic: warm cream default + dark ops mode, Fraunces serif display, Geist sans, JetBrains Mono for data. Burnt sienna accent. Inspired by financial terminals and long-form editorial — dense data with breathing room.

---

Built by [Tshepiso Jafta](https://github.com/JustKelly-sys) · April 2026
