# Claude Design prompt #13 — Compliance / Filings page

## How to use

**Step 1.** Open the same Atlas project in Claude Design (continue).

**Step 2.** Attach these 2 reference images from `C:\Users\USER-PC\.gemini\antigravity\brain\1fa4ee5a-eb53-46f0-a797-1e9bc935d003\playroll-ops\docs\references\`:

1. `ref-stripe-payments.png` — the **status-breakdown tiles** (All / Succeeded / Refunded / Failed with an active tile highlighted) + filter chips row
2. `ref-betterstack-uptime.png` — the **per-country uptime bar** translated to per-country filing success

**Step 3.** Copy everything below the horizontal rule. Paste into Claude Design. Run. Share output.

---

I am attaching two reference images. **From Stripe**, steal: the **status-breakdown tile row** where each tile shows a label + count and the active tile has a filled background — this filters the table below. Also the **filter chips row**. **From BetterStack**, steal: the **per-country thin uptime bars** showing the last N filings as green/amber/red segments.

## What Atlas is (context)
Atlas is a payroll operations suite. Compliance / Filings is a Prototype page — most of Atlas's statutory filing logic would be wired here (EMP201, P60, Form 941, STP, WPS, GOSI). For now: designed shell, realistic seeded data, stubbed "Submit to tax authority" actions.

## What this page is
`/app/compliance/filings` — the filings tracker. Shows every statutory form across every country, grouped by status, with their deadlines and submission history.

## Functional requirements
- Reads from Supabase `filings` + joined `countries` + `tax_forms`.
- Status-breakdown tiles filter the table below (active tile = sienna fill).
- Clicking a filing row opens a right-side sheet with: form name, country, period, due date, submission status, last submitted date, next scheduled action, and a stubbed `Submit via {tax authority portal}` button.

## Aesthetic (locked)
Editorial. Palette `#F1EBDB` / `#FAF5E7` / `#1A1917` / `#D9D2BE` / sienna `#C24A1F` / forest/mustard/brick. Fraunces display, Geist UI, JetBrains Mono every number. 4px/2px radius, hairlines only.

## Shell (already exists)
240px sidebar, 56px header, 1440px max, 48px gutters.

## Layout — five beats

**Beat 1 — Page header.** Eyebrow `COMPLIANCE · FILINGS`, status `Prototype`. Title: `Statutory filings`. Subtitle: "Every mandatory filing across six countries — deadlines, submissions, and the automation layer that submits for you."

**Beat 2 — Status-breakdown tile row (Stripe move).** Six clickable tiles in a row, hairline-dividered. Each tile: top eyebrow label, big count below in Fraunces 28px. The active tile has `var(--accent)/10` fill + 2px sienna bottom-border.

- `ALL` · 28
- `NOT STARTED` · 3
- `PREPARED` · 8
- `SUBMITTED` · 12
- `ACCEPTED` · 4
- `REJECTED` · 1 (coloured crit)

**Beat 3 — Filter chips row.** Mono-uppercase 10px chips: `THIS MONTH` · `NEXT 30 DAYS` · `OVERDUE` (sienna) · `BY COUNTRY ▾` · `BY FORM TYPE ▾` · `BY AUTHORITY ▾`.

**Beat 4 — Filings table.** Stripe-dense table. Columns: `COUNTRY` (flag + name) · `FORM` (mono code e.g. `EMP201`, `P60`, `Form 941`) · `NAME` (Geist 13px, e.g. "SARS monthly PAYE") · `PERIOD` (mono, e.g. `APR 2026`) · `DUE` (mono date; coloured sienna if ≤3 days, mustard if ≤14 days, tertiary otherwise) · `STATUS` pill (status colour) · `LAST SUBMITTED` (mono date or `—`). 8–10 rows showing a mix of statuses.

Sample rows:
- `🇿🇦 · EMP201 · SARS monthly PAYE · APR 2026 · 07 MAY (due in 18d) · prepared · 07 APR 2026`
- `🇬🇧 · RTI FPS · HMRC Real Time Info · 19 APR 2026 · due in 0d (crit) · submitted · today`
- `🇺🇸 · Form 941 · IRS quarterly · Q1 2026 · 15 APR · accepted · 12 APR`
- `🇩🇪 · LStA · Lohnsteuer-Anmeldung · APR 2026 · 10 MAY · not_started · —`
- `🇦🇺 · STP · Single Touch Payroll · cycle-19 · 18 APR · rejected (crit) · 18 APR`
- `🇦🇪 · WPS · Wage Protection System · APR 2026 · 28 APR (due in 9d) · prepared · —`

**Beat 5 — Per-country success-rate strip (BetterStack move).** Below the table, a compact section titled `FILING SUCCESS RATE · LAST 12 MONTHS`. One row per country:
- Country flag + name (left)
- A strip of 12 thin vertical bars (BetterStack style) showing last 12 months' filing outcomes — ok=forest, warn=mustard, crit=brick
- Right-aligned mono sienna `99.2% uptime` equivalent (e.g. `11 of 12 on-time`)

## Non-negotiables
- Prototype status tag visible in the header.
- Stripe-style tile row must read as a filter (hover state + active state crystal-clear).
- No "automate this now!" CTAs — this is a prototype.

## Voice
Compliance lead reading through next week's deadlines.

## Output
Export React + Tailwind for Next.js 16 App Router. Route: `app/app/compliance/filings/page.tsx`. Components: `FilingsBreakdownTiles.tsx`, `FilingsTable.tsx`, `FilingSuccessStrip.tsx`.
