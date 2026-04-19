# Claude Design prompt #04 — Input Parser page (NP-01)

## How to use

**Step 1.** Open the same Atlas project in Claude Design (continue, do not start new).

**Step 2.** Attach these 2 reference images from `C:\Users\USER-PC\.gemini\antigravity\brain\1fa4ee5a-eb53-46f0-a797-1e9bc935d003\playroll-ops\docs\references\`:

1. `ref-Dribble-Dashboard.png` — the overlay-row-detail pattern + coloured avatar pills
2. `ref-stripe-payments.png` — the dense row-table + status pills + mono amounts

**Step 3.** Copy everything below the horizontal rule and paste into Claude Design's chat panel.

**Step 4.** Run. Paste the output back in the thread.

---

I am attaching two reference images. **From Dribbble Orders**, steal: the **right-side overlay detail panel** that appears when a row is hovered/clicked (half-modal, half-drawer), the **tiny coloured-avatar initials pills** on each row, and the **"Insight" summary tile** with big number + stacked mini-stat rows. **From Stripe**, steal: the **row density**, the **hairline dividers between rows**, the **mono-right-aligned amounts**, and the **status pills with dot indicators**.

## What Atlas is (context, locked)
Atlas is a payroll operations suite for mid-market companies running monthly payroll across six countries (South Africa, United Kingdom, United States, Germany, Australia, United Arab Emirates). The primary user is a Senior Global Payroll Operations Associate. Atlas ships five AI-assisted automations covering specific frictions EORs leave uncovered.

## What this page is
This is `/app/payroll/inputs` — the Input Parser (NP-01). Payroll ops inbox for unstructured HR messages (emails, Slack DMs, WhatsApp notes). Each message is one potential payroll change. The ops associate clicks a message, hits "Parse with Gemini", reviews the extracted structured fields, and either approves (writing an `employee_event` row) or flags.

## Functional requirements
- The page reads from Supabase tables `input_messages` and `input_parse_results`.
- Left pane: scrollable inbox list of messages ordered by `received_at` descending, with source icon (email / slack / whatsapp), sender, one-line preview, timestamp, and status badge (`pending` / `awaiting_approval` / `approved`).
- Right pane: the selected message's full text, a "Parse with Gemini" button (if not yet parsed), extracted fields (employee, country, change type, amount, currency, effective date), confidence score, ambiguity flags, and Approve / Flag / Dismiss actions.
- "Parse with Gemini" hits `/api/inputs/trigger` → n8n webhook → Gemini 2.5 Flash (schema-enforced JSON) → writes to `input_parse_results` → returns to UI in under 2 seconds.
- "Approve" hits `/api/inputs/approve` → creates `employee_event` row → marks `input_messages.status = 'parsed'` → logs to `audit_log`.

## Aesthetic (locked)
Editorial dashboard. Palette: page `#F1EBDB`, surface `#FAF5E7`, primary ink `#1A1917`, secondary `#4A4740`, tertiary `#8C887D`, hairline `#D9D2BE`. Single accent: burnt sienna `#C24A1F`. Status: forest `#3D6B3D` (ok), aged mustard `#B8791F` (warn), brick `#A33624` (crit). Fraunces for display + large numbers, Geist Sans for UI body, JetBrains Mono with tabular numerals for every number / timestamp / eyebrow. Card radius 4px, button radius 2px, every divider a 1px hairline. No shadows, no gradients, no rounded-xl. Lucide icons only, 1.5px stroke, 16px default.

## Shell (already exists, do not redesign)
240px left sidebar, 56px top header, max content 1440px with 48px gutters. This page renders inside that shell.

## Layout — the story in four beats

**Beat 1 — Page header.** Eyebrow `OPERATIONS · INPUTS`, status tag `Live`. Title Fraunces 36px: `Payroll input parser`. Subtitle Geist 15px, max-width 640px: "Turns messy HR messages into structured change records with one Gemini call. Approve or flag — never retype."

**Beat 2 — Metric strip (four columns, hairline dividers).** `INBOX` (total count) / `PENDING` (needs parse) / `AVG CONFIDENCE` (percent) / `MODEL` (value: `gemini-2.5-flash` in mono 13px). Values in Fraunces 28px.

**Beat 3 — Two-pane inbox (main work area).** 380px left inbox list + right detail panel. The left list uses Dribbble Orders' row density with coloured avatar initials pills next to sender names (use the Atlassian categorical palette — sienna, muted teal, aged brass, dusty plum, slate). Selected row gets a 2px sienna left-border and a subtle `var(--accent)/5` background. The right panel is Dribbble's overlay pattern: a card with eyebrow `MESSAGE`, the raw text in body serif Fraunces 15px, a Separator, then `PARSED FIELDS` eyebrow with the extracted key-value rows in a 2-column dl, confidence score right-aligned in sienna mono, ambiguity flags in a warn-coloured sub-card if present. Action row bottom: Approve primary, Flag ghost, Dismiss ghost.

**Beat 4 — Sample inbox content (use these 5 real messages).**
1. Slack · `sarah.mokoena@atlas-ops.app` · "Quick one — Thabo Nkosi's getting a R 8,500 performance bonus this cycle, pls add." · 23m ago · pending
2. Email · `hr@company.com` · "Mohammad Crist's banking details changed. New IBAN: DE89 3704 0044 0532 0130 00. Effective immediately." · 1h ago · pending
3. WhatsApp · `+27 82 555 0134` · "Eddie G going on extended unpaid leave from 15 May to 15 June. Please suspend payroll for that period." · 2h ago · awaiting_approval
4. Slack · `finance-bot` · "RTA for Mohammad Crist: base salary increase from R 72,000 to R 86,100 backdated to 1 April." · 4h ago · approved
5. Email · `payroll@supplier.com` · "Termination notice for Elmore Kiehn — last working day 18 May, voluntary. Confirm final pay calc." · 6h ago · approved

## Non-negotiables
- No other colour besides palette above. No purple, no electric blue, no gradient.
- No "welcome to inputs!!" copy. No toasts that say "Success 🎉". Success is quiet: a green dot + mono text.
- Every number is Fraunces or JetBrains Mono — never Geist.
- Approval action writes real data; do not mock the action.

## Voice
Senior engineer writing a memo to a senior operator. Specific numbers, proper nouns, real data. No emoji in copy.

## Output
Export React + Tailwind for Next.js 16 App Router. Route: `app/app/payroll/inputs/page.tsx`. Components: `InputInboxList.tsx`, `InputParsePanel.tsx` — keep the two-pane composition in the page file.
