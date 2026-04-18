# Playroll Ops — Design Spec

| Field | Value |
|---|---|
| Date | 2026-04-18 |
| Author | Kelly Jafta |
| Status | Approved for implementation |
| Target ship | 2026-04-20 (Sunday 23:00) |
| Target hiring audience | Playroll (primary), general senior fullstack hiring managers (secondary) |

---

## 1. Goal

Build a **functional payroll operations dashboard** that serves as a portfolio artefact for a Senior Global Payroll Operations Associate application at Playroll (and, more broadly, as a senior fullstack engineering showcase).

The dashboard must:

1. Read as a **complete payroll ops suite**, not a collection of demo widgets — a hiring manager clicking around should believe it is a real product in production
2. Showcase **five AI-powered automations** that solve niche, under-documented payroll ops frictions surfaced in the prior Valyu research
3. Demonstrate **expert frontend craft** — editorial typography, monospace tabular numerics, disciplined colour, restraint. Explicitly *not* generic Claude UI output
4. Demonstrate **real architectural depth** — six deployed services, MCP servers, n8n workflows, Supabase with RLS, proper CI — not a single-repo toy

## 2. Success criteria

- `https://playroll-ops.vercel.app` loads a polished marketing landing for anonymous visitors
- Demo sign-in at `demo@playroll-ops.app` renders the authenticated suite in < 2s
- All 5 innovation pages navigable, each executes at least one real external API call when exercised (Claude, ExchangeRate-API, or OpenHolidaysAPI)
- Both light and dark themes render cleanly on every page
- GitHub repo is public, MIT licensed, installable via `pnpm install && pnpm dev` in < 5 minutes on a fresh clone
- README contains the 5 elevator pitches from the niche research, three dashboard screenshots, and an MCP config snippet for Claude Desktop
- A 5-minute unlisted Loom walkthrough is linked from the README

## 3. Non-goals

- No real multi-country payroll calculation engine (commoditised per baseline research — out of scope)
- No real HRIS / banking / accounting integrations (they are designed as Prototype/Roadmap states)
- No SOC 2 / ISO 27001 / GDPR formal compliance certification (acknowledged, mocked in UI)
- No mobile-native app (responsive web only, desktop-first)
- No multi-tenancy beyond a single demo organisation

## 4. Approach

**Type:** functional prototype with real backend, realistic seeded data, 5 fully-wired innovations + supporting pages designed as Prototype or Roadmap to create a full-suite feel.

**Feature strategy:** all 21 niche pain points from the research are present in the suite in some form (pages, roadmap cards, or implied by the data model). The 5 prioritised automations are built end-to-end. Baseline features from the industry-standard research appear as Prototype/Roadmap pages (employee directory, filings tracker, integrations, reports, settings) to establish the suite is comprehensive without competing with real platforms on features that are commoditised.

**Pitch angle:** the research identified that ADP launched an enterprise Payroll Variance AI Agent on 2026-01-28 for 40+ countries, but the mid-market and EOR-specific gap is uncontested. This build targets that gap. The README frames the project as "what Playroll could ship to close the ADP gap for their mid-market customers."

## 5. Aesthetic direction — Editorial Dashboard

Chosen over two alternatives (LexFlow-sibling cream-warm, and Linear-modern-dark) because:

1. Nobody builds payroll dashboards editorially. Deel, Rippling, Papaya default to sans-saturated SaaS. Editorial aesthetic is instantly differentiated.
2. Serif display + monospace tabular numerals is the "senior designer was here" signal hiring managers notice immediately.
3. It bridges LexFlow's warm editorial voice without copying it.
4. Matches Playroll's actual positioning (compliance-first, serious, emerging markets) rather than playful SaaS.

**Reference sources** (saved in `docs/references/`):
- **Stripe Dashboard** — row density, hairline dividers, pill status tags, tabular numerals
- **Axiom logs** — operational dark-mode density, multi-series chart discipline
- **Plausible Analytics** — gold standard for "context not isolation" (every KPI has a delta)
- **Railway dashboard** — monospace + sans pairing done seriously
- **Better Stack** — confident dark marketing treatment
- **Dribbble Dashboard** — humane warm-cream operational aesthetic
- **Awwwards Optikka** — the aesthetic lock: warm cream + ultra-thin grid lines + editorial serif display + micro-caps monospace corner labels + single warm orange accent
- **Lunitalia** — editorial magazine serif mood

