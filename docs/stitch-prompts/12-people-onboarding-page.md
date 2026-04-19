# Claude Design prompt #12 — People / Onboarding (Prototype empty-state)

## How to use

**Step 1.** Open the same Atlas project in Claude Design (continue).

**Step 2.** Attach this 1 reference image from `C:\Users\USER-PC\.gemini\antigravity\brain\1fa4ee5a-eb53-46f0-a797-1e9bc935d003\playroll-ops\docs\references\`:

1. `ref-Dribble-Landing Page.png` — the Optikka editorial empty-canvas with corner rules and edge labels

**Step 3.** Copy everything below the horizontal rule. Paste into Claude Design. Run. Share output.

---

I am attaching one reference image. **From Optikka**, steal: the **cream-canvas empty page with corner rules**, the **peripheral edge labels in mono uppercase**, and the **single large serif headline** used to anchor an otherwise empty composition.

## What Atlas is (context)
Atlas is a payroll operations suite across six countries. Onboarding is a Prototype section — the design is complete, the workflow is scripted, the data is realistic but the back-end wiring is stubbed.

## What this page is
`/app/people/onboarding` — the Onboarding prototype. Shows what an automated onboarding queue WOULD look like once wired to BambooHR + a legal-contract generator. The copy is honest about the Prototype status.

## Aesthetic (locked)
Editorial. Palette `#F1EBDB` / `#FAF5E7` / `#1A1917` / `#D9D2BE` / sienna `#C24A1F`. Fraunces display, Geist UI, JetBrains Mono every number. 4px radius, hairlines only.

## Shell (already exists)
240px sidebar, 56px header, 1440px max, 48px gutters.

## Layout — three beats

**Beat 1 — Page header.** Eyebrow `PEOPLE · ONBOARDING`, status `Prototype`. Title: `Onboarding queue`. Subtitle: "New hires moving through jurisdiction-specific onboarding — contract, tax registration, banking, benefits. Wired to BambooHR webhooks in v2." Small italic Fraunces paragraph in muted ink below: "This is a prototype. The visual flow is complete; the underlying orchestration is scheduled for v2."

**Beat 2 — Stage pipeline (similar to Cycle page but simpler, 5 nodes).** Horizontal: `OFFER ACCEPTED` → `CONTRACT` → `TAX + BANK` → `BENEFITS` → `LIVE`. Current-position highlights vary per candidate.

**Beat 3 — Candidates list (hairline-divided rows, 6 sample rows).** Each row: coloured-initials avatar + full name (Fraunces 14px) + country flag + role + offer-accepted date (mono) + current stage (pill) + countdown to target start date (mono sienna). Rows feel identical to the Directory table but compressed.

Seed with realistic data: `Renee Krajcik · 🇿🇦 · Junior accountant · offered 14 APR · stage: Contract · starts in 11d`, etc. (6 rows total, spread across stages).

Below the list, a centred mono micro-note: `ALL 6 ROWS ARE SCRIPTED DATA. BAMBOOHR WEBHOOK WIRING IN V2.`

## Non-negotiables
- The `Prototype` status tag is never hidden.
- No "sign up for early access" or marketing moves.
- No automations-live claims.

## Voice
Honest. "Here is the design; the wiring is next."

## Output
Export React + Tailwind for Next.js 16 App Router. Route: `app/app/people/onboarding/page.tsx`.
