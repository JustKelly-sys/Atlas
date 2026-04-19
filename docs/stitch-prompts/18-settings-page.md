# Claude Design prompt #18 — Settings page (Roadmap)

## How to use

**Step 1.** Open the same Atlas project in Claude Design (continue).

**Step 2.** Attach this 1 reference image from `C:\Users\USER-PC\.gemini\antigravity\brain\1fa4ee5a-eb53-46f0-a797-1e9bc935d003\playroll-ops\docs\references\`:

1. `ref-Dribble-Landing Page.png` — the Optikka empty-canvas editorial restraint

**Step 3.** Copy everything below the horizontal rule. Paste into Claude Design. Run. Share output.

---

I am attaching one reference image. **From Optikka**, steal: the **confidence to let a page be quiet**, with corner rules anchoring otherwise empty composition and large serif display doing the emotional work.

## What Atlas is (context)
Atlas is a payroll operations suite. Settings is a Roadmap page — three empty-state sub-sections with "coming in v2" editorial markers. Designed, not functional.

## What this page is
`/app/settings` — a beautifully designed empty-state for settings. Not a real form.

## Aesthetic (locked)
Editorial. Palette `#F1EBDB` / `#FAF5E7` / `#1A1917` / `#D9D2BE` / sienna. Fraunces display, Geist UI, JetBrains Mono. 4px radius, hairlines only.

## Shell (already exists)
240px sidebar, 56px header, 1440px max, 48px gutters.

## Layout — two beats

**Beat 1 — Page header.** Eyebrow `PLATFORM · SETTINGS`, status `Roadmap`. Title Fraunces 36px: `Settings`. Subtitle: "Organisation, team members, billing — wired in v2." A small italic Fraunces line: "This is deliberately a blank canvas. The design is final; the forms are not."

**Beat 2 — Three empty-state sub-sections as tall horizontal cards.** Each card ~240px tall, corner-rule framed (Optikka move), centered content:

- **Card 1 — Organisation.** Large serif `Organisation.` (Fraunces 40px, italic). Below, mono 11px: `NAME · DOMAIN · BILLING ADDRESS · TAX ID · LOGO · BRAND COLOURS`. Bottom-right: mono sienna `COMING IN V2`.
- **Card 2 — Team & roles.** Large serif `Team & roles.` (Fraunces 40px, italic). Below, mono 11px: `INVITE BY EMAIL · ROLE-BASED ACCESS · SSO · AUDIT EVERY ACCESS · COUNTRY-SCOPED PERMISSIONS`. Bottom-right: mono sienna `COMING IN V2`.
- **Card 3 — Billing.** Large serif `Billing.` (Fraunces 40px, italic). Below, mono 11px: `PLAN · SEATS · INVOICES · PAYMENT METHOD · CURRENCY · USAGE`. Bottom-right: mono sienna `COMING IN V2`.

Below the three cards, a small centred mono note: `EACH CARD IS INTENTIONALLY EMPTY. THE FIRST SPRINT OF V2 IS THIS PAGE.`

## Non-negotiables
- Roadmap tag visible in header.
- Each card has corner rules (Optikka) framing its empty composition.
- No placeholder form fields, no greyed-out buttons, no "coming soon" stickers. The emptiness is the design.

## Voice
Deliberate silence, confident.

## Output
Export React + Tailwind for Next.js 16 App Router. Route: `app/app/settings/page.tsx`.
