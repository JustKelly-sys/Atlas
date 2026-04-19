# Stitch prompt #1 — Atlas Dashboard home

## How to use

1. Open Stitch → new design
2. Attach all 5 images from `docs/references/`: `ref-Dribble-Landing Page.png` (Optikka), `ref-betterstack-uptime.png`, `ref-stripe-payments.png`, `ref-plausible-analytics.png.png`, `ref-axiom-logs.png`
3. Copy **everything below the line** into Stitch's prompt box
4. Run

---

I am attaching five reference images. Study each before drafting the design.

**Optikka landing** (cream-toned with corner rule marks and serif display): I want the **warm cream ground**, the **ultra-thin corner rule framing** of the top section, the **restraint in negative space**, and the **serif display with tiny all-caps monospace eyebrows**. This page should feel like a cousin of that one, not a cousin of a Stripe marketing page.

**BetterStack uptime** (dark, confident, one colour moment): I want its **declarative status voice** and **one-object-per-view confidence**. The big check + "All services are online" is how I want the "cycle on track" moment to feel — a single, emphatic, central statement.

**Stripe payments table**: I want its **row density**, **hairline dividers**, **pill status tags**, and especially its **tabular monospace numerics right-aligned in columns**. Numbers are never decorative on this page; they're data.

**Plausible Analytics**: I want its **every-KPI-has-a-delta discipline**. A bare number without a comparison is forbidden. Also its **understated single-series line** — if any chart appears, it's one line, not a multi-colour wedding cake.

**Axiom logs**: I want its **calm seriousness with density**. When data is dense, the response isn't to add whitespace until it breathes — it's to typeset it well and trust the reader.

Do not copy any of the five literally. Synthesise.

---

**What Atlas is.** Atlas is a payroll operations suite for mid-market companies running monthly payroll cycles across 6 countries simultaneously (South Africa, United Kingdom, United States, Germany, Australia, United Arab Emirates). It sits on top of an Employer of Record stack. The primary user is a Senior Global Payroll Operations Associate who runs cycle after cycle and is responsible for accuracy, on-time payment, statutory filing success, and catching anomalies before they become incidents. Atlas is differentiated by five AI-assisted automations that close specific pain points EORs leave uncovered: input parsing from messy HR messages, FX spread detection, variance narration, jurisdiction-aware termination checklists, and a calendar sentinel that catches holiday/weekend collisions on payroll cutoffs.

**What this page is.** This is `/app` — the authenticated home. She lands here at 7am on cycle-cutoff morning. In five seconds she needs to answer: **are we on track this cycle, or is something broken.** If broken, she should know which country, which automation, and what to do next, without scrolling beyond the fold. Everything else is a second-order question.

**Functional requirements** (what the page actually does, not just looks like):

- The sidebar is persistent navigation. Clicking `Dashboard` stays here; clicking any other item navigates to that page. Nav items marked `Live` route to a functioning page; those marked `Prototype` or `Roadmap` route to a designed empty-state.
- The page header text is dynamic: the eyebrow reflects the current month/year, the greeting uses the signed-in user's first name, and the subtitle reflects live counts ("6 countries open for input" reads from `payroll_cycles` where status = `inputs_open`; "Nearest cutoff in 2d 14h 32m" is a live countdown from `min(cutoff_at)`).
- The cycle status card sums total gross across all open cycles (`payroll_cycles.total_gross_amount`), compares to the prior month's same point in cycle, and renders per-country share bars from the same table. Clicking any country row navigates to that country's cycle detail.
- The alerts card reads from `alerts` where `resolved_at is null`, ordered by severity then recency, shows the top 2. Each alert links to the underlying object (FX row, calendar conflict, etc.).
- Each of the Five cards has a live metric read from Supabase: Input Parser = count of `input_messages` where status=`pending`; FX Watchdog = sum of `fx_leakage.cycle_leakage_amount` for current cycle; Variance Narrator = count of `variances` where `flagged_for_review=true`; Termination Bot = count of `terminations` where status=`in_progress`; Calendar Sentinel = count of `calendar_conflicts` where `resolved_at is null`. Each card's chevron links to the dedicated page.
- The KPI strip shows computed rollups for the current organisation across the current cycle; delta is vs prior cycle. These are read-only.
- The country grid shows every country in the organisation's footprint with its current cycle snapshot. Clicking a card navigates to that country's cycle view.
- Recent activity streams from `audit_log` ordered by `occurred_at desc`, limit 8. Upcoming filings streams from `filings` where status in (`not_started`, `prepared`) ordered by `due_date`, limit 6, countdown coloured by urgency.
- Theme toggle (top-right of header) flips between light cream mode and dark ops mode. Both modes must be designed — light is primary, dark is for the operator working late.
- The page must be server-rendered with the data pre-fetched, then hydrate — no visible skeleton flashes for data that's on the critical path.

---

**Aesthetic.** Editorial dashboard. Warm cream ground `#F1EBDB`, surface `#FAF5E7`, primary ink `#1A1917`, secondary `#4A4740`, tertiary `#8C887D`, hairline rule `#D9D2BE`. **One accent:** burnt sienna `#C24A1F`, used on at most three elements above the fold. Status colours only: forest `#3D6B3D` (ok), aged mustard `#B8791F` (warn), brick `#A33624` (crit). **No purple. No electric blue. No gradient. No glassmorphism. No drop shadow. No rounded-xl.** Card radius 4px, button radius 2px. Every divider is a 1px hairline in `#D9D2BE`.

