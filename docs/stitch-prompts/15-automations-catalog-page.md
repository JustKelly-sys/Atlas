# Claude Design prompt #15 — Automations catalog page

## How to use

**Step 1.** Open the same Atlas project in Claude Design (continue).

**Step 2.** Attach this 1 reference image from `C:\Users\USER-PC\.gemini\antigravity\brain\1fa4ee5a-eb53-46f0-a797-1e9bc935d003\playroll-ops\docs\references\`:

1. `ref-Dribble-Dashboard.png` — the **Insight summary tile** with big number + stacked stat rows (used here as the bento template for each automation card)

**Step 3.** Copy everything below the horizontal rule. Paste into Claude Design. Run. Share output.

---

I am attaching one reference image. **From Dribbble Orders**, steal: the **Insight summary tile** pattern — a single card with a big anchor number at top, then 3–4 smaller label/value stat rows stacked beneath, each hairline-divided. This is the **bento template** for every card on this page.

## What Atlas is (context)
Atlas ships five AI-assisted automations. This page is the showcase — the "here is what I built" catalog. For a hiring manager clicking through Atlas, this is the destination that ties the five innovations together.

## What this page is
`/app/automations` — 5 full-bleed cards in a 2+3 grid (2 on top row, 3 on bottom row — or adjust to 3+2 depending on visual weight). Each card is a mini product page for one automation: name, pitch, live metric, status, tech stack, a `→ Open` link to the dedicated page.

## Aesthetic (locked)
Editorial. Palette `#F1EBDB` / `#FAF5E7` / `#1A1917` / `#D9D2BE` / sienna `#C24A1F` / forest/mustard/brick. Fraunces display, Geist UI, JetBrains Mono every number. 4px radius, hairlines only.

## Shell (already exists)
240px sidebar, 56px header, 1440px max, 48px gutters.

## Layout — three beats

**Beat 1 — Page header.** Eyebrow `OPERATIONS · AUTOMATIONS`, status `Live`. Title Fraunces 40px: `The five automations`. Subtitle Geist 16px max-width 640px: "Every one of these is wired end-to-end — real Gemini calls, real Supabase writes, real webhooks. No mocks."

**Beat 2 — The bento grid (5 cards, ~340px tall each).** Responsive 3 columns wide on desktop, cards arranged 3+2 with the 2-row cards slightly wider. Each card contains:

- **Top-left corner:** code eyebrow (`NP-01`, `NP-02`, etc.) in mono 11px uppercase tertiary
- **Top-right corner:** status pill `Live` (sienna dot + mono uppercase)
- **Name** — Fraunces 26px (e.g. `Input Parser`)
- **One-line pitch** — Fraunces italic 15px in `ink-2`, max 2 lines
- **Hero metric block (Dribbble Insight tile):** big anchor number in Fraunces 48px + tiny mono unit label beneath
- **Stat rows (3 rows, hairline dividers):**
  - `TIME SAVED` · value in mono
  - `STACK` · value in mono (`n8n · Gemini 2.5 Flash`)
  - `STATUS` · value in mono (`live · since 2026-04-18`)
- **Bottom-right corner:** sienna mono link `→ Open at {route}`

The five cards:

**1. NP-01 Input Parser**
- Pitch: "Unstructured HR messages, into structured payroll changes, in under a second."
- Hero metric: `12` · `pending parses`
- Time saved: `8h / month`
- Stack: `n8n · Gemini 2.5 Flash · Supabase`
- Link: `→ Open at /app/payroll/inputs`

**2. NP-02 FX Watchdog**
- Pitch: "The 0.5–5% EOR spread your clients never see — surfaced in dollars, per cycle."
- Hero metric: `$1,404` · `leakage this cycle`
- Time saved: `4h / month`
- Stack: `FastAPI · ExchangeRate-API · Render`
- Link: `→ Open at /app/payroll/fx`

**3. NP-06 Variance Narrator**
- Pitch: "Every payroll variance, narrated in plain English. Queryable from Claude Desktop."
- Hero metric: `3` · `flagged for review`
- Time saved: `6h / month · 30min per anomaly`
- Stack: `FastAPI · Gemini 2.5 Flash · MCP server`
- Link: `→ Open at /app/payroll/variance`

**4. NP-20 Termination Checklist**
- Pitch: "HRIS event in. Jurisdiction-specific checklist out. Before ops opens their email."
- Hero metric: `1` · `active · urgent`
- Time saved: `2–4h per termination`
- Stack: `n8n · BambooHR webhook · Gemini 2.5 Flash`
- Link: `→ Open at /app/people/terminations`

**5. NP-19 Calendar Sentinel**
- Pitch: "Holidays, weekends, and timezone conflicts across 12 weeks — surfaced before they break payroll."
- Hero metric: `2` · `conflicts · Q2`
- Time saved: `1–2h per season · unbounded crisis upside`
- Stack: `FastAPI · OpenHolidaysAPI · MCP server`
- Link: `→ Open at /app/compliance/calendar`

**Beat 3 — Closing strip below the grid.** Centred mono micro-text: `FIVE AUTOMATIONS · SIX DEPLOYED SERVICES · ONE SUITE · BUILT IN A WEEKEND`. Beneath it, a single quiet Fraunces italic line: "ADP shipped an enterprise equivalent on 28 January 2026. This is the mid-market version."

## Non-negotiables
- Each card is identical in structure — differences only in content.
- The hero metric is always Fraunces 48px, sized to dominate the card.
- `→ Open at /path` link is the only sienna text per card besides the status dot.
- No emoji anywhere in this page.

## Voice
Portfolio-confident. The page knows it is being looked at.

## Output
Export React + Tailwind for Next.js 16 App Router. Route: `app/app/automations/page.tsx`. Component: `AutomationCard.tsx`.