## 6. Design tokens

### Palette — Light (default brand mode)

```
--bg-page        #F1EBDB   (warm cream)
--bg-surface     #FAF5E7
--bg-muted       #E8E1CC
--ink-primary    #1A1917
--ink-secondary  #4A4740
--ink-tertiary   #8C887D
--rule           #D9D2BE
--accent         #C24A1F   (burnt sienna)
--accent-hover   #A03A12
--status-ok      #3D6B3D   (muted forest)
--status-warn    #B8791F   (aged mustard)
--status-crit    #A33624
```

### Palette — Dark (ops mode)

```
--bg-page        #0E0E0C
--bg-surface     #1A1A17
--bg-muted       #242420
--ink-primary    #F1EBDB
--ink-secondary  #B5AE9A
--ink-tertiary   #7A7566
--rule           #2E2D28
--accent         #E87142
--status-ok      #6FA86F
--status-warn    #D99B3A
--status-crit    #D85A42
```

### Type stack (free-tier locked)

```
Display  → Fraunces      (Google Fonts) — section heroes, page titles
Body/UI  → Geist Sans    (free) — all UI text
Numerics → JetBrains Mono (free) — tabular nums enabled for every number

Banned (by frontend-design skill): Inter, Roboto, Arial, Space Grotesk
```

### Type scale

```
display-xl  48 / 1.05 / -0.02em   page titles only
display-lg  36 / 1.10 / -0.015em  section heroes
h1          28 / 1.20 / -0.01em
h2          22 / 1.25
h3          18 / 1.30
body        15 / 1.55
small       13 / 1.50
micro       11 / 1.40 / 0.12em / uppercase   eyebrows, corner labels
mono-data   14 / 1.40 / tabular-nums         every number
```

### Spacing & radius

```
spacing     4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96
radius      cards 4px, buttons 2px, inputs 3px
hairline    1px solid var(--rule)
```

### Chart discipline (Atlassian rules)

```
Categorical palette (max 5): sienna / muted-teal (#4A7A7A) /
  aged-brass (#9B8043) / dusty-plum (#6B5574) / slate (#556270)
Status colours: only --status-ok / warn / crit
Single-line charts preferred
Area fills 8-12% opacity only
No gradients, no 3D, no pie charts
```

### Signature moves

1. Ultra-thin grid lines visible on Dashboard home (Optikka move)
2. Micro-caps monospace eyebrow labels on every page header
3. Serif display + monospace data in the same row
4. Generous negative space in heroes; dense data in grids
5. Hairline dividers only, never solid card borders

## 7. Information architecture

### Shell

Sidebar 240px + Header 56px + main content at max-width 1440px with 48px gutters.

### Top-level navigation (8 sections)

```
PLAYROLL OPS                                          (wordmark, serif display)

● Dashboard                        /                  [Live]
● Payroll                          /payroll           [Live]
   ├ Cycle                         /payroll/cycle
   ├ Inputs       ★ Input Parser   /payroll/inputs    [Live]
   ├ Runs                          /payroll/runs
   ├ Variance     ★ Variance MCP   /payroll/variance  [Live]
   └ FX Watchdog  ★                /payroll/fx        [Live]
● People                           /people            [Live]
   ├ Directory                     /people/directory
   ├ Onboarding                    /people/onboarding
   └ Terminations ★ Checklist Bot  /people/terminations [Live]
● Compliance                       /compliance        [Live]
   ├ Filings                       /compliance/filings
   ├ Calendar     ★ Calendar MCP   /compliance/calendar [Live]
   └ Audit Trail                   /compliance/audit
● Automations                      /automations       [Live]
● Integrations                     /integrations      [Prototype]
● Reports                          /reports           [Prototype]
● Settings                         /settings          [Roadmap]
```

★ marks the five signature innovations.

### Status tag system (every page)

