# Claude Design prompt #10 — Payroll / Runs (list + detail)

This single prompt produces two routes: `/app/payroll/runs` (list) and `/app/payroll/runs/[id]` (detail).

## How to use

**Step 1.** Open the same Atlas project in Claude Design (continue).

**Step 2.** Attach these 2 reference images from `C:\Users\USER-PC\.gemini\antigravity\brain\1fa4ee5a-eb53-46f0-a797-1e9bc935d003\playroll-ops\docs\references\`:

1. `ref-railway-dashboard.png` — the dense `[tag] message · duration` log-row pattern
2. `ref-stripe-payments.png` — the data-dense transaction table with pill statuses

**Step 3.** Copy everything below the horizontal rule. Paste into Claude Design. Run. Share output.

---

I am attaching two reference images. **From Railway**, steal: the **dense log table** with a left timestamp column (mono), a message column with bracketed tag prefixes (`[build]`, `[vite]`), and a right-aligned duration column (`636ms`, `773ms`, `Øms`). **From Stripe**, steal: the **row-density + pill-status** for each run's state.

## What Atlas is (context)
Atlas is a payroll operations suite for mid-market companies across six countries. The Runs pages show every payroll run (regular and off-cycle) and their employee-by-employee breakdowns.

## What these pages are
- `/app/payroll/runs` — the list of every run ever, reverse-chron, with one row per country-run.
- `/app/payroll/runs/[id]` — detail view of a single run: every employee who received pay in that run, gross / deductions / net, expandable rows for deduction breakdown.

## Functional requirements
- Reads from Supabase `payroll_runs`, `payroll_cycles`, `payroll_line_items`, `employees`, `countries`.
- List is server-rendered with parallel queries. Detail route uses the run id to fetch line items + cycle metadata.
- Clicking a row on the list → navigates to detail route.
- On detail, clicking an employee row → expands inline to show `Gross / Tax withheld / Social contributions / Other deductions / Net` with FX rate applied (if non-USD currency).

## Aesthetic (locked)
Editorial. Palette `#F1EBDB` / `#FAF5E7` / `#1A1917` / `#D9D2BE` / sienna `#C24A1F` / forest/mustard/brick. Fraunces display, Geist UI, JetBrains Mono every number. 4px/2px radius, hairlines only.

## Shell (already exists)
240px sidebar, 56px header, 1440px max, 48px gutters.

---

## Page A — Runs list at `/app/payroll/runs`

**Beat 1 — Page header.** Eyebrow `OPERATIONS · RUNS`. Title: `Payroll runs`. Subtitle: "Every regular and off-cycle run, reverse-chronological. Click a row for the employee-by-employee breakdown."

**Beat 2 — Filter chips row (Stripe style).** `ALL RUNS` (active, filled background) · `REGULAR` · `OFF-CYCLE` · `THIS MONTH` · `COUNTRY ▾` (dropdown) · `STATUS ▾` (dropdown). Mono uppercase 10px, 0.12em tracking, subtle fills.

**Beat 3 — Runs table (Railway/Stripe hybrid).** Columns: `DATE` (mono small, tertiary) · `COUNTRY` (flag + name + ISO) · `TYPE` (`regular` / `off_cycle` in mono uppercase) · `EMPLOYEES` (mono right-aligned) · `GROSS` (mono right, compact currency with suffix) · `STATUS` (StatusTag `Live` if `approved`, `prototype` otherwise + mono sub-status label) · right arrow link. Row height ~56px, hairline dividers between rows. 60 runs rendered, 12 visible before scroll.

Sample rows (write to real Supabase data so seeded runs show):
- `18 APR 2026 · 🇿🇦 South Africa · regular · 142 · R 2.84M · approved · →`
- `18 APR 2026 · 🇬🇧 United Kingdom · regular · 218 · £612k · approved · →`
- `15 APR 2026 · 🇺🇸 United States · off_cycle · 4 · $12,400 · prototype · →`
- ... etc.

---

## Page B — Run detail at `/app/payroll/runs/[id]`

**Beat 1 — Run header.** Eyebrow `OPERATIONS · RUNS · {run_id short}`. Title Fraunces 28px: `{Country} · {Month Year}`. Sub-line: country flag + employees count + cycle month + run type pill. A small back link top-left: `← Back to runs` in mono 11px.

**Beat 2 — Summary stats row (five columns, hairline dividers).** `EMPLOYEES` · `GROSS` · `TAX WITHHELD` · `SOCIAL CONTRIB` · `NET PAID` — each in Fraunces 24px with currency suffix in mono 11px.

**Beat 3 — Employee breakdown table (Railway-style).** Columns: `ID` (mono first-6-of-uuid tertiary) · `NAME` (Fraunces 14px) · `ROLE` (Geist 13px tertiary) · `GROSS` (mono right) · `TAX` (mono right, small, tertiary) · `SOCIAL` (mono right, small, tertiary) · `OTHER` (mono right, small, tertiary) · `NET` (mono right, sienna). Clicking a row expands inline to show a Railway-style mini-log beneath:

```
[calc] Gross · R 12,400.00                   0ms
[calc] PAYE withheld (23.5%)                  · -R 2,914.00    2ms
[calc] UIF (1%)                               · -R 124.00      0ms
[calc] SDL (1%, employer)                     · not deducted   —
[calc] Medical aid (voluntary)                · -R 880.00      1ms
[calc] Net → R 8,482.00                       6ms
```

(Mono, hairline dividers between lines, right-aligned durations, `[calc]` tags in sienna.)

**Beat 4 — Run metadata card (right sidebar or below, collapsed on smaller widths).** Title `RUN METADATA`. Rows: `Cycle period` · `Run date` · `Run type` · `Status` · `Created at` · `Cycle gross (country local)` · `FX rate applied` (if non-USD). All values in mono.

## Non-negotiables
- Mono numbers, tabular-nums, right-aligned in columns, always.
- The expandable log uses Railway's exact typographic rhythm — bracketed tags, duration on the right, mono throughout.
- No toast messages, no "click to expand!" hints — the chevron icon is the hint.
- Employee table hairline dividers only, never solid rows.

## Voice
Senior engineer inspecting payroll output at the line-item level. Precision, not decoration.

## Output
Export React + Tailwind for Next.js 16 App Router. Routes: `app/app/payroll/runs/page.tsx` and `app/app/payroll/runs/[id]/page.tsx`. Components split sensibly — `RunsListTable.tsx`, `RunDetailTable.tsx`, `EmployeeLogRow.tsx`.
