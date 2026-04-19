# Claude Design prompt #11 — People / Directory page

## How to use

**Step 1.** Open the same Atlas project in Claude Design (continue).

**Step 2.** Attach these 2 reference images from `C:\Users\USER-PC\.gemini\antigravity\brain\1fa4ee5a-eb53-46f0-a797-1e9bc935d003\playroll-ops\docs\references\`:

1. `ref-stripe-payments.png` — the dense transaction table, status pills, mono right-aligned amounts
2. `ref-Dribble-Dashboard.png` — the right-side overlay detail panel + coloured avatar initials

**Step 3.** Copy everything below the horizontal rule. Paste into Claude Design. Run. Share output.

---

I am attaching two reference images. **From Stripe**, steal: the **dense table with status pills**, the **filter chips row above the table**, and the **mono-right-aligned monthly gross column**. **From Dribbble Orders**, steal: the **right-side detail drawer** that slides in when a row is clicked, and the **coloured avatar initials circles** for each employee.

## What Atlas is (context)
Atlas is a payroll operations suite for mid-market companies across six countries. The Directory page is the source of truth for every worker — payroll, compliance, and termination workflows all key off it.

## What this page is
This is `/app/people/directory` — the global headcount view. 48 employees across 6 countries (ZA / GB / US / DE / AU / AE). Filterable, searchable, with a detail drawer for any row.

## Functional requirements
- Reads from Supabase `employees` + joined `countries` relation.
- Client-side filters: country multi-select (chips), employment type (`all / employee / contractor`), status (`all / active / on_leave / terminated`), free-text search (name / role / email).
- Clicking a row opens a right-side sheet (shadcn `Sheet`) with full employee detail.

## Aesthetic (locked)
Editorial. Palette `#F1EBDB` / `#FAF5E7` / `#1A1917` / `#D9D2BE` / sienna `#C24A1F` / forest/mustard/brick. Fraunces display, Geist UI, JetBrains Mono every number. 4px/2px radius, hairlines only.

## Shell (already exists)
240px sidebar, 56px header, 1440px max, 48px gutters.

## Layout — four beats

**Beat 1 — Page header.** Eyebrow `PEOPLE · DIRECTORY`. Title: `Global headcount`. Subtitle: "48 workers across 6 countries · source of truth for payroll, compliance, and termination workflows."

**Beat 2 — Filters card.** Top row: Lucide `Search` icon + search input (max-width 480px) + right-aligned filter summary mono `N of 48 shown`. Second row: three filter chip groups with eyebrow labels `COUNTRY`, `TYPE`, `STATUS`. Each group has mono-uppercase chips (7 for country incl. flag+ISO, 3 for type, 4 for status). Active chip: sienna border + `var(--accent)/10` fill + sienna text. Inactive: rule border + tertiary text, hover-darkens border.

**Beat 3 — The employee table.** Columns:
- `NAME` — Fraunces 14px full name on top, mono 10px email below in tertiary + a 24×24 coloured-initials circle to the left (Atlassian categorical palette: sienna / muted teal / aged brass / dusty plum / slate — hash employee id to pick)
- `COUNTRY` — flag + country name (Geist 13px)
- `ROLE` — Geist 13px role_title
- `TYPE` — mono 10px uppercase, info-blue if `contractor`, tertiary if `employee`
- `START DATE` — mono 12px tabular, tertiary, right-aligned
- `MONTHLY GROSS` — mono 14px tabular right-aligned in employee's local currency
- `STATUS` — outlined pill in status colour: `active` (ok), `on_leave` (warn), `terminated` (crit) — mono 10px uppercase

Row height ~64px. Hairline between rows. Row hover: `var(--accent)/5` subtle fill. Row click: opens detail drawer.

**Beat 4 — Detail drawer (right-side sheet, 440px wide).** Title header: country flag + country name (eyebrow) then Fraunces 24px employee name, mono sub-line `role · email`. Body sections with eyebrow headers + 2-column dl pairs (label-left mono / value-right mono):

- `EMPLOYMENT` — Type / Pay schedule / Start date / End date (if terminated)
- `COMPENSATION` — Monthly gross (local currency) / Currency
- `PAYMENT` — IBAN (masked to `****7098`) / Tax ID (masked to `****2113`)
- `ACTIVE AUTOMATIONS` (mono micro-cards) — `NP-01 Input Parser Live` / `NP-02 FX Watchdog Live` / `NP-06 Variance Narrator Live` / `NP-19 Calendar Sentinel Live`
- Footer CTA: sienna outline button `→ Open cycle view for {country}` linking to the country-filtered cycle.

## Non-negotiables
- Coloured avatar initials circles at ~24px — do not become glossy badges. They are hairline, flat fills only.
- Masked IBAN / Tax ID — never show full values.
- No bulk-select checkboxes on the table (this is not a management page, it's a directory).
- Filter chips use the same mono 10px 0.12em tracking across the whole product.

## Voice
Senior operator cross-referencing headcount ahead of a cycle close.

## Output
Export React + Tailwind for Next.js 16 App Router. Route: `app/app/people/directory/page.tsx`. Component: `EmployeeTable.tsx`.
