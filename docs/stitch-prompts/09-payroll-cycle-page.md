# Claude Design prompt #09 — Payroll / Cycle page

## How to use

**Step 1.** Open the same Atlas project in Claude Design (continue).

**Step 2.** Attach these 2 reference images from `C:\Users\USER-PC\.gemini\antigravity\brain\1fa4ee5a-eb53-46f0-a797-1e9bc935d003\playroll-ops\docs\references\`:

1. `ref-betterstack-uptime.png` — the confident single-status voice + uptime-bar-per-service pattern
2. `ref-railway-dashboard.png` — the breadcrumb + dense operations layout

**Step 3.** Copy everything below the horizontal rule. Paste into Claude Design. Run. Share output.

---

I am attaching two reference images. **From BetterStack**, steal: the **large declarative status** ("All services are online" energy, translated here to "6 of 6 countries on track") and the **uptime-bar-per-service** pattern (used here for per-country cutoff countdown timeline). **From Railway**, steal: the **tab structure** at the top of the work area and the **dense operational table** with mono timestamps.

## What Atlas is (context)
Atlas is a payroll operations suite for mid-market companies across six countries. The Cycle page is the operator's control surface — it tells them where every country is in the 7-stage pipeline and what needs attention next.

## What this page is
This is `/app/payroll/cycle` — the current cycle's live state. A senior payroll ops associate opens this page first every morning.

## Functional requirements
- Reads from Supabase `payroll_cycles`, `countries`, `payroll_runs`.
- Shows the 7-stage pipeline (`inputs_open` → `cutoff` → `posting` → `reconciling` → `approved` → `paid` → `closed`) with the **earliest current stage across all open cycles** highlighted.
- Server component with parallel Supabase queries. No mocking.

## Aesthetic (locked)
Editorial. Palette `#F1EBDB` / `#FAF5E7` / `#1A1917` / `#D9D2BE` / sienna `#C24A1F` / forest/mustard/brick status. Fraunces display, Geist UI, JetBrains Mono every number. 4px/2px radius, hairlines only.

## Shell (already exists)
240px sidebar, 56px header, 1440px max, 48px gutters.

## Layout — four beats

**Beat 1 — Page header.** Eyebrow `OPERATIONS · CYCLE`. Title Fraunces 36px: `Payroll cycle — April 2026`. Subtitle: "Live view of every country's position in the 7-stage cycle, with timezone-aware cutoffs and the earliest global stage highlighted."

**Beat 2 — Metric strip (four columns).** `COUNTRIES OPEN` (6) · `EMPLOYEES IN CYCLE` (696) · `GROSS THIS CYCLE` (`$4.2M` compact mono) · `NEXT CUTOFF` (`2d 14h` coloured warn, live-updating).

**Beat 3 — The Cycle Pipeline (hero block, ~260px tall).** Eyebrow `CYCLE PIPELINE` (left) + `STAGE N / 7` mono pill (right, sienna tint). A **horizontal 7-node pipeline** below, with a thin rail connecting each node. The rail fill shows completed progress in sienna from left. Nodes: circles 40px diameter, 2px border. Done stages (left of current): sienna-filled circle with white Lucide `CheckCircle2`. Current stage: transparent circle with sienna ring + 4px sienna ring-outline, Lucide `Clock` in sienna inside. Future stages: hairline ring only with `Circle` icon in tertiary. Beneath each node: the stage label in Geist 12px (current stage in sienna) + the owner role in mono 10px tertiary (`HR · All countries`, `Payroll ops`, `Finance`, `Finance lead`, `Treasury`, `Payroll ops`).

**Beat 4 — Country cutoffs table.** Below the pipeline, a card with header `COUNTRY CUTOFFS · TIMEZONE-AWARE` + mono sub-line `Local cutoff time is what the ops owner actually operates against.` Table columns: `COUNTRY` (flag + name + ISO + timezone in mono 10px), `STAGE` (StatusTag `Live` or `prototype` + stage label in mono 10px uppercase), `EMPLOYEES` (mono right), `GROSS` (mono right, compact currency), `CUTOFF (UTC)` (mono date short, tertiary ink), `COUNTDOWN` (mono sienna, live-updating, e.g. `2d 14h 32m`). 6 rows — one per country. Realistic data per ZA/GB/US/DE/AU/AE (South Africa 142 employees / R2.84M gross / 21 APR cutoff / 2d 14h). The most imminent cutoff row gets a subtle left-border in sienna.

## Non-negotiables
- Pipeline nodes are perfect circles; do not use chevrons or arrows between them — a thin rail is enough.
- Every timestamp uses `font-feature-settings: "tnum"`.
- No rounded-xl on any card.
- The countdown is the only sienna moment in the table (reinforces urgency).

## Voice
Senior ops showing the state of the world at 7am. Factual, quiet, precise.

## Output
Export React + Tailwind for Next.js 16 App Router. Route: `app/app/payroll/cycle/page.tsx`. Component: `CycleGantt.tsx`.
