# Claude Design prompt #16 — Integrations page (Prototype)

## How to use

**Step 1.** Open the same Atlas project in Claude Design (continue).

**Step 2.** Attach this 1 reference image from `C:\Users\USER-PC\.gemini\antigravity\brain\1fa4ee5a-eb53-46f0-a797-1e9bc935d003\playroll-ops\docs\references\`:

1. `ref-Dribble-Landing Page.png` — the Optikka editorial grid for laying out the integration cards

**Step 3.** Copy everything below the horizontal rule. Paste into Claude Design. Run. Share output.

---

I am attaching one reference image. **From Optikka**, steal: the **orthogonal grid** dividing the page into equal cells, and the **restraint** of letting negative space be the design.

## What Atlas is (context)
Atlas is a payroll operations suite. Integrations is a Prototype page — 2 integrations are wired (BambooHR + Slack for notifications), 8 are designed empty-states tagged `Roadmap`.

## What this page is
`/app/integrations` — a 10-card grid showing every integration Atlas will eventually offer. Each card has a logo-placeholder, name, short description, and status tag.

## Aesthetic (locked)
Editorial. Palette `#F1EBDB` / `#FAF5E7` / `#1A1917` / `#D9D2BE` / sienna. Fraunces display, Geist UI, JetBrains Mono. 4px radius, hairlines only.

## Shell (already exists)
240px sidebar, 56px header, 1440px max, 48px gutters.

## Layout — two beats

**Beat 1 — Page header.** Eyebrow `CATALOG · INTEGRATIONS`, status `Prototype`. Title Fraunces 36px: `Integrations`. Subtitle: "Two integrations wired today — BambooHR for HRIS sync, Slack for notifications. Eight more on the roadmap. Connect once, sync forever."

**Beat 2 — 10-card grid (2 rows × 5 columns).** Each card ~240px wide × 180px tall, surface background, hairline border. Per card:
- **Top:** 40×40 logo placeholder (just a monogram in a sienna-tinted tile — first letter of the integration in Fraunces) + integration name in Fraunces 18px
- **Middle:** one-line description in Geist 13px `ink-2`
- **Bottom:** status pill (`Prototype` sienna, `Roadmap` tertiary-outline)

The 10 integrations:
1. **BambooHR** · "HRIS sync — hire, compensation, termination events" · `Prototype`
2. **Slack** · "Payroll notifications in your team channel" · `Prototype`
3. **Workday** · "Enterprise HCM data sync" · `Roadmap`
4. **HiBob** · "Modern HRIS with real-time webhooks" · `Roadmap`
5. **NetSuite** · "Accounting GL posting for payroll entries" · `Roadmap`
6. **Xero** · "SMB accounting + payroll integration" · `Roadmap`
7. **Okta** · "Enterprise SSO for role-based access" · `Roadmap`
8. **Azure AD** · "Microsoft identity for payroll access" · `Roadmap`
9. **Zapier** · "Custom workflow triggers" · `Roadmap`
10. **Google Drive** · "Payroll document archive" · `Roadmap`

Clicking a Prototype card opens a drawer showing realistic integration detail (connection status, last sync timestamp, sync stats). Clicking a Roadmap card opens a drawer with a "Coming in v2" editorial empty-state and a mono link `Request priority →`.

## Non-negotiables
- Prototype / Roadmap tag visible on every card.
- Monograms flat, no 3D shadows, no coloured gradients.
- Grid is strictly uniform — no feature tile, no hero tile.

## Voice
Honest cataloguing. "Here is what exists. Here is what is next."

## Output
Export React + Tailwind for Next.js 16 App Router. Route: `app/app/integrations/page.tsx`. Component: `IntegrationCard.tsx`.
