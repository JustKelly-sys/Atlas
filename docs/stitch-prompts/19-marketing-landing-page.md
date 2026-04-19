# Claude Design prompt #19 — Marketing landing page `/`

## How to use

**Step 1.** Open the same Atlas project in Claude Design (continue).

**Step 2.** Attach these 2 reference images from `C:\Users\USER-PC\.gemini\antigravity\brain\1fa4ee5a-eb53-46f0-a797-1e9bc935d003\playroll-ops\docs\references\`:

1. `ref-awwards-aesthetic.png` — the Luxitalia full-bleed hero imagery + three-column info footer
2. `ref-Dribble-Landing Page.png` — the Optikka corner-rule framing + oversized serif headline + edge labels

**Step 3.** Copy everything below the horizontal rule. Paste into Claude Design. Run. Share output.

---

I am attaching two reference images. **From Luxitalia**, steal: the **full-bleed hero photograph**, the **centred wordmark with sienna pin-dot**, and the **three-column info footer strip** at the bottom. **From Optikka**, steal: the **orthogonal grid of hairlines** throughout the page, the **peripheral edge labels in mono uppercase**, and the **oversized serif headline** that makes a statement.

## What Atlas is (context)
Atlas is a payroll operations suite I built in a weekend for a Senior Global Payroll Operations Associate application at Playroll. This is the **public marketing landing page** at `/` — what a hiring manager sees before they sign in. It is a single-scroll, no-nav, no-CTA-chasing page. The goal is to convince them to click `→ Enter the suite` (which routes to `/sign-in`).

## What this page is
`/` — an SEO-indexable, single-scroll marketing landing. Two visitors: (1) a hiring manager at Playroll who received a link, (2) a general senior-fullstack recruiter evaluating the portfolio piece. The page must serve both without being generic.

## Aesthetic (locked)
Editorial. Palette `#F1EBDB` (page) / `#FAF5E7` (surface) / `#1A1917` (ink) / `#D9D2BE` (rule) / sienna `#C24A1F`. Fraunces display, Geist UI, JetBrains Mono. 4px radius, hairlines only. No shadows, gradients, rounded-xl. Lucide 1.5px icons.

## Shell on this page
**Custom** — no sidebar, no authenticated header. A thin top bar with `ATLAS` wordmark centred (Fraunces 22px + tiny sienna pin-dot, Luxitalia-style) + mono 10px labels either side: `GLOBAL PAYROLL OPS · A PORTFOLIO BY TSHEPISO JAFTA` (left) + `CAPE TOWN · APRIL 2026` (right). Top-right: a single outline button `→ Enter the suite` (sienna text, sienna border, 2px radius) that routes to `/sign-in`.

## Layout — seven beats

**Beat 1 — Hero (full viewport, Luxitalia full-bleed).** The hero is **full-bleed warm-cream gradient with corner rules** (Optikka move applied at viewport scale), NOT a photograph here (this is a product page, not a hotel). Within the full-bleed:
- Four corner rule marks at the viewport corners in `var(--rule)` — long, deliberate (120px each).
- Centre-top mono eyebrow: `PAYROLL OPERATIONS · RECONSIDERED.`
- Centred Fraunces 96px (responsive to 64px on narrow viewports) tracking `-0.03em`: `Atlas.`
- Below, Fraunces italic 26px max-width 680px centred: "A payroll operations suite for the senior operator who has seen every generic SaaS dashboard already — and is done with them."
- 80px gap, then a single mono micro-sentence: `BUILT IN A WEEKEND. FIVE AUTOMATIONS. SIX DEPLOYED SERVICES. ONE EDITORIAL SUITE.`
- 48px gap, then two small actions centred horizontally: `→ ENTER THE SUITE` (sienna primary outline) + `READ THE WHY` (ghost, links to `/app/why-atlas`).

**Beat 2 — The problem (dense editorial paragraph, Optikka-grid backdrop).** Full-width section with a subtle 4-column hairline grid visible in the background. Eyebrow top-left: `THE PROBLEM · 21 NICHE FRICTIONS`. Large Fraunces 32px headline: `The major payroll platforms compete on country count. None of them solve this.`

Below, a pull-quote-style paragraph in Fraunces 18px, line-height 1.7, max-width 780px, centred on the grid:

> "The 0.5–5% FX spread nobody itemises. The EMP501 that quietly mismatches interim IRP5 certificates. The pension re-enrolment window missed by two weeks and fined £400. The commission spreadsheet sorted alphabetically before import, so everyone got the wrong amount. The person holding forty manual checks in their head. These are the frictions ADP announced an enterprise agent for on 28 January 2026. The mid-market and EOR gap is open. Atlas is how it closes."

Attribution below the quote, mono 10px uppercase `FROM THE VALYU DEEP RESEARCH · APRIL 2026 · 21 PAIN POINTS IDENTIFIED`.