**Typography.** Fraunces (display serif) for the page title, section heroes, and large numbers / country names when they read as display. Geist Sans for everything else. JetBrains Mono for every number, every timestamp, and every uppercase eyebrow label — always with tabular numerals enabled. Fraunces and JetBrains Mono can share a row; that pairing is the signature.

**Shell.** 240px left sidebar. "ATLAS" wordmark in Fraunces 20px at the top — no logo mark. Nav items: Dashboard (active), Payroll (expandable: Cycle · Inputs Live · Runs · Variance Live · FX Watchdog Live), People (Directory · Onboarding · Terminations Live), Compliance (Filings · Calendar Live · Audit), Automations Live, Integrations Prototype, Reports Prototype, Settings Roadmap. Bottom: avatar + "Tshepiso Jafta" + "demo org" in mono. Header bar 56px with breadcrumb left (`Operations › Dashboard` in mono 11px eyebrow), theme toggle + notifications + avatar right.

---

**The page tells a story in six beats, top to bottom.** Each beat has enough air that the reader knows it ended before the next begins.

**Beat 1 — Greeting.** Eyebrow `OPERATIONS · APRIL 2026` (mono 11px uppercase, 0.12em tracking, ink-tertiary). Title `Good morning, Tshepiso.` in Fraunces, large. Subtitle one line: `6 countries open for input. Nearest cutoff in 2d 14h 32m.` Four ultra-thin corner rule marks frame this block — crosshairs at the corners (the Optikka move). This is the only moment on the page that sounds human.

**Beat 2 — Are we on track?** 70/30 split. Left card: eyebrow `CURRENT CYCLE`, primary value `$2,847,392` in Fraunces with `USD` in mono superscript, green delta pill `↑ 3.2% vs March` beside it, then six thin horizontal share-bars — flag + country + proportion bar (track 8% opacity, fill 20% sienna) + mono %. Bottom-right corner of card: `CUTOFF IN 2d 14h 32m` in quiet sienna mono with a tiny clock icon. Right card: eyebrow `NEEDS ATTENTION · 2`. Row 1 crit: `FX spread 84 bps on EUR/USD` — `3 cycles affected · $1,120 leakage detected` — `2m ago`. Row 2 warn: `ANZAC Day on AU cutoff` — `Shift to Wed 22 Apr recommended` — `1h ago`.

**Beat 3 — The Five.** Horizontal strip of five equal cards. Each card: top-left code eyebrow (NP-01), top-right `Live` tag with tiny filled dot, product name in Fraunces 22px, one large metric in Fraunces 36px, small mono unit beneath, chevron bottom-right. The five: NP-01 Input Parser / `12` pending parses; NP-02 FX Watchdog / `$1,404` leakage this cycle; NP-06 Variance Narrator / `3` flagged for review; NP-20 Termination Bot / `1` active — urgent; NP-19 Calendar Sentinel / `2` conflicts Q2.

**Beat 4 — Five KPIs with deltas.** Horizontal strip, hairline dividers between. Each column: uppercase mono label, confident value, delta line beneath. `ACCURACY 99.2% · ↑ 0.4pt`; `ON-TIME PAYMENT 100% · = target`; `CYCLE TIME 2.8d · ↓ 0.7d`; `QUERY RESPONSE 18h · ↓ 4h`; `FILING SUCCESS 100% · = target`. All deltas "vs last cycle".

**Beat 5 — The six countries.** 3×2 grid. Each card: flag + country name (Fraunces 20px) + ISO mono code + `LIVE` tag top-right. Three small data rows beneath, hairline dividers: `EMPLOYEES` / count; `GROSS` / compact currency; `NEXT CUTOFF` / human countdown. The six in order: 🇿🇦 South Africa (ZA, ZAR), 🇬🇧 United Kingdom (GB, GBP), 🇺🇸 United States (US, USD), 🇩🇪 Germany (DE, EUR), 🇦🇺 Australia (AU, AUD), 🇦🇪 United Arab Emirates (AE, AED).

**Beat 6 — Activity and upcoming filings.** 50/50 split. Left: `RECENT ACTIVITY` with `last 8` mono right-aligned in eyebrow row. Eight log rows, hairline dividers, each: 12px icon + 14px action text + mono 10px timestamp right. Examples: `⏱ Cycle opened for Germany · 4m ago`; `✎ Variance narrated for UK · 12m ago`; `💬 Input parsed from Sarah M. · 23m ago`; `✓ Filing submitted EMP201 (ZA) · 1h ago`. Bottom link `Full audit trail →` with hairline underline. Right: `UPCOMING FILINGS`. Six rows: country flag + form code mono + short description + countdown coloured by urgency. Examples: `🇿🇦 EMP201 · SARS monthly PAYE · due in 3d` (sienna); `🇬🇧 RTI FPS · HMRC real-time info · due in 5d` (mustard); `🇺🇸 Form 941 · IRS quarterly · due in 12d` (mustard).

---

**Voice of the whole page.** Restrained, never cute. Fraunces does the emotional work; JetBrains Mono does the factual work; Geist stays out of the way. One accent colour per region. Uppercase mono eyebrows stitch the page together like section marks in a well-set book. If a choice between plainer and louder presents itself, take plainer.

Output React + Tailwind for a Next.js 16 App Router project. Light mode is primary; also render a dark mode variant using the operator-dark palette (`#0E0E0C` page, `#1A1A17` surface, `#F1EBDB` primary ink, `#E87142` accent).
