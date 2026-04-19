# Correction prompt — Atlas Dashboard home, pass 2

## How to use

1. Open the same Atlas project in Claude Design (don't start fresh — continue from where pass 1 landed).
2. Attach these 3 reference images from `docs/references/`: `ref-Dribble-Landing Page.png` (Optikka), `ref-plausible-analytics.png.png`, `ref-betterstack-uptime.png`.
3. Copy **everything below the line** into Claude Design.
4. Run.

---

The dashboard you built is close. Keep the six beats, the cream tokens, the Fraunces + JetBrains Mono + Geist pairing, the sienna accent, and every piece of content already on the page. Do not touch the sidebar, the header, the existing drawers, or the Tweaks panel. Do not change the data or the voice.

I'm attaching three reference images again. Each one names a specific move the current page is missing. Add those three moves in place. That's the scope.

**Move 1 — Optikka whole-page grid + edge labels.** The Optikka reference is an editorial-magazine page divided into cells by ultra-thin hairlines, with tiny all-caps monospace labels running along every edge. Right now, corner rules appear only on the greeting. Extend the grid treatment across the **entire content area** behind the six beats — four vertical hairlines and five-to-six horizontal hairlines in `var(--rule-soft)` (so they read as graph paper, not cage walls). Then add peripheral edge labels in JetBrains Mono 10px uppercase, 0.14em tracking, `var(--ink-3)` — treat these like the margin notes in a well-set book:

- **Left edge, running vertically top-to-bottom** (rotated -90°): `ATLAS · OPERATIONS · APRIL 2026 · v0.7.2`
- **Top edge, above each beat**, small section markers aligned to the beat below: `GREETING`, `CYCLE · ALERTS`, `THE FIVE`, `METRICS`, `FOOTPRINT`, `ACTIVITY · FILINGS`
- **Right edge, running vertically bottom-to-top** (rotated 90°): `DEMO · AUTO · LAST SYNC 12s AGO`
- **Bottom edge, flush right**: `FIG. 01 · HOME`

The labels should feel incidental, not decorative — like they were always there, indexing the page. None of them should compete with the real content. The grid itself sits behind everything in `rule-soft`, maybe 40% opacity if that reads too loud.

**Move 2 — Plausible single-line trend chart.** The page currently has no time series. Add a new beat **between the existing beat 2 (cycle + alerts) and beat 3 (The Five)**. The beat is a single card, full content width, titled with the eyebrow `CYCLE HISTORY · LAST 12 CYCLES` (left) and `TOTAL GROSS, USD` (right). Inside: one smooth line in sienna `var(--accent)` tracing total gross per cycle over the last 12 months, with a subtle area fill beneath at ~10% accent opacity. Clean y-axis ticks at round numbers (`$2.4M / $2.6M / $2.8M / $3.0M`), month labels along the bottom in mono 10px (`MAY / JUN / JUL / ...`), no gridlines, no legend, no tooltip chrome. One dot marks the current cycle with a small crosshair and an inline mono label `APR 2026 · $2,847,392`. This is the Plausible move exactly — one line, no junk, lots of air.

Use this series (illustrative, monotonically edging up with one dip):
`MAY 2,512,300 · JUN 2,598,400 · JUL 2,641,700 · AUG 2,680,200 · SEP 2,702,000 · OCT 2,754,900 · NOV 2,691,100 · DEC 2,703,400 · JAN 2,728,900 · FEB 2,762,300 · MAR 2,758,000 · APR 2,847,392`

**Move 3 — BetterStack closeout-history bar strip.** Add a slim horizontal strip at the **bottom of the page, immediately above the existing activity + filings split**. The strip is a single-card band, ~72px vertical, with the eyebrow `CLOSEOUT HISTORY · LAST 12 CYCLES` top-left and the mono label `11 ON-TIME · 1 DELAYED` top-right. Below: 12 thin vertical bars laid out left-to-right, each bar 8px wide with 12px gap, labelled underneath with its three-letter month. Bar colour: `var(--ok)` forest for on-time closeouts (11 of 12), `var(--warn)` mustard for the one delayed closeout (set it to NOV). Each bar has a tiny tooltip on hover — "NOV 2025 · delayed 2d · reason: AU holiday" for the warn bar, "on-time" for the others. The strip should read as "we ship the paycheque every month" in one glance — that's the BetterStack "All services are online" moment translated to payroll.

---

Three moves. Nothing else changes. The rest of the page — greeting copy, alerts, The Five, KPIs, country grid, activity, filings, the drawers, the Tweaks panel — stays exactly as it is.

Export as React + Tailwind for Next.js 16 App Router.
