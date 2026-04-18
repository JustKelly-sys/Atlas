/**
 * Pre-written variance narration paragraphs. Will eventually be regenerated
 * via Gemini for any fresh variances, but seeding realistic examples means
 * the page renders instantly on first load.
 */
export const NARRATION_TEMPLATES = [
  {
    cause: "headcount",
    template:
      "{country} payroll up {pct}% this cycle — driven by {n} new hires onboarded mid-cycle contributing {amount} {currency} in pro-rated gross. Prior cycle had one leaver reversed, and no off-cycle bonuses. Expected pattern to persist for the next two cycles until the hiring pipeline clears.",
  },
  {
    cause: "fx",
    template:
      "{country} payroll up {pct}% in functional currency — local-currency gross held flat, but {base_currency} strengthened {fx_pct}% against USD over the month (spot rate moved from {old_rate} to {new_rate}). No underlying headcount or rate change. Variance is mechanical, not operational.",
  },
  {
    cause: "rate",
    template:
      "{country} payroll up {pct}% — annual merit cycle hit this period for {n} employees at an average increase of 3.2%. All changes were pre-approved in the Q1 compensation review. Benefits accrual mirrors the new base.",
  },
  {
    cause: "statutory",
    template:
      "{country} payroll up {pct}% due to statutory threshold change — {authority} raised the social security contribution cap effective this month, increasing employer-side contributions by {amount} {currency}. Employee-side untouched. Confirmed against gazette notice.",
  },
  {
    cause: "bonus",
    template:
      "{country} payroll up {pct}% — discretionary year-end bonuses paid to {n} employees totalling {amount} {currency}. Bonus pool was approved at the Nov board meeting and distributed on the standard Q2 cycle per company policy.",
  },
  {
    cause: "unexplained",
    template:
      "{country} variance of {pct}% flagged for review. Headcount, rate changes, FX movement, and statutory data all ruled out. Possible causes: retro adjustment from prior period, missed off-cycle entry, or data sync lag from HRIS. Recommend manual reconciliation against employee-level ledger before cycle close.",
  },
];

/** Fill a template with real values. */
export function fillNarration(
  cause: string,
  vars: Record<string, string | number>,
): string {
  const tmpl = NARRATION_TEMPLATES.find((t) => t.cause === cause);
  if (!tmpl) {
    return `Variance of ${vars.pct ?? "?"}% flagged. Category: ${cause}. Review recommended.`;
  }
  let out = tmpl.template;
  for (const [k, v] of Object.entries(vars)) {
    out = out.replaceAll(`{${k}}`, String(v));
  }
  return out;
}