- `Live` — wired to real Supabase data / real automation
- `Prototype` — scripted realistic data, visual flow works, logic stubbed
- `Roadmap` — beautifully designed empty state with v2 marker

### Page header pattern (non-dashboard)

```
OPERATIONS · CYCLE              (micro-caps eyebrow)
Payroll variance                (serif display)
Subtitle describing purpose.    (body secondary)

                [filters]  [actions]
──────────────────────────────── (hairline)

main content
```

### Auth + routing

- `/` public marketing landing (SEO-indexable)
- `/sign-in` `/sign-up` Supabase Auth
- `/app/*` route group — authenticated, RLS-protected
- Demo account: `demo@playroll-ops.app` with 48 employees across 6 countries (ZA, GB, US, DE, AU, AE)

## 8. Page-by-page layout

### 8.1 Dashboard `/` — must deliver "are we on track this cycle" in < 5 seconds

Layout rows (top to bottom):

1. **Page header**: eyebrow (OPERATIONS · APRIL 2026), serif greeting ("Good morning, Kelly."), subtitle with cycle/cutoff/country count
2. **Cycle status (70%) + Critical alerts (30%) split**: total payroll + delta + country-allocation bar + cutoff countdown / 2 items needing attention
3. **The Five hero strip**: 5 cards in a row, one per innovation, each showing primary metric + status tag + arrow to dedicated page
4. **KPI strip**: 5 columns — accuracy %, on-time payment %, cycle time days, query response hours, compliance filing % — every metric with a delta (Plausible principle)
5. **Country grid**: 6 cards (3×2), each with flag + country name (serif) + employee count + monthly gross (mono) + next cutoff + status tag
6. **Recent activity (50%) + Upcoming filings (50%) split**: reverse-chron log / upcoming deadlines

### 8.2 `/payroll/cycle` — Cycle operational view

Gantt-style timeline (70%) showing 5-7 day cycle with current position + per-step status + owner + countdown. Per-country cutoff panel (30%) with timezone-adjusted times.

### 8.3 `/payroll/inputs` — ★ Input Parser inbox

Two-pane. Left: inbox list (source icon, sender, timestamp, raw text preview). Right: selected message expanded with parsed structured output (employee match with confidence badge, change type, amount, effective date, ambiguity flags in amber). Actions: Approve & send / Edit / Flag. Top metrics: parsed today / confidence avg / human intervention %.

### 8.4 `/payroll/runs` → `/payroll/runs/[id]` — Run list + detail

List: hairline-divided rows, one per country-cycle, mono amounts right-aligned. Detail: employee-by-employee breakdown with gross/tax/net columns; row expansion shows deduction detail.

### 8.5 `/payroll/variance` — ★ Variance Narrator

Top: cycle total vs prior with 6-month trend chart. Middle: variance table, one row per country, each with auto-narrated body-serif paragraph ("Germany up 4.2% — 2 new hires contributing €8,400 + 3% merit cycle for 3 employees + EUR strengthened 1.1%"). Filters: threshold slider, cause-type chips, country multiselect. **"Ask in Claude" button** opens a drawer with conversational MCP query.

### 8.6 `/payroll/fx` — ★ FX Watchdog

Currency-pair grid. Columns: pair, mid-market (live), applied rate, spread %, cycle leakage, YTD leakage, 30-day sparkline. Summary header: total leakage cycle / YTD / projected annual. Configurable alert threshold.

### 8.7 `/people/directory` — Employee directory

Editorial table: serif name, country flag + country name, role, start date, monthly gross (mono right-align), status. Filters: country multiselect, employment type, status. Row click → detail drawer.

### 8.8 `/people/terminations` — ★ Termination Checklist Bot

List of active + historical terminations. Active view shows the generated checklist panel: jurisdiction header, each item with deadline countdown, owner avatar, status pill, evidence upload. Checklist generation timestamp visible (proves real-time generation from webhook).

### 8.9 `/compliance/calendar` — ★ Calendar Sentinel

Top: monthly calendar across all 6 countries, colour-coded by country, conflicts highlighted in crit-red. Below: conflict report table with "what would break" explanation. Sidebar: MCP query input.

