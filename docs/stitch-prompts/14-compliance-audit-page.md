# Claude Design prompt #14 — Compliance / Audit page

## How to use

**Step 1.** Open the same Atlas project in Claude Design (continue).

**Step 2.** Attach these 2 reference images from `C:\Users\USER-PC\.gemini\antigravity\brain\1fa4ee5a-eb53-46f0-a797-1e9bc935d003\playroll-ops\docs\references\`:

1. `ref-railway-dashboard.png` — the dense `[tag] message · duration` log table
2. `ref-axiom-logs.png` — the severity colour-dots on each log row

**Step 3.** Copy everything below the horizontal rule. Paste into Claude Design. Run. Share output.

---

I am attaching two reference images. **From Railway**, steal: the **dense log table** with left timestamp column (mono), bracketed-tag message column (`[input_parsed]`, `[filing_submitted]`, `[fx_check_run]`), right-aligned duration column. **From Axiom**, steal: the **tiny coloured severity dot left of each row** (matching the system that emitted the event) and the **query-metadata strip above the log** ("Examined N rows · Less than 3s · Run N minutes ago").

## What Atlas is (context)
Atlas is a payroll operations suite across six countries. The Audit page is the immutable log of every system-level action — for compliance, for debugging, for hiring managers who want to see that real events flowed through real services.

## What this page is
`/app/compliance/audit` — the reverse-chronological stream of every `audit_log` row. Filterable by actor, action, target type, and date range.

## Functional requirements
- Reads from Supabase `audit_log` table with joined actor (if user).
- Live-updating: pull fresh rows every 10s.
- Filter chips at the top: actor_type (`user` / `system` / `mcp`), action category (input / filing / variance / termination / fx / cycle), date window.
- Row click → right-side sheet with full metadata (JSON) of the event.

## Aesthetic (locked)
Editorial. Palette `#F1EBDB` / `#FAF5E7` / `#1A1917` / `#D9D2BE` / sienna / status. Fraunces display, Geist UI, JetBrains Mono every number. 4px/2px radius, hairlines only.

## Shell (already exists)
240px sidebar, 56px header, 1440px max, 48px gutters.

## Layout — four beats

**Beat 1 — Page header.** Eyebrow `COMPLIANCE · AUDIT TRAIL`, status `Live`. Title: `Audit trail`. Subtitle: "Every system action, every actor, every timestamp. Immutable by design. Streams live from the `audit_log` table."

**Beat 2 — Query-metadata strip (Axiom move).** Mono 12px: `Examined 842 rows · Less than 100ms · Live · filter applied: actor_type in (user, system, mcp)`. Right-aligned: a small `↻ Refresh` icon button.

**Beat 3 — Filter chips row.** `ALL ACTORS` · `USER` · `SYSTEM` · `MCP` · `ACTION ▾` · `COUNTRY ▾` · `DATE RANGE ▾`.

**Beat 4 — The log table (Railway + Axiom hybrid).** Columns:
- **Severity dot** (5px, left edge): info-blue / forest / mustard / brick based on `metadata.severity`
- `TIMESTAMP` mono 11px, tertiary — format `HH:MM:SS` local, with date greyed in smaller under it
- `ACTOR` — small avatar initials chip + actor type badge (user=sienna, system=tertiary, mcp=info)
- `ACTION` — bracketed mono tag in sienna (`[input_parsed]`, `[filing_submitted]`, `[fx_check_run]`, `[termination_logged]`, `[variance_narrated]`, `[cycle_opened]`)
- `TARGET` — mono 12px, format `input_parse_result · a3f8…2109`
- `METADATA` — a compact one-line summary extracted from the JSON (e.g. `confidence 0.92 · model gemini-2.5-flash`)
- `DURATION` — mono right-aligned tail (e.g. `1,240ms`, `88ms`, `Øms`)

Row height compact — ~40px. Hairline dividers. Dense. Approximately 20 rows visible before scroll. Scroll is smooth, newest rows insert at top with a subtle fade-in. Row hover shows a subtle left border in `var(--accent-soft)`.

**Sample rows (populate with real-feeling data):**
- `12:04:23 · TJ (user) · [input_approved] · input_parse_result · confidence 0.92 · 88ms`
- `12:03:57 · system · [variance_narrated] · variances · gemini-2.5-flash · 1,240ms`
- `12:02:11 · system · [fx_check_run] · fx_leakage · 5 pairs · 340ms`
- `12:01:40 · mcp · [calendar_query] · calendar_conflicts · check 2026-04-27 ZA · 22ms`
- `11:58:15 · system · [input_parsed] · input_messages · source slack · 960ms`
- `11:45:02 · TJ (user) · [termination_logged] · terminations · type voluntary · 1,580ms`
- `10:12:44 · system · [cycle_opened] · payroll_cycles · country DE · Øms`
- ... etc. (fill to ~20 rows)

**Below the table:** pagination mono "Showing 1–20 of 842 · Load older →".

## Non-negotiables
- Timestamp format is unchanged: `HH:MM:SS` tabular-nums mono.
- Every row has a severity dot — never absent.
- Bracketed action tags stay in sienna mono — never restyled.
- No "export CSV!" button as primary CTA — audit is read-only here. The Export action lives in the sheet when a row is opened.

## Voice
Quiet, operational, unadorned. The log speaks.

## Output
Export React + Tailwind for Next.js 16 App Router. Route: `app/app/compliance/audit/page.tsx`. Component: `AuditLogTable.tsx`.
