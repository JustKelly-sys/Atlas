# Claude Design prompt #05 — FX Watchdog page (NP-02)

## How to use

**Step 1.** Open the same Atlas project in Claude Design (continue).

**Step 2.** Attach these 2 reference images from `C:\Users\USER-PC\.gemini\antigravity\brain\1fa4ee5a-eb53-46f0-a797-1e9bc935d003\playroll-ops\docs\references\`:

1. `ref-plausible-analytics.png.png` — the single clean violet line chart + KPI strip with deltas
2. `ref-stripe-payments.png` — the dense data table with mono-right-aligned amounts

**Step 3.** Copy everything below the horizontal rule and paste into Claude Design.

**Step 4.** Run. Paste output back.

---

I am attaching two reference images. **From Plausible**, steal: the **single large clean line chart** with subtle ~10% area fill, clean y-axis ticks at round numbers, month labels along the bottom in mono, no gridlines, no legend, no chart junk. Also: the **horizontal KPI strip with deltas** where every value has a comparison. **From Stripe**, steal: the **row-dense currency pair table** with mono-right-aligned rates, hairline dividers, and status pills.

## What Atlas is (context, locked)
Atlas is a payroll operations suite for mid-market companies running monthly payroll across six countries (South Africa, United Kingdom, United States, Germany, Australia, United Arab Emirates). Atlas ships five AI-assisted automations covering specific frictions EORs leave uncovered.

## What this page is
This is `/app/payroll/fx` — the FX Watchdog (NP-02). Detects the 0.5–5% FX spread EORs embed invisibly in their payroll conversions. For a 100-employee global team that's $5,000–$25,000 a year in invisible FX leakage. The page surfaces it: per currency pair, per cycle, in dollars.

## Functional requirements
- Reads from Supabase tables `fx_pairs`, `fx_rates` (30-day rolling history), `fx_leakage` (per-cycle computed leakage).
- "Run FX check" button in the page header posts to `/api/fx/run` → Python fx-watchdog service on Render → fetches mid-market from ExchangeRate-API → writes fresh rates + leakage rows → returns summary `{ pairs_updated, cycles_checked, leakage_rows_written, total_leakage_usd }`.
- Charts must respond to real Supabase data, not mocks. The trend chart draws spread-bps-over-time (30 days, daily tick). The pair grid table uses the most recent `fx_rates` row per pair.

## Aesthetic (locked)
Editorial dashboard. Palette: page `#F1EBDB`, surface `#FAF5E7`, ink `#1A1917`, secondary `#4A4740`, tertiary `#8C887D`, rule `#D9D2BE`. Single accent sienna `#C24A1F`. Status forest `#3D6B3D` / mustard `#B8791F` / brick `#A33624`. Fraunces display + big numbers, Geist Sans UI, JetBrains Mono every number/timestamp/eyebrow (tabular nums). Card radius 4px, button 2px, 1px hairlines only. No shadows, gradients, rounded-xl. Lucide icons 1.5px stroke, 16px.

## Shell (already exists, do not redesign)
240px left sidebar, 56px header, 1440px max content with 48px gutters.

## Layout — five beats

**Beat 1 — Page header.** Eyebrow `OPERATIONS · FX WATCHDOG`, status `Live`. Title Fraunces 36px: `FX spread opacity detector`. Subtitle Geist 15px: "Compares the mid-market rate to the rate your EOR actually applies, per cycle. Most providers embed 0.5–5% spread invisibly. We surface it in dollars." Action button top-right: `↻ Run FX check` (primary, sienna).

**Beat 2 — Leakage summary tiles (three columns, card with hairline).** Each tile: eyebrow label + Fraunces 40px value + delta line.
- `THIS CYCLE` · `$1,404` · `↑ $312 vs last cycle` (crit)
- `YTD LEAKAGE` · `$13,440` · `↑ 14% vs prior 12 mo`
- `PROJECTED ANNUAL` · `$16,848` · `on current trajectory` (mono small italic)

**Beat 3 — The Plausible trend chart (full width, ~300px tall).** Eyebrow `SPREAD IN BASIS POINTS · LAST 30 DAYS`, right-aligned mono `all pairs averaged`. A **single sienna line** with subtle area fill at 10% opacity. Y-axis ticks at clean intervals (20 / 40 / 60 / 80 / 100 bps), x-axis date labels (1 APR, 8 APR, 15 APR, 22 APR, 29 APR). No gridlines. Two horizontal dashed reference lines: one at 50 bps labelled `WARN` in mustard, one at 100 bps labelled `CRIT` in brick. One sienna dot marks the current day with an inline label `APR 19 · 84 bps · EUR/USD peak`.

**Beat 4 — Currency pair grid (below chart).** A table-as-cards hybrid: 5–6 pair cards in a responsive 2×3 grid. Each pair card contains: pair label Fraunces 22px (e.g. `EUR / USD`), mid-market rate mono 14px, applied rate mono 14px, spread bps as the hero value Fraunces 32px coloured by severity (sienna if normal, mustard if ≥60 bps, brick if ≥100 bps), cycle leak + YTD leak as two small stat rows underneath, and a 30-day mini sparkline (recharts AreaChart, 80px tall, sienna line, 10% fill). The card is itself a clickable region — hovering surfaces a tiny `→ View history` link.

**Beat 5 — Leakage log table (below grid).** `RECENT LEAKAGE EVENTS` eyebrow. Stripe-style dense table: `DATE` (mono), `PAIR` (Fraunces), `MID-MARKET` (mono right-aligned), `APPLIED` (mono right-aligned), `SPREAD` (mono right-aligned, coloured by severity), `CYCLE LEAK` (mono right-aligned in `$` format), `ACTION` (pill `alerted` / `resolved` / `pending`). Fill with 6 real-looking rows using the six-country currency set (ZAR, GBP, USD, EUR, AUD, AED).

## Non-negotiables
- One line on the chart. Never a multi-series rainbow.
- Every number uses tabular numerals and right-aligns in columns.
- No drop shadows, no gradients, no glassmorphism.
- The trend chart breathes — minimum 20% of its vertical budget is whitespace.
- The "Run FX check" button is the only sienna CTA on the page.

## Voice
Senior engineer writing for a Finance lead who is skeptical of FX opacity claims. Specific basis-point values, specific dollar figures. No emoji.

## Output
Export React + Tailwind for Next.js 16 App Router. Route: `app/app/payroll/fx/page.tsx`. Component: `FxWatchdogGrid.tsx`. Use Recharts for the line chart and sparklines.
