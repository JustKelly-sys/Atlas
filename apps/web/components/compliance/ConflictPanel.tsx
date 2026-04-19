"use client";

import { CountryFlag } from "@/components/ui/CountryFlag";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertOctagon, Info, ArrowRight } from "lucide-react";
import { formatDate, daysUntil } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export type ConflictRow = {
  id: string;
  conflict_date: string;
  conflict_type:
    | "holiday_on_cutoff"
    | "timezone_cutoff_miss"
    | "approver_unavailable";
  severity: "info" | "warn" | "crit";
  suggested_shift_date: string | null;
  explanation: string;
  resolved_at: string | null;
  countries: {
    iso_code: string;
    name: string;
    flag_emoji: string | null;
  } | null;
};

const TYPE_LABEL: Record<ConflictRow["conflict_type"], string> = {
  holiday_on_cutoff: "Holiday on cutoff",
  timezone_cutoff_miss: "Timezone miss",
  approver_unavailable: "Approver unavailable",
};

const SEV_ICON = {
  info: Info,
  warn: AlertTriangle,
  crit: AlertOctagon,
} as const;

const SEV_COLOR = {
  info: "var(--status-info)",
  warn: "var(--status-warn)",
  crit: "var(--status-crit)",
} as const;

export function ConflictPanel({
  conflicts,
  onResolve,
}: {
  conflicts: ConflictRow[];
  onResolve: (id: string) => void | Promise<void>;
}) {
  const open = conflicts.filter((c) => !c.resolved_at);
  const resolved = conflicts.filter((c) => c.resolved_at);

  return (
    <section className="rounded-sm border border-[color:var(--rule)] bg-card">
      <header className="px-5 py-4 border-b border-[color:var(--rule)] flex items-center justify-between">
        <div>
          <p className="eyebrow">Detected conflicts</p>
          <p className="font-mono text-[11px] text-[color:var(--ink-tertiary)] mt-0.5">
            {open.length} open · {resolved.length} resolved
          </p>
        </div>
      </header>

      {open.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <p className="text-sm text-[color:var(--status-ok)] font-mono">
            ✓ No unresolved conflicts in the next 90 days.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-[color:var(--rule)]">
          {open.map((c) => {
            const Icon = SEV_ICON[c.severity];
            const color = SEV_COLOR[c.severity];
            const days = daysUntil(c.conflict_date);
            return (
              <li key={c.id} className="px-5 py-4 space-y-2.5">
                <div className="flex items-start gap-3">
                  <Icon
                    className="h-4 w-4 mt-0.5 shrink-0"
                    style={{ color }}
                    aria-hidden
                  />
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      {c.countries?.iso_code && <CountryFlag isoCode={c.countries.iso_code} size={14} />}
                      <p className="text-sm font-medium">
                        {c.countries?.name}
                      </p>
                      <Badge
                        variant="outline"
                        className="font-mono text-[10px] uppercase tracking-wider"
                        style={{ color, borderColor: color }}
                      >
                        {TYPE_LABEL[c.conflict_type]}
                      </Badge>
                      <span className="font-mono text-[10px] text-[color:var(--ink-tertiary)] ml-auto tabular-nums">
                        {formatDate(c.conflict_date, "short")}
                        {days !== null && days >= 0 ? ` · ${days}d` : ""}
                      </span>
                    </div>
                    <p
                      className="text-sm leading-relaxed text-[color:var(--ink-secondary,var(--ink-primary))]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {c.explanation}
                    </p>
                    {c.suggested_shift_date ? (
                      <p className="font-mono text-[11px] text-[color:var(--ink-tertiary)] tabular-nums flex items-center gap-1.5">
                        Suggested shift
                        <ArrowRight className="h-3 w-3" aria-hidden />
                        <span className={cn("text-[color:var(--brand)]")}>
                          {formatDate(c.suggested_shift_date, "medium")}
                        </span>
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center gap-2 pl-7">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-[11px]"
                    onClick={() => onResolve(c.id)}
                  >
                    Apply suggestion
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-[11px]"
                    disabled
                  >
                    Dismiss
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