### 8.10 `/compliance/filings` — Filings tracker

Table: filing type, country, period, due date, status, days remaining. Amber at 14 days, crit at 3 days.

### 8.11 `/compliance/audit` — Audit trail

Flat reverse-chron log of system events.

### 8.12 `/automations` — Catalog

Five innovations as full-bleed cards in 2+3 grid. Each: name (serif), one-sentence pitch, live status, core metric (items processed / hours saved / cost avoided), open button.

### 8.13 `/integrations` — Prototype

Grid of integration cards (BambooHR, HiBob, Workday, Xero, QuickBooks, SWIFT, SEPA, ACH, Okta, Slack). Most marked Roadmap; BambooHR + Slack marked Prototype with fake-live indicators.

### 8.14 `/reports` — Prototype

Four chart tiles: payroll accuracy trend, cycle time by country, FX leakage cumulative, cost per payslip vs target. Atlassian single-colour discipline.

### 8.15 `/settings` — Roadmap

Three sub-sections as empty states: Users & Permissions, Pay Schedules, Tax Tables. Editorial v2 marker.

### 8.16 `/` — Marketing landing (public)

Single scroll. Hero with serif display + Optikka-style grid corners. Sections: problem (21 niche pain summary), five automations bento, credibility (Dedukto MCP architecture, ADP Jan-2026 context). Footer: "Built for a Playroll application."

## 9. Data model

17 tables across 7 groups. Supabase Postgres. Every table has `id uuid`, `created_at`, `updated_at`, and (where relevant) `organization_id` for RLS.

**A. Identity & Organisation**: `profiles`, `organizations`, `organization_members`

**B. Reference data** (public, no RLS): `countries`, `public_holidays`, `tax_forms`, `fx_pairs`

**C. Workforce**: `employees`, `employee_events` (change audit trail — drives variance)

**D. Payroll operations**: `payroll_cycles`, `payroll_runs`, `payroll_line_items`

**E. Compliance**: `filings`

**F. Automation feature tables**:
- Input Parser: `input_messages`, `input_parse_results`
- FX Watchdog: `fx_rates`, `fx_leakage`
- Variance Narrator: `variances`
- Termination Checklist: `terminations`, `termination_checklist_items`
- Calendar Sentinel: `calendar_conflicts`

**G. System**: `audit_log`, `alerts`

### Row-Level Security

Simple org-scoped pattern on every table with `organization_id`:

```sql
-- read: any member
-- write: owner/admin only
```

Reference tables are readable by any authenticated user.

### Seed (one TypeScript file, `supabase/seed.ts`)

- 1 organisation ("Playroll Ops Demo")
- 2 users (owner + viewer)
- 6 countries (ZA / GB / US / DE / AU / AE) with metadata
- ~90 public holidays for 2026-2027
- **48 employees** distributed ZA 18 / GB 11 / US 8 / DE 5 / AU 4 / AE 2 with realistic names, salary bands, titles
- 36 payroll cycles (6 months × 6 countries), all closed except current one at `inputs_open` 3 days pre-cutoff
- ~1,800 payroll line items
- 90 days of FX rates with realistic spreads
- ~24 pre-narrated variances across past cycles
- 20 realistic input messages (Slack/email/WhatsApp)
- 1 active urgent termination (DE, 2h before cutoff) + 3 historical
- ~28 filings (mix of statuses)
- ~6 calendar conflicts (2 open, 4 resolved)
- ~120 audit log entries spanning last 14 days
- 3 active dashboard alerts

All names, addresses, IDs fabricated.

## 10. Services architecture

Six services total.

| Service | Stack | Host |
|---|---|---|
| playroll-ops-web | Next.js 16 + React 19 + TS + Tailwind v4 | Vercel |
| Supabase project | Postgres + Auth | Supabase Cloud |
| n8n (self-hosted) | n8nio/n8n Docker | Render |
| variance-narrator-mcp | Python + FastAPI + MCP SDK | Render |
| calendar-sentinel-mcp | Python + FastAPI + MCP SDK | Render |
| fx-watchdog | Python + FastAPI | Render |

Free tiers across the board. Total monthly cost under $10.

