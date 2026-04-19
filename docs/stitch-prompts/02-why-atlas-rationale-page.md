# Claude Design prompt #2 — "Why Atlas" rationale tab

## How to use

**Step 1.** Open Claude Design at https://claude.ai/design and continue the same **Atlas** project (do not start a new one).

**Step 2.** Attach all 8 reference images from this folder on disk:

```
C:\Users\USER-PC\.gemini\antigravity\brain\1fa4ee5a-eb53-46f0-a797-1e9bc935d003\playroll-ops\docs\references\
```

Attach every one of these 8 files:

1. `ref-Dribble-Landing Page.png`
2. `ref-betterstack-uptime.png`
3. `ref-stripe-payments.png`
4. `ref-plausible-analytics.png.png` (yes, the `.png.png` is intentional — that's the real filename)
5. `ref-axiom-logs.png`
6. `ref-railway-dashboard.png`
7. `ref-Dribble-Dashboard.png`
8. `ref-awwards-aesthetic.png`

**Step 3.** In Claude Design, copy **everything below the horizontal rule** (everything starting from the line "I am attaching eight reference images.") and paste it into the chat panel.

**Step 4.** Send / run.

**Step 5.** When Claude Design returns the updated project, paste the link or screenshot back into the thread.

---

I am attaching eight reference images. Before drafting, study each one. I previously instructed which specific moves to steal from each — those instructions still stand. For this pass, the **Optikka landing** and **Awwwards Luxitalia** references are the ones to lean on hardest: this new page is a long-form reading page, not a data page, and its typography and margin treatment should feel like a magazine spread.

**Scope of this pass.** Add ONE new nav item to the sidebar and ONE new page to the app. Do not change anything else. The six dashboard beats, the five innovation pages, the operational and prototype pages, the drawers, the Tweaks panel, the theme tokens, the Fraunces + Geist + JetBrains Mono pairing, the sienna accent, the corner rules — all of those stay exactly as they are.

---

## The new sidebar tab

Add a single new nav item at the bottom of the existing sidebar, **visually separated by a hairline divider** above it so it reads as its own zone (not part of the operational nav). Place it **after Settings**, below a hairline in `var(--rule-soft)`.

- **Label:** `Why Atlas`
- **Route key:** `why-atlas`
- **Icon:** none — just the label
- **Status tag:** none
- **Visual treatment:** Fraunces italic 13px (lowercase "w", lowercase "a") to signal it is different in character from the operational navigation, with the subtle italic serving as a typographic wink. When active: sienna left-edge dot, just like Dashboard.

A tiny eyebrow label in mono 9px uppercase, 0.12em tracking, `var(--ink-3)`, sits ABOVE the hairline divider to label the zone: `FOR REVIEWERS`. This signals to a visitor that what sits below is written for someone evaluating Atlas as a portfolio piece, not someone operating it.

---

## The new page — `/app/why-atlas`

This page is the single most important page in Atlas for a hiring manager at Playroll. It is the written artefact that answers: *why these five automations, why this design, why this architecture, why this person.* Everything on this page is specific and cites real numbers from payroll operations research. Nothing on this page is generic marketing copy.

The page reads top-to-bottom as one long editorial essay with clearly demarcated sections. It is NOT a dashboard. It is NOT a data grid. The visual language is **magazine spread**: wide left/right gutters, generous vertical rhythm, serif body text interspersed with monospace data callouts, occasional full-bleed pull-quotes.

### Section 0 — Page masthead

Full-width block, ~320px tall, corner rules framing it (Optikka move, the same corner-rule treatment the Dashboard greeting uses).

- Tiny eyebrow, mono 11px uppercase 0.14em tracking: `FOR REVIEWERS · PLAYROLL HIRING · APRIL 2026`
- Kicker line in JetBrains Mono 12px, `var(--ink-3)`: `FIG. 02 — CASE STUDY`
- Title in Fraunces 64px, tight `-0.02em` tracking: `Why Atlas.` (with the period — editorial convention)
- Subtitle in Fraunces italic 22px, `var(--ink-2)`, max-width 640px: "A payroll operations suite built the way Playroll would build one — if Playroll built front ends."
- One sentence body, Geist 16px, `var(--ink-2)`, max-width 720px:
  "Payroll isn't a commodity. The 0.5–5% FX spread nobody itemises. The EMP501 that quietly mismatches interim IRP5 certificates. The person holding forty manual checks in their head. ADP announced an enterprise agent for frictions like these on 28 January 2026 — forty countries, enterprise-only. Atlas is the mid-market and EOR equivalent, built in a weekend by someone who's read the research."

### Section 1 — Thesis card

A single framed card, hairline border, surface background, ~180px tall. Eyebrow: `THE THESIS`.

Three short paragraphs in Fraunces serif body, 17px, `var(--ink)`, line-height 1.6. Each paragraph is one sentence:

1. "Global payroll ops teams lose an estimated thirty to fifty hours a month to frictions that have never been named, priced, or productised — the email that arrives three hours before cutoff saying 'bonus John $500', the holiday that shifted to a Friday in 2026 when it was a Thursday in 2025, the EUR/USD spread that cost the client $1,120 this cycle and will cost them $13,440 this year."
2. "The major platforms — Deel, Rippling, Papaya, Remote — compete on country count and contractor onboarding speed. None of them solve these frictions."
3. "Atlas picks the five highest-leverage frictions, builds each one end-to-end, and ships the proof."

### Section 2 — The five automations

Eyebrow: `THE FIVE · SIGNATURE AUTOMATIONS`.

Below it, **five full-width cards stacked vertically**, one per automation. Each card is ~480px tall. Each card reads as a small magazine article — not a dashboard tile. The card has internal structure, **not a grid**: it uses typographic hierarchy to distinguish sections, with a left column for the framing and a right column for the evidence.

Card layout per automation (approximately 60/40 left/right split):

**LEFT column (the framing):**
- Tiny code eyebrow in mono, e.g. `NP-01`, in `var(--ink-3)`
- Name in Fraunces 34px, e.g. `Input Parser`
- One-line pitch in Fraunces italic 18px, `var(--ink-2)`, max 2 lines
- 3–4 paragraph editorial body in Geist 15px, `var(--ink)`, line-height 1.6 — this reads like a short feature article. Each paragraph is short (1–3 sentences).

**RIGHT column (the evidence):**
- Four labelled stat blocks stacked with hairline dividers between them. Each block: mono 10px uppercase label (ink-tertiary) above, the value in Fraunces 22px or mono 18px below.
- Labels: `TIME SAVED`, `FRICTION CLASS`, `COMPETITOR POSITION`, `STACK`.

At the bottom of each card, a quiet sienna line: `→ Opens at /app/payroll/inputs` (or whichever page), acting as the link back to the live automation.

**Populate each of the five cards with this exact content:**

---

**NP-01 · Input Parser**

Left column:
- Pitch: "Unstructured HR messages, into structured payroll changes, in under a second."
- Body paragraphs:
  1. "The friction runs on every EOR cycle. Three hours before cutoff, Slack fills with instructions — 'John is getting a $500 bonus this month, Sarah's address changed, cancel Mike's gym stipend' — with no gross/net clarity, no HRIS trail, and no standard format. A practitioner on r/Payroll started building a tool for exactly this and never finished it; the thread validated the demand but died there."
  2. "Atlas parses the raw message with Gemini 2.5 Flash, extracts employee, change type, amount, currency, effective date, and confidence-scores each field against a strict JSON schema. Ambiguous fields flag for human review; clean parses open for one-click approval."
  3. "The value is not the parser — OpenAI can parse. The value is the schema, the confidence scoring, the ambiguity flags, and the audit log, which together make the output safe to approve at the speed of typing."

Right column:
- TIME SAVED: `8 hours / month` per ops person
- FRICTION CLASS: `Cited #1 in r/Payroll`
- COMPETITOR POSITION: `No EOR solves this natively`
- STACK: `n8n webhook · Gemini 2.5 Flash · schema-enforced JSON · Supabase`

Link line: `→ Demo at /app/payroll/inputs`

---

**NP-02 · FX Watchdog**

Left column:
- Pitch: "The 0.5–5% EOR spread your clients never see on their invoice — surfaced in dollars, per cycle."
- Body paragraphs:
  1. "Every EOR quietly embeds an FX spread in the rate it applies to payroll. Deel documents 0.5–2% in help text. Remote uses a proprietary 'Remote FX Rate' with no published methodology. Multiplier adds 0.5–1.5% on accepted funding currencies — and a further 1–3% on double conversions. None of this appears on any invoice."
  2. "For a 100-employee global team, this is $5,000 to $25,000 a year the client pays without ever seeing a line item. The only people who catch it are CFOs who happen to spot-check against Bloomberg mid-market."
  3. "Atlas pulls mid-market from ExchangeRate-API, reads the applied rate from the cycle, computes the spread in basis points, converts to dollars, and posts a Slack-ready alert three days before cutoff. This cycle's run surfaced $1,404 on six currency pairs. A Finance lead would call that either a cost centre to fight or a transparency product to sell; Atlas frames it as both."

Right column:
- TIME SAVED: `4 hours / month` per ops person
- FRICTION CLASS: `Never productised at EOR scale`
- COMPETITOR POSITION: `Enterprise platforms hide this; EOR-scale has nothing`
- STACK: `FastAPI · ExchangeRate-API · Supabase · scheduled Render worker`

Link line: `→ Demo at /app/payroll/fx`

---

**NP-06 · Variance Narrator**

Left column:
- Pitch: "Every payroll variance, narrated in plain English, queryable from Claude Desktop."
- Body paragraphs:
  1. "ADP launched an enterprise Payroll Variance AI Agent on 28 January 2026 for forty countries. It saves an estimated thirty minutes per anomaly resolved, against a baseline of ninety. It is enterprise-only."
  2. "Atlas builds the mid-market equivalent. The service accepts a variance row, pulls the cycle's line items and the prior cycle's comparables, constructs a Gemini prompt grounded in the actual numbers, and returns a paragraph of Fraunces-ready prose. Cause is classified into six categories: headcount, rate, FX, statutory, bonus, unexplained."
  3. "It is exposed as an MCP server. A Playroll ops lead can open Claude Desktop and ask 'what caused the Germany variance in March' and get the answer without opening a browser. The same MCP pattern was used in Dedukto, my SA-PAYE project — the architecture is not new to me."

Right column:
- TIME SAVED: `6 hours / month` per ops person; `30 min` per anomaly (parity with ADP)
- FRICTION CLASS: `Category validated by ADP's launch`
- COMPETITOR POSITION: `ADP enterprise-only · mid-market uncontested`
- STACK: `FastAPI · Gemini 2.5 Flash · MCP stdio server · Supabase`

Link line: `→ Demo at /app/payroll/variance`

---

**NP-20 · Termination Checklist**

Left column:
- Pitch: "The moment HR logs a termination, Atlas emits a jurisdiction-specific checklist with statutory deadlines — before ops opens their email."
- Body paragraphs:
  1. "Termination paperwork arrives two hours before cutoff. In those two hours, ops must verify final pay against six different bodies of law: California's 72-hour rule for voluntary resignation, South Africa's BCEA next-payday requirement, Germany's contractual notice periods, the UK's P45 obligations, UAE end-of-service gratuity, Saudi WPS — each with its own deadline and each with daily penalties for getting it wrong."
  2. "HR systems ship with generic offboarding checklists. None are payroll-specific, none are jurisdiction-aware, and none are emitted in real time from an HRIS event."
  3. "Atlas listens on a BambooHR webhook. The moment a termination is logged, Gemini 2.5 Flash generates a jurisdiction-specific checklist from the employee's country, role, and last working day. Final pay deadline is calculated to the day. COBRA, pension deregistration, PTO payout tax treatment, garnishment release — each is pre-filled with the specific employee's details and assigned to the owning team in Slack."

Right column:
- TIME SAVED: `2–4 hours` per termination
- FRICTION CLASS: `Top-voted pain in r/Payroll`
- COMPETITOR POSITION: `No real-time, jurisdiction-aware checklist exists`
- STACK: `n8n webhook · Gemini 2.5 Flash · Supabase · Slack dispatch`

Link line: `→ Demo at /app/people/terminations`

---

**NP-19 · Calendar Sentinel**

Left column:
- Pitch: "The payroll calendar, cross-referenced against every country's public holidays, queryable from Claude."
- Body paragraphs:
  1. "Public holidays shift year to year. Independence Day was a Wednesday in 2025 and a Saturday observed Friday in 2026. Christmas was a Thursday; it's a Friday. One manufacturing client's system failed to recognise Argentina's Día del Trabajador and processed payroll late. Another had their ACH cutoff collide with Juneteenth two days running."
  2. "Enterprise platforms bury the calendar in configuration. EOR-scale clients have nothing."
  3. "Atlas queries OpenHolidaysAPI across every country in the organisation's footprint, flags collisions, computes adjusted ACH cutoffs, and exposes the whole thing as an MCP server. `next_cutoff ZA` returns the real cutoff for South Africa accounting for Freedom Day. The MCP pattern is the same one the Variance Narrator uses — one architecture, two uses."

Right column:
- TIME SAVED: `1–2 hours` per season · unbounded upside when a crisis is avoided
- FRICTION CLASS: `Catches the failure mode clients fear most`
- COMPETITOR POSITION: `Enterprise buries this; EOR-scale has nothing`
- STACK: `FastAPI · OpenHolidaysAPI · MCP stdio server · Supabase`

Link line: `→ Demo at /app/compliance/calendar`

---

### Section 3 — The operational suite

Eyebrow: `THE SUITE · OPERATIONAL PAGES`.

A 4-column horizontal table-like layout (not a data grid — a typographic list). Six rows, hairline dividers, no heavy cells.

Each row: page name in Fraunces 18px (left), then in Geist 14px and `var(--ink-2)`: the industry-standard KPI this page owns, then a short note in `var(--ink-3)` italic.

| Page | KPI it owns | Industry target | Why it exists |
|---|---|---|---|
| Payroll / Cycle | Cycle time | `2–3d` (high performers) vs `5–7d` standard | The 7-stage pipeline as a first-class view, not a progress bar |
| Payroll / Runs | Payroll accuracy | `98–99%` | Every run, reverse-chronological, dense mono amounts |
| People / Directory | Query response | `<24h` | The source of truth for payroll and compliance actions |
| Compliance / Filings | Filing success | `100%` | EMP201, P60, Form 941, STP — by country, by deadline |
| Compliance / Audit | Immutable audit trail | `100%` | Reverse-chron log; every write, every actor, every timestamp |
| Automations | Dashboard of the five | — | The "here is what I built" showcase, one card per automation |

Opening sentence above the table, Fraunces italic 16px, `var(--ink-2)`:

"These pages are not the pitch. They are the proof the product is real — the operational surface a senior payroll ops associate would actually work in. Every KPI on the left is one the industry publishes a target for."

### Section 4 — Design rationale

Eyebrow: `THE CRAFT · EDITORIAL DASHBOARD`.

A two-column layout (golden ratio split, ~60/40). Left column is prose. Right column is a small grid of **five swatches with the reference they come from**.

Left column prose, Fraunces 17px, line-height 1.7:

- "The major payroll dashboards read as generic B2B SaaS. Rippling is modern. Deel is friendly. Papaya is corporate. None of them are *considered*. Atlas is deliberately editorial — warm cream ground, serif display, monospace data, one accent. A senior ops associate has seen every generic dashboard already; what they haven't seen is a dashboard that respects them."
- "The reference sources are explicit. The warm #F1EBDB ground and corner rules come from Awwwards Optikka. The confident one-accent voice and declarative status moments come from BetterStack. The row density and pill status tags come from Stripe. The every-KPI-has-a-delta discipline comes from Plausible. The multi-series patience comes from Axiom. Each reference earned representation on at least one page; none was copied."
- "The typography is tight. Fraunces does the emotional work — page titles, country names, big numbers treated as display. JetBrains Mono does the factual work — every number, every eyebrow, every timestamp, always with tabular numerals. Geist stays out of the way. The three pair more gracefully than any generic sans stack because they were chosen, not defaulted to."

Right column — five small swatch cards in a 2+2+1 arrangement. Each card: a 48×48 colour/texture block, a label in Fraunces 14px, a one-line mono caption.

1. `#F1EBDB` cream paper — `"Warm cream — Optikka, Luxitalia"`
2. `#C24A1F` burnt sienna — `"One accent, everywhere, restrained"`
3. Fraunces specimen — `"Display — editorial, not SaaS"`
4. JetBrains Mono specimen — `"Numbers, never negotiable"`
5. 1px hairline on cream — `"Dividers. Not shadows."`

### Section 5 — Architecture

Eyebrow: `THE STACK · SIX DEPLOYED SERVICES`.

A single dense card. Left side: a small **architecture diagram** rendered in CSS boxes, not an image. Right side: the five-layer AI stack named as a numbered list.

Architecture diagram (CSS boxes with hairline borders, mono labels, connecting lines drawn with `::before`/`::after`):

```
[ Next.js 16 · Vercel ]
        │
        ├── [ Supabase · Postgres + RLS ]
        │
        ├── [ n8n · Render · 2 workflows ]
        │     ├── input-parser
        │     └── termination-checklist
        │
        └── [ 3 Python services · Render ]
              ├── fx-watchdog (FastAPI)
              ├── variance-narrator-mcp (FastAPI + MCP)
              └── calendar-sentinel-mcp (FastAPI + MCP)
```

Right side, numbered list, Fraunces 16px with mono code labels:

1. **Orchestration** · n8n workflows dispatch webhooks, chain HTTP calls, and manage the branching logic.
2. **Intelligence** · Gemini 2.5 Flash, response-schema-enforced, thinking disabled, <1s response.
3. **Persistence** · Supabase Postgres with 23 tables across seven groups and row-level security.
4. **Protocol** · Two services expose MCP stdio interfaces — queryable from Claude Desktop with the right `.claude/config.json` snippet (included in the repo README).
5. **Interface** · Next.js 16 App Router, React 19, TypeScript 5, Tailwind v4, shadcn/ui, deployed to Vercel.

Below the diagram and list, one mono paragraph in `var(--ink-2)`, 13px:

"The MCP pattern was reused from Dedukto — my SARS-PAYE MCP server. The FastAPI + Supabase + Gemini + n8n stack was reused from LexFlow — my voice-to-billing SaaS for South African legal professionals. Atlas is not a first project. It is the third in a sequence, which is why it ships in a weekend."

### Section 6 — Closing

Eyebrow: `THE PITCH`.

A short four-paragraph essay in Fraunces 17px, line-height 1.7, max-width 680px, centred on the page.

1. "ADP identified the opportunity and launched for enterprise on 28 January 2026. They will take 18 months to come down-market. In those 18 months, the mid-market and EOR segment — Playroll's segment — has a window."
2. "Playroll has already chosen to lead on emerging markets, on white-label partnerships, on compliance-first positioning, and on in-house expertise. What Atlas adds is a design language and a product pattern for how those positions look in the UI. It is not a Rippling clone and it is not a Deel clone. It is an editorial, MCP-native, research-grounded suite."
3. "I built it in a weekend, working from two commissioned Valyu deep-research reports, eight reference images I curated myself, and the architectural muscle memory of two prior ships (LexFlow, Dedukto). The research is cited in the README. The MCP config snippet is in the README. The six-deployed-services architecture is visible in the repo."
4. "If you've read this far, thank you. I'd like to talk."

Signature line at the bottom, mono 11px uppercase 0.12em tracking: `TSHEPISO JAFTA · APRIL 2026 · CAPE TOWN`.

---

## Voice, across every section of this page

- Never pitchy. Never "we help companies". The voice is a senior engineer writing a memo to a senior operator.
- Numbers are specific and citable. "8 hours a month" not "many hours". "$1,404 this cycle" not "thousands".
- Proper nouns are used. SARS. EMP201. BCEA. Deel. Remote. Rippling. ADP. Gemini 2.5 Flash. Mercifully specific.
- One idea per paragraph. Short paragraphs.
- Italics for one-line italicised Fraunces pull sentences, used sparingly — once per section at most.
- Zero exclamation marks. Zero "!". Zero "🎉". Zero "✨". Zero "game-changer". Zero "leverage".

## Non-negotiables

- Do not touch the sidebar's existing seven nav items. Add the new `Why Atlas` item at the bottom, below a hairline, with a `FOR REVIEWERS` eyebrow.
- Do not touch the Dashboard, the five innovation pages, the operational pages, or the Tweaks panel.
- Do not introduce any new colour. The accent stays `#C24A1F`. Status stays forest/mustard/brick.
- Do not introduce rounded-xl, drop shadows, or gradients. Card radius 4px, button 2px, hairlines only.
- The page is long-form reading. Generous vertical rhythm. Line-height 1.6–1.7 on body serif. Max-width 680–720px for prose sections. Never stretch body text edge to edge.
- Use Lucide icons (1.5px stroke, 16px) if icons appear anywhere. No emoji in this page.
- Fraunces + JetBrains Mono + Geist only. No other fonts.

## Output

Export as React + Tailwind for Next.js 16 App Router. The new page lives at `app/why-atlas/page.tsx`. The sidebar addition is one more entry in the existing navigation component.
