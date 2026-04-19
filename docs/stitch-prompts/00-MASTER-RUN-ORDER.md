# Master run-order — all Claude Design prompts

This is the index. Open it once. Walk the list top-to-bottom. Each row tells you: which prompt file to open, which reference images to attach, and what the prompt produces.

**All reference images live in one folder:**
```
C:\Users\USER-PC\.gemini\antigravity\brain\1fa4ee5a-eb53-46f0-a797-1e9bc935d003\playroll-ops\docs\references\
```

**All prompt files live in:**
```
C:\Users\USER-PC\.gemini\antigravity\brain\1fa4ee5a-eb53-46f0-a797-1e9bc935d003\playroll-ops\docs\stitch-prompts\
```

For each prompt: open the `.md` file, find the line starting with `I am attaching …`, copy from there to the end of the file, paste into Claude Design's chat. Attach the reference image files listed in that row. Run.

---

## Suggested run order

Run **top to bottom**. Each prompt is independent (none depend on another having landed first), so if Claude Design misbehaves on one you can skip and come back.

| # | Prompt file | What it adds | Reference images to attach |
|---|---|---|---|
| **01** | *(already run)* Dashboard home | The 6-beat dashboard shell + sidebar + drawers | — |
| **01b** | `01b-dashboard-home-corrections.md` | Optikka full-page grid + Plausible trend chart + BetterStack uptime strip | `ref-Dribble-Landing Page.png`, `ref-plausible-analytics.png.png`, `ref-betterstack-uptime.png` |
| **02** | `02-why-atlas-rationale-page.md` | Long-form "Why Atlas" case-study page + sidebar tab | All 8 reference images |
| **03** | `03-sign-in-welcome-page.md` | Full-bleed atlas-photograph sign-in + name gate, rewires dashboard greeting | `ref-awwards-aesthetic.png` only |
| **04** | `04-inputs-page-np01.md` | Input Parser (NP-01) page — two-pane inbox + parse panel | `ref-Dribble-Dashboard.png`, `ref-stripe-payments.png` |
| **05** | `05-fx-watchdog-page-np02.md` | FX Watchdog (NP-02) page — summary tiles + Plausible trend chart + pair grid | `ref-plausible-analytics.png.png`, `ref-stripe-payments.png` |
| **06** | `06-variance-narrator-page-np06.md` | Variance Narrator (NP-06) page — trend chart + Axiom-dense table + Ask-in-Claude drawer | `ref-axiom-logs.png`, `ref-plausible-analytics.png.png` |
| **07** | `07-calendar-sentinel-page-np19.md` | Calendar Sentinel (NP-19) page — 12-week grid + conflicts + MCP console | `ref-axiom-logs.png`, `ref-Dribble-Landing Page.png` |
| **08** | `08-terminations-page-np20.md` | Termination Checklist (NP-20) page — list + jurisdiction panel + log dialog | `ref-betterstack-uptime.png`, `ref-stripe-payments.png` |
| **09** | `09-payroll-cycle-page.md` | Payroll / Cycle — 7-stage pipeline + country cutoffs table | `ref-betterstack-uptime.png`, `ref-railway-dashboard.png` |
| **10** | `10-payroll-runs-list-and-detail.md` | Runs list + Runs detail (two routes in one prompt) | `ref-railway-dashboard.png`, `ref-stripe-payments.png` |
| **11** | `11-people-directory-page.md` | People / Directory — dense table + filter chips + detail drawer | `ref-stripe-payments.png`, `ref-Dribble-Dashboard.png` |
| **12** | `12-people-onboarding-page.md` | People / Onboarding — Prototype empty-state pipeline | `ref-Dribble-Landing Page.png` |
| **13** | `13-compliance-filings-page.md` | Compliance / Filings — breakdown tiles + table + per-country success strip | `ref-stripe-payments.png`, `ref-betterstack-uptime.png` |
| **14** | `14-compliance-audit-page.md` | Compliance / Audit — Railway log table with severity dots | `ref-railway-dashboard.png`, `ref-axiom-logs.png` |
| **15** | `15-automations-catalog-page.md` | Automations catalog — 5-card bento | `ref-Dribble-Dashboard.png` |
| **16** | `16-integrations-page.md` | Integrations — 10-card Prototype/Roadmap grid | `ref-Dribble-Landing Page.png` |
| **17** | `17-reports-page.md` | Reports — 4-tile Prototype charts + KPI strip | `ref-plausible-analytics.png.png` |
| **18** | `18-settings-page.md` | Settings — Roadmap empty-state | `ref-Dribble-Landing Page.png` |
| **19** | `19-marketing-landing-page.md` | Public marketing landing at `/` | `ref-awwards-aesthetic.png`, `ref-Dribble-Landing Page.png` |

---

## How to paste each prompt

1. Open the `.md` file named in the row
2. Scroll past the header section and the `How to use` steps
3. Find the horizontal rule (`---`) that sits above the line starting with `I am attaching`
4. Select from `I am attaching …` down to the very last line of the file
5. Paste that block into Claude Design's chat panel
6. Attach the reference images listed for that row (drag-and-drop or paperclip button)
7. Send / run
8. When Claude Design returns the updated project, move on to the next row

---

## Full list of reference image filenames (for attachment reference)

All files sit inside `playroll-ops\docs\references\`:

1. `ref-Dribble-Landing Page.png` — Optikka landing (cream, corner rules, edge labels, serif display)
2. `ref-betterstack-uptime.png` — declarative status voice, uptime bars
3. `ref-stripe-payments.png` — dense table, status pills, tabular mono
4. `ref-plausible-analytics.png.png` — single-line chart, KPI strip with deltas (note: `.png.png` IS the real filename)
5. `ref-axiom-logs.png` — dense multi-series grid, coloured dots on log rows
6. `ref-railway-dashboard.png` — `[tag] message · duration` log table
7. `ref-Dribble-Dashboard.png` — insight tile + overlay detail + avatar pills
8. `ref-awwards-aesthetic.png` — Luxitalia full-bleed hero

---

## What each prompt does NOT touch

Every page-level prompt explicitly tells Claude Design "do not touch the sidebar / header / theme tokens / other pages". The shared aesthetic block in each prompt locks the palette, typography, and radii so Claude Design cannot drift across runs. If anything looks different from run to run, paste the drifted output back in this thread and I'll write a surgical correction.

---

## What happens after you run all 19

We have the design of the entire Atlas suite. Next we return to the todo list and **wire Claude Design's outputs into the Next.js project** — the data-fetching logic, API routes, and live Supabase queries are already built from the weekend sprint. Wiring is mostly: swap presentational components, update a few imports, verify data-binding. That's Phase 7 work and it happens in-session with me, not in Claude Design.