**Beat 3 — The five (bento grid, same as /app/automations but marketing-styled).** Full-width card grid, 5 cards in a 3+2 layout. Each card here uses the same structure as `/app/automations` but with one addition: a thin sienna "why this?" link that expands the pain-point narrative in an inline drawer. Use the exact same 5 card contents from `/app/automations` (Input Parser / FX Watchdog / Variance Narrator / Termination Checklist / Calendar Sentinel).

**Beat 4 — The stack (credibility section, Optikka-grid).** Full-width. Eyebrow `THE STACK · SIX DEPLOYED SERVICES`. A three-column layout:
- **Left column — architecture diagram** (CSS boxes with hairline borders and mono labels, same diagram as in `/app/why-atlas` section 5: Next.js → Supabase / n8n with 2 workflows / 3 Python services with fx-watchdog + variance-narrator-mcp + calendar-sentinel-mcp).
- **Middle column — the five-layer AI stack** as a numbered list in Fraunces 16px: (1) Orchestration · n8n, (2) Intelligence · Gemini 2.5 Flash, (3) Persistence · Supabase Postgres, (4) Protocol · MCP stdio for 2 services, (5) Interface · Next.js 16.
- **Right column — proof** in mono body:
  - `GITHUB · github.com/JustKelly-sys/Atlas` (linked)
  - `LIVE URL · atlas-ops.vercel.app` (linked)
  - `MCP CONFIG · snippet in README` (mono block showing 3 lines of JSON config)
  - `TESTS · 28 python tests passing`
  - `DEDUKTO LINEAGE · this is the third in a sequence`

**Beat 5 — Credibility for the hiring read (Optikka edge-labelled block).** A full-width block with vertical mono labels up the left edge (rotated -90°): `FOR · PLAYROLL · SENIOR · PAYROLL · OPS`. Inside: Fraunces 30px headline centred: `Why Playroll specifically.` Below, three short Fraunces paragraphs, each ~3 sentences:

1. "Playroll leads on emerging markets, compliance, white-label partnerships, and in-house expertise. Atlas is designed to sit on that positioning. The first innovation (Input Parser) reflects the messy HR-comms reality of mid-market clients. The SARS EMP501/EMP201 mismatch pain point is surfaced deliberately — Playroll's Johannesburg and Cape Town ops hub sees that one every reconciliation window."
2. "ADP identified the category opportunity and shipped for enterprise on 28 January 2026. It will take 18 months to come down-market. In those 18 months, Playroll's mid-market segment has a window — and I'd like to help close it."
3. "This page is not a marketing pitch. It is a receipt that shows the work was done before the conversation started. Two commissioned Valyu deep-research reports. Eight reference images curated. A six-service deploy. One editorial suite."

**Beat 6 — Footer info strip (Luxitalia three-column move).** Bottom ~120px of the page. Three equal columns, hairline-dividered:
- Column 1: eyebrow `BUILT BY` · Fraunces 18px `Tshepiso Jafta`, below mono `tshepiso@atlas-ops.app · LinkedIn · GitHub` (all linked)
- Column 2: eyebrow `BUILT FOR` · Fraunces italic 16px `The senior global payroll ops role at Playroll, as a portfolio piece and interview artefact.`
- Column 3: eyebrow `BUILT IN` · Fraunces 18px `A weekend · April 2026` and below mono `docs/superpowers/specs · the two Valyu research reports are in the repo`.

Below the three columns, centred mono 10px line: `MADE IN CAPE TOWN · OPEN SOURCE (MIT) · ATLAS IS NOT A REAL PRODUCT · IT IS A DEMONSTRATION`.

**Beat 7 — A single terminal action.** Fixed at bottom-right of the viewport (only visible after scrolling past the hero): a small outline pill `→ Enter the suite` routing to `/sign-in`. Mono 11px uppercase. Backdrop-blur of the cream ground. Do not let this dominate the page — it is a reminder, not a CTA stack.

## Voice
Editorial. Confident without being salesy. Real numbers, proper nouns, no "leverage". The page IS the pitch — but it speaks in a whisper.

## Non-negotiables
- Single scroll. No sticky mega-nav, no newsletter signup, no chat widget, no "Book a demo" — none of that.
- The only buttons are: `Enter the suite`, `Read the why`, and the subtle re-prompt at the bottom-right.
- Full-bleed hero uses cream gradient + corner rules, not a photograph (the sign-in page gets the photograph — this page is the product's voice, quieter).
- Every number, every date, every proper noun is specific and accurate (ADP Jan 28 2026 / 21 niche frictions / six deployed services / five automations).
- One accent colour (`#C24A1F`). No purple, no electric blue, no gradient beyond the cream tonal wash.

## Output
Export React + Tailwind for Next.js 16 App Router. Route: `app/page.tsx` (the root route group that's publicly accessible, not inside `/app`). Components: `MarketingHero.tsx`, `MarketingFive.tsx`, `MarketingStack.tsx`, `MarketingWhyPlayroll.tsx`, `MarketingFooter.tsx`.
