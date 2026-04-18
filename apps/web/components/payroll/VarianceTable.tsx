"use client";

import { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ChevronDown, ChevronRight, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { toast } from "sonner";

export type VarianceRow = {
  id: string;
  cycle_id: string;
  variance_amount: number;
  variance_pct: number;
  threshold_crossed: boolean;
  cause_category:
    | "headcount"
    | "rate"
    | "fx"
    | "statutory"
    | "bonus"
    | "unexplained"
    | null;
  narration_text: string | null;
  narration_model: string | null;
  flagged_for_review: boolean;
  created_at: string;
  countries: {
    iso_code: string;
    name: string;
    currency: string;
    flag_emoji: string | null;
  } | null;
  payroll_cycles: { cycle_month: string } | null;
};

const CAUSE_STYLE: Record<
  NonNullable<VarianceRow["cause_category"]>,
  { color: string; label: string }
> = {
  headcount: { color: "var(--status-info)", label: "Headcount" },
  rate: { color: "var(--brand)", label: "Rate change" },
  fx: { color: "var(--status-warn)", label: "FX" },
  statutory: { color: "var(--status-ok)", label: "Statutory" },
  bonus: { color: "var(--brand)", label: "Bonus" },
  unexplained: { color: "var(--status-crit)", label: "Unexplained" },
};

export function VarianceTable({
  rows,
  onNarrated,
}: {
  rows: VarianceRow[];
  onNarrated: () => void | Promise<void>;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [narratingId, setNarratingId] = useState<string | null>(null);

  async function narrate(id: string) {
    setNarratingId(id);
    try {
      const res = await fetch(`/api/variance/narrate/${id}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(`Narrate failed: ${data.error ?? "unknown"}`);
        return;
      }
      toast.success("Narration generated");
      setExpanded(id);
      await onNarrated();
    } finally {
      setNarratingId(null);
    }
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-sm border border-[color:var(--rule)] bg-card p-12 text-center">
        <p className="text-sm text-muted-foreground">
          No variances exceed your threshold this cycle.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-[color:var(--rule)] bg-card overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[color:var(--rule)] bg-[color:var(--accent)]/40">
            <th className="w-8" />
            <th className="text-left eyebrow py-3 px-4">Country</th>
            <th className="text-left eyebrow py-3 px-4">Cycle</th>
            <th className="text-right eyebrow py-3 px-4">Amount</th>
            <th className="text-right eyebrow py-3 px-4">%</th>
            <th className="text-left eyebrow py-3 px-4">Cause</th>
            <th className="text-right eyebrow py-3 px-4">Narration</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const isOpen = expanded === r.id;
            const causeStyle = r.cause_category
              ? CAUSE_STYLE[r.cause_category]
              : null;
            const positive = r.variance_amount >= 0;
            return (
              <Fragment key={r.id}>
                <tr
                  className={cn(
                    "border-b border-[color:var(--rule)] cursor-pointer hover:bg-[color:var(--accent)]/40 transition-colors",
                    isOpen && "bg-[color:var(--accent)]/40",
                    r.flagged_for_review &&
                      "border-l-2 border-l-[color:var(--status-crit)]",
                  )}
                  onClick={() => setExpanded(isOpen ? null : r.id)}
                >
                  <td className="py-3 px-2">
                    {isOpen ? (
                      <ChevronDown className="h-3.5 w-3.5 text-[color:var(--ink-tertiary)]" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-[color:var(--ink-tertiary)]" />
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-base">
                        {r.countries?.flag_emoji}
                      </span>
                      <span className="text-sm">
                        {r.countries?.name ?? "—"}
                      </span>
                      {r.flagged_for_review ? (
                        <Flag
                          className="h-3 w-3 text-[color:var(--status-crit)]"
                          aria-hidden
                        />
                      ) : null}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-[color:var(--ink-tertiary)] tabular-nums">
                    {r.payroll_cycles?.cycle_month
                      ? formatDate(r.payroll_cycles.cycle_month, "short")
                      : "—"}
                  </td>
                  <td
                    className="py-3 px-4 font-mono tabular-nums text-right text-sm"
                    style={{
                      color: positive
                        ? "var(--status-warn)"
                        : "var(--status-info)",
                    }}
                  >
                    {positive ? "+" : ""}
                    {formatCurrency(
                      r.variance_amount,
                      r.countries?.currency ?? "USD",
                    )}
                  </td>
                  <td
                    className="py-3 px-4 font-mono tabular-nums text-right text-sm"
                    style={{
                      color: r.threshold_crossed
                        ? "var(--status-crit)"
                        : "var(--ink-primary)",
                    }}
                  >
                    {positive ? "+" : ""}
                    {r.variance_pct.toFixed(1)}%
                  </td>
                  <td className="py-3 px-4">
                    {causeStyle ? (
                      <Badge
                        variant="outline"
                        className="font-mono text-[10px] uppercase tracking-wider"
                        style={{
                          color: causeStyle.color,
                          borderColor: causeStyle.color,
                        }}
                      >
                        {causeStyle.label}
                      </Badge>
                    ) : (
                      <span className="text-xs text-[color:var(--ink-tertiary)]">
                        —
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {r.narration_text ? (
                      <span className="text-[10px] font-mono text-[color:var(--status-ok)]">
                        ✓ narrated
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-[11px]"
                        disabled={narratingId === r.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          void narrate(r.id);
                        }}
                      >
                        <Sparkles className="h-3 w-3 mr-1.5" />
                        {narratingId === r.id ? "Narrating…" : "Narrate"}
                      </Button>
                    )}
                  </td>
                </tr>
                {isOpen ? (
                  <tr className="border-b border-[color:var(--rule)]">
                    <td colSpan={7} className="px-6 py-5 bg-[color:var(--accent)]/20">
                      {r.narration_text ? (
                        <div className="space-y-2 max-w-3xl">
                          <p
                            className="text-base leading-relaxed"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            {r.narration_text}
                          </p>
                          <p className="font-mono text-[10px] text-[color:var(--ink-tertiary)] tabular-nums">
                            Generated {formatDate(r.created_at, "short")} ·{" "}
                            {r.narration_model ?? "gemini-2.5-flash"}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No narration yet. Click{" "}
                          <strong>Narrate</strong> to generate one via
                          Gemini 2.5 Flash.
                        </p>
                      )}
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