### n8n workflows (two)

**`input-parser`**: webhook → Supabase fetch message → Claude Haiku structured parse → code node validation → Supabase write parse result → audit log → webhook response.

**`termination-checklist`**: webhook → Supabase fetch employee + country rules → Claude Sonnet jurisdiction-specific prompt → code node structuring → Supabase insert termination + checklist items → optional Slack post → webhook response.

Both exported to JSON and committed to `services/n8n/workflows/`.

### Python MCP servers

Both expose both HTTP (for Next.js API routes) and stdio (for Claude Desktop MCP config).

**variance-narrator-mcp tools**: `list_variances`, `narrate_variance`, `query_cycle_summary`.

**calendar-sentinel-mcp tools**: `check_date`, `list_conflicts`, `next_cutoff`.

README ships with Claude Desktop MCP config snippet so a hiring manager can point their own Claude at the servers.

### Auth between services

- UI → Supabase: JWT cookie + RLS
- Next.js API routes → Supabase: service role key (server-only)
- Next.js → Python services + n8n: HMAC-signed `X-Playroll-Auth` header
- Python services → Supabase + Anthropic: env-scoped API keys

### Repository structure

```
playroll-ops/
├── apps/web/                       Next.js app
├── services/
│   ├── n8n/workflows/              exported JSON
│   ├── variance-narrator-mcp/
│   ├── calendar-sentinel-mcp/
│   └── fx-watchdog/
├── supabase/
│   ├── migrations/                 7 SQL files (groups A-G)
│   └── seed.ts
├── packages/shared-types/          DB-mirrored TS types
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DESIGN-TOKENS.md
│   ├── N8N-WORKFLOWS.md
│   ├── MCP-CONFIG.md
│   └── PLAYROLL-PITCH.md           the 5 elevator pitches
├── .github/workflows/ci.yml        typecheck + tests
├── turbo.json
├── pnpm-workspace.yaml
└── README.md
```

## 11. The five innovations — per-feature spec

### 11.1 Input Parser (NP-01, Pain: unstructured payroll input)

**Stack**: n8n workflow + Claude Haiku + Supabase

**Flow**: UI "Simulate new message" → Next.js API → n8n webhook → Claude Haiku parse → Supabase write → UI re-read

**Live criterion**: at least 3 seeded messages parse successfully with real Claude calls, ambiguity flags render, approve button writes an `employee_events` row

### 11.2 FX Watchdog (NP-02, Pain: FX spread opacity)

**Stack**: Python + ExchangeRate-API + Supabase

**Flow**: UI "Run FX check" OR Vercel cron → Next.js API → Python service → fetch mid-market rates → compute spread vs seeded applied rate → write fx_rates + fx_leakage → return summary

**Live criterion**: FX page shows 5 currency pairs with real mid-market rates pulled today, cycle leakage computed, sparklines rendered

### 11.3 Variance Narrator (NP-06, Pain: variance with no narrative)

**Stack**: Python MCP + Claude Sonnet + Supabase

**Flow**: Seeded narrations ready on page load (pre-computed in seed.ts). Live "Narrate variance" button calls Python MCP HTTP endpoint → Claude Sonnet → writes narration_text back.

**Live criterion**: page shows 8+ pre-narrated variances; clicking "Narrate" on an un-narrated one produces a fresh Claude paragraph within 5s; "Ask in Claude" drawer renders (even if MCP stdio config is for hiring manager to set up later)

### 11.4 Termination Checklist Bot (NP-20 + NP-07)

**Stack**: n8n workflow + Claude Sonnet + Supabase

**Flow**: UI "Log termination" → Next.js API → n8n webhook → Claude Sonnet jurisdiction-specific prompt → structured checklist → Supabase insert + optional Slack post

**Live criterion**: logging a termination generates a jurisdiction-specific checklist with at least 6 items, each with a statutory deadline, within 10s

### 11.5 Calendar Sentinel (NP-19 + NP-10)

**Stack**: Python MCP + OpenHolidaysAPI + Supabase

**Flow**: Seeded conflicts on page load. "Refresh calendar" button calls Python MCP → re-computes conflicts against public_holidays + payroll_cycles → writes calendar_conflicts

