# Claude Design prompt #07 — Calendar Sentinel page (NP-19)

## How to use

**Step 1.** Open the same Atlas project in Claude Design (continue).

**Step 2.** Attach these 2 reference images from `C:\Users\USER-PC\.gemini\antigravity\brain\1fa4ee5a-eb53-46f0-a797-1e9bc935d003\playroll-ops\docs\references\`:

1. `ref-axiom-logs.png` — the grid-density + query-console aesthetic
2. `ref-Dribble-Landing Page.png` — the Optikka corner-rule framing for the calendar grid

**Step 3.** Copy everything below the horizontal rule. Paste into Claude Design. Run. Share output.

---

I am attaching two reference images. **From Axiom**, steal: the **dense-grid information architecture** and the **query console** at the top (code-editor-style input with a "Run query" button). **From Optikka**, steal: the **corner-rule framing** of the main visual block (the calendar grid) and the **edge labels** in mono uppercase.

## What Atlas is (context)
Atlas is a payroll operations suite for mid-market companies across six countries. Ships five AI automations covering specific EOR frictions.

## What this page is
This is `/app/compliance/calendar` — Calendar Sentinel (NP-19). Cross-references every country's payroll cutoff against public holidays, weekend rules, and approver availability across a 12-week horizon. Exposed as an MCP server so Claude can answer date questions directly ("when is the adjusted ZA cutoff for December 2026?").

## Functional requirements
- Reads from Supabase `countries`, `public_holidays`, `payroll_cycles` (for cutoff dates), `calendar_conflicts`.
- "Rescan horizon" button in header hits `/api/calendar/refresh` → Python calendar-sentinel-mcp service → cross-references holidays against cutoffs → writes fresh `calendar_conflicts` rows.
- The MCP console at the bottom takes two commands: `check YYYY-MM-DD ISO` (returns weekend/holiday/business-day status + next business day) and `list-conflicts` (returns open conflicts). Both run client-side against Supabase for the demo; the real MCP server is live.
- "Apply suggestion" on a conflict writes `resolved_at` and the suggested shift date back to the `calendar_conflicts` row.

## Aesthetic (locked)
Editorial. Palette: page `#F1EBDB`, surface `#FAF5E7`, ink `#1A1917`, rule `#D9D2BE`. Accent sienna `#C24A1F`. Status forest/mustard/brick. Fraunces display + big numbers, Geist UI, JetBrains Mono tabular for every number. 4px/2px radius, hairlines only. No shadows/gradients/rounded-xl. Lucide 1.5px icons.

## Shell (already exists)
240px sidebar, 56px header, 1440px max, 48px gutters.

## Layout — five beats

**Beat 1 — Page header.** Eyebrow `COMPLIANCE · CALENDAR`, status `Live`. Title: `Calendar Sentinel`. Subtitle: "Cross-references every country's cutoff against public holidays, weekend rules, and approver availability — across twelve weeks. Exposed as an MCP server so Claude can answer date questions directly." Top-right action: `↻ Rescan horizon` outline button with spinning icon while running.

**Beat 2 — Metric strip (four columns, hairline dividers).** `COUNTRIES MONITORED` · count · `HORIZON` · `12 weeks` · `OPEN CONFLICTS` · count (coloured warn/crit if >0) · `CRITICAL` · count (coloured crit).

**Beat 3 — The calendar grid (Optikka corner-rule framing).** Hero block of the page, ~500px tall. Four corner-rule marks (the Optikka move) frame the grid. Inside: a table with countries as rows (left sticky column with flag + name + ISO) and 12 weeks as columns (top header shows week-start dates in mono 10px). Each cell is 8px tall, ~60px wide. Cell states:
- Neutral (default business-week): transparent, hairline border
- Has holiday: `var(--accent)` at 10% fill + tiny 🎌 dot... actually no emoji — use a small unfilled circle glyph in mono
- Has payroll cutoff this week: `var(--accent)` at 15% fill + sienna "✂" glyph
- Has conflict (any severity): the severity colour at 15% fill + warning icon (Lucide `AlertTriangle` at 12px for warn, `AlertOctagon` for crit)
A legend strip at the bottom of the grid in mono 10px: `CUTOFF` (sienna) · `HOLIDAY` (muted accent) · `INFO` (info blue) · `WARN` (mustard) · `CONFLICT` (crit).

**Beat 4 — Two-column split (60/40) below the grid.** Left: conflict panel. Eyebrow `DETECTED CONFLICTS · N open · M resolved`. Vertical list of conflict cards — each shows severity icon (Info/AlertTriangle/AlertOctagon), country flag + name, conflict type as a mono pill (`Holiday on cutoff` / `Timezone miss` / `Approver unavailable`), conflict date + days-until countdown (mono, coloured by urgency), a one-paragraph serif explanation in Fraunces 15px italic, and if there's a `suggested_shift_date` a "Suggested shift →" line with the new date in sienna mono. Actions: `Apply suggestion` (sienna outline button) + `Dismiss` (ghost).

Right: **MCP console**. Axiom-style panel with a monospace header `TERMINAL ICON · MCP TOOL CONSOLE` and right-aligned mono text `mcp://calendar-sentinel`. Below: a code-editor-style input with placeholder `check 2026-04-27 ZA`, a sienna `Run tool` button. Result panel below the input (min 120px tall, mono 11px) shows the tool response with `$ check 2026-04-27 ZA` style prompts then coloured result lines:
- `→ weekend: no` (green)
- `→ holiday: Freedom Day` (mustard)
- `→ business day: no` (warn)

**Beat 5 — Seed realistic conflicts.** Populate with 2 conflict rows:
1. `AU · 🇦🇺 Australia · Holiday on cutoff · 25 APR 2026 · crit · "ANZAC Day falls on payroll cutoff. Australian banks closed, ACH will not process. Move cutoff + bank submission to Wednesday 22 April." · Suggested shift → 22 APR 2026.`
2. `ZA · 🇿🇦 South Africa · Holiday on cutoff · 27 APR 2026 · warn · "Freedom Day (ZA public holiday) falls on a Monday. Standard cutoff of 25 April lands on weekend — shift submission to Friday 24 April." · Suggested shift → 24 APR 2026.`

## Non-negotiables
- The calendar grid is the hero — do not shrink it below 500px tall.
- Corner rules on the grid block, not on every card.
- No emoji in actual copy (country flag emoji in data rows are fine; no 🎉 or ✨).
- The MCP console must look like a real terminal — monospace, amber/sienna accents only, dark or tinted background.

## Voice
Senior engineer showing a Compliance lead that calendar conflicts are a real operational class, not a nice-to-have.

## Output
Export React + Tailwind for Next.js 16 App Router. Route: `app/app/compliance/calendar/page.tsx`. Components: `CalendarGrid.tsx`, `ConflictPanel.tsx`, `McpQueryInput.tsx`.
