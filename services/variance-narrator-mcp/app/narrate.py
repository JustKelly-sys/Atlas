"""Pure narration prompt-building and response-parsing.

Keeps the Gemini call and DB IO out of here so tests run offline.
"""
from typing import TypedDict


class CycleContext(TypedDict):
    country_name: str
    country_iso: str
    cycle_month: str
    total_gross_amount: float
    prior_total_gross_amount: float
    currency: str


class VarianceContext(TypedDict):
    variance_amount: float
    variance_pct: float
    cause_hint: str  # one of: headcount|rate|fx|statutory|bonus|unexplained|none


class EmployeeEvent(TypedDict):
    event_type: str
    effective_date: str
    details: str


SYSTEM_PROMPT = (
    "You are a payroll variance analyst. Given a cycle's totals, the prior cycle's "
    "totals, the variance, and employee-level events that occurred during the cycle, "
    "produce a single short paragraph (3-4 sentences) explaining WHY the variance "
    "occurred. Reference specific numbers from the data. Cite at least one concrete "
    "cause (headcount, rate, FX movement, statutory, bonus) unless nothing obvious "
    "explains it — then say 'unexplained, recommend manual reconciliation'. "
    "No filler, no AI-ish phrases. Write like a senior payroll ops associate would "
    "in a Slack message to finance."
)


def build_narration_prompt(
    cycle: CycleContext,
    variance: VarianceContext,
    events: list[EmployeeEvent],
) -> str:
    """Return the USER message for Gemini. System prompt is separate."""
    events_block = (
        "\n".join(
            f"- {e['event_type']} on {e['effective_date']}: {e.get('details', '')}".rstrip(": ")
            for e in events
        )
        or "- (no events on record for this cycle)"
    )
    return (
        f"Cycle: {cycle['country_name']} ({cycle['country_iso']}) — {cycle['cycle_month']}\n"
        f"Total gross this cycle: {cycle['total_gross_amount']:,.2f} {cycle['currency']}\n"
        f"Total gross prior cycle: {cycle['prior_total_gross_amount']:,.2f} {cycle['currency']}\n"
        f"Variance: {variance['variance_pct']:+.1f}% "
        f"({variance['variance_amount']:+,.2f} {cycle['currency']})\n\n"
        f"Employee events during cycle:\n{events_block}"
    )


def classify_cause(
    variance: VarianceContext,
    events: list[EmployeeEvent],
) -> str:
    """Heuristic to pick the most likely cause when the hint is missing.

    Used to stamp the cause_category column in the DB. Gemini can override
    the narrative, but this gives the column a sensible default.
    """
    if variance["cause_hint"] not in ("", "none", None):
        return variance["cause_hint"]

    types = [e["event_type"] for e in events]
    if "hire" in types or "termination" in types:
        return "headcount"
    if "rate_change" in types:
        return "rate"
    if "bonus" in types:
        return "bonus"
    if "tax_code_change" in types:
        return "statutory"
    return "unexplained"