**Live criterion**: calendar shows all 6 countries, 2+ conflicts flagged, MCP query input returns structured answer for "next cutoff for South Africa"

## 12. Weekend execution schedule (summary)

**Friday 18:00 → 01:00 (7h)**: Repo, Supabase schema, migrations, shell layout, design tokens, auth.

**Saturday 08:00 → 13:00 (5h)**: n8n on Render, both workflows built and exported, seed script written and run.

**Saturday 13:00 → 18:00 (5h)**: 3 Python services scaffolded and deployed, Dashboard home built (hero → cycle status → Five strip → KPI strip).

**Saturday 19:00 → 01:00 (6h)**: Dashboard country grid + activity; Input Parser inbox; FX Watchdog page; Termination Checklist page.

**Sunday 10:00 → 15:00 (5h)**: Variance Narrator page; Calendar Sentinel page; Payroll/Cycle; People/Directory.

**Sunday 15:00 → 20:00 (5h)**: Payroll/Runs; Compliance/Filings + Audit; Automations catalog; Integrations + Reports + Settings empty states; Marketing landing.

**Sunday 20:00 → 00:00 (4h)**: Dark mode pass; responsive pass; Vercel deploy; README; Loom walkthrough; ship.

**Total: ~37 hours with ~2.5h contingency.**

### Discipline rules

1. No rabbit holes — 25% over any block budget means ship current quality and move on
2. No refactoring — first pass is shipping pass
3. Invoke `frontend-design` skill on every UI file write
4. Commit hourly with conventional messages
5. No scope debates once execution begins

### Cut-list (in order of sacrifice if time slips)

1. Marketing landing `/` → holding page
2. Reports page polish → empty state stays
3. Compliance/Audit detail → flat log
4. Dashboard country grid → 3 cards + "see all"
5. Loom walkthrough → record Monday
6. Responsive pass → desktop-only, footnoted

**Never cut**: Dashboard + 5 innovations, dual theme parity, all 6 services live, README, design-token fidelity.

## 13. Shipping criteria (Sunday 23:00 go/no-go)

- [ ] Marketing landing renders for anonymous visitors
- [ ] Demo account sign-in works, dashboard renders < 2s
- [ ] All 5 innovation pages navigable and interactive (at least one real external API call per innovation — Claude API, ExchangeRate-API, or OpenHolidaysAPI as applicable)
- [ ] Dark mode works on every page
- [ ] Loom walkthrough URL in README
- [ ] Repo public on GitHub with MIT license
- [ ] `pnpm install && pnpm dev` works from a fresh clone in < 5 minutes

## 14. Risks and mitigations

| Risk | Mitigation |
|---|---|
| n8n cold-start on Render free tier (~30s first hit) | Ping warm-up endpoint 60s before any demo; document in README |
| Render cold-start on Python services | Same as above; also the variance + calendar pages pre-seed narrations/conflicts so first paint is instant |
| Claude API errors during demo | Pre-seeded narrations / parsed messages / checklists all render offline; live calls add to the pool but are not required for pages to look full |
| Vercel Edge Runtime conflicts with `@supabase/ssr` | Use Node runtime explicitly where needed; tested Friday evening |
| Time slip on Saturday | Cut-list in priority order from Section 12; never touch the "never cut" list |
| Real BambooHR / Slack OAuth burning hours | Not attempted. Slack post is optional; BambooHR trigger is simulated. README calls this out as the production path explicitly. |

## 15. Out-of-scope (explicit list so nothing sneaks back in)

- Real BambooHR / HiBob / Workday API integration
- Real SWIFT / SEPA / ACH banking integration
- Real Gmail / Slack / WhatsApp webhook subscription
- Real Playroll API integration
- Mobile-native clients
- Offline mode
- Multi-tenant UX (>1 organisation per user)
- Onboarding flow for new orgs (seeded demo org is the only one)
- Billing / pricing pages
- Admin user management UI
- Password reset flow (Supabase default only)
- Email notification service

---

**Ready for writing-plans skill to turn this into a per-day implementation plan.**
