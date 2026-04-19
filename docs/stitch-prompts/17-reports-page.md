# Claude Design prompt #17 — Reports page (Prototype)

## How to use

**Step 1.** Open the same Atlas project in Claude Design (continue).

**Step 2.** Attach this 1 reference image from `C:\Users\USER-PC\.gemini\antigravity\brain\1fa4ee5a-eb53-46f0-a797-1e9bc935d003\playroll-ops\docs\references\`:

1. `ref-plausible-analytics.png.png` — the single-line chart discipline + KPI strip with deltas

**Step 3.** Copy everything below the horizontal rule. Paste into Claude Design. Run. Share output.

---

I am attaching one reference image. **From Plausible**, steal: the **single-line charts** with subtle area fills, clean y-axis ticks, and the **KPI strip with deltas** where every metric carries comparison context.

## What Atlas is (context)
Atlas is a payroll operations suite. Reports is a Prototype page — four chart tiles with Atlassian-discipline visuals (single-line / neutral palette / status colours only). Data is realistic but the export/share wiring is stubbed.

## What this page is
`/app/reports` — a single-screen set of four chart tiles answering the four most common payroll-ops questions.

## Aesthetic (locked)
Editorial. Palette `#F1EBDB` / `#FAF5E7` / `#1A1917` / `#D9D2BE` / sienna / status. Fraunces display, Geist UI, JetBrains Mono every number. 4px radius, hairlines only. **Chart discipline: single-line only, 1.5px stroke, area fill 8–12% opacity, no gridlines, no legends, no rainbow palettes.**

## Shell (already exists)
240px sidebar, 56px header, 1440px max, 48px gutters.

## Layout — three beats

**Beat 1 — Page header.** Eyebrow `OPERATIONS · REPORTS`, status `Prototype`. Title: `Operational reports`. Subtitle: "Four questions. Four charts. Exported to PDF or scheduled to email — wired in v2."

**Beat 2 — KPI strip (Plausible move).** Five columns, hairline dividers. Each: eyebrow label / Fraunces 28px value / mono delta line.
- `TOTAL GROSS YTD` · `$32.4M` · `↑ 8.2% vs prior year`
- `HEADCOUNT` · `696` · `↑ 14 vs Q1`
- `CYCLE COUNT YTD` · `18` · `on track for 72`
- `ACCURACY` · `99.2%` · `↑ 0.4pt vs Q1`
- `COMPLIANCE RATE` · `100%` · `= target`

**Beat 3 — 2×2 chart grid (four tiles, each ~340px tall).** Each tile is a card with an eyebrow title, a right-aligned mono meta-line ("last 12 cycles" / "unit: USD"), and a single-line chart.

- **Tile 1 — Gross payroll over time.** Single sienna line, 12 monthly points, area fill 10%. Y-axis `$2M` / `$2.4M` / `$2.8M` / `$3.2M`. Labels JAN / FEB / ... / DEC.
- **Tile 2 — Payroll accuracy %.** Single forest line, 12 points, values 98.4 / 98.7 / 98.9 / 99.0 / 99.1 / 99.2 / 99.2 / 99.3 / 99.4 / 99.2 / 99.2 / 99.2. No area fill.
- **Tile 3 — Variance events per cycle.** Small bar chart (not a line, because it's discrete counts), 12 bars coloured in the appropriate cause-category palette (headcount=info, rate=sienna, fx=mustard, statutory=forest, bonus=sienna, unexplained=crit) — each bar stacks the category counts for that cycle.
- **Tile 4 — Average query-response time.** Single sienna line, 12 points in hours, values 28 / 26 / 24 / 22 / 20 / 19 / 18 / 18 / 17 / 18 / 18 / 18. Dashed reference line at 24h labelled `SLA target` in mono tertiary.

Each tile has a tiny bottom-right mono link `→ Schedule email` (stubbed, opens a modal saying "wired in v2").

## Non-negotiables
- Single-line chart discipline is absolute. No multi-series rainbow.
- Status colours (ok / warn / crit) are the only categorical palette used in charts.
- Every number uses tabular numerals.
- Prototype status tag visible in header.

## Voice
Executive summary voice, quiet confidence.

## Output
Export React + Tailwind for Next.js 16 App Router. Route: `app/app/reports/page.tsx`. Uses Recharts. Component: `ReportTile.tsx`.
