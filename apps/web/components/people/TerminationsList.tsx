"use client";

import { cn } from "@/lib/utils";
import { formatDate, daysUntil } from "@/lib/formatters";
import { UserMinus, Clock, CheckCircle2 } from "lucide-react";

export type TerminationRow = {
  id: string;
  termination_type: "voluntary" | "involuntary" | "deceased";
  notice_date: string;
  last_working_day: string;
  status: "pending" | "in_progress" | "complete";
  employees: {
    id: string;
    full_name: string;
    role_title: string;
    countries: { iso_code: string; name: string; flag_emoji: string | null } | null;
  } | null;
};

const TYPE_LABEL = {
  voluntary: "Resignation",
  involuntary: "Dismissal",
  deceased: "Deceased",
} as const;

export function TerminationsList({
  items,
  selectedId,
  onSelect,
}: {
  items: TerminationRow[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const active = items.filter((t) => t.status !== "complete");
  const historical = items.filter((t) => t.status === "complete");

  return (
    <aside className="rounded-sm border border-[color:var(--rule)] bg-card flex flex-col h-full overflow-hidden">
      <header className="flex items-center justify-between px-4 py-3 border-b border-[color:var(--rule)]">
        <p className="eyebrow">Terminations</p>
        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
          {active.length} active · {historical.length} done
        </span>
      </header>

      <ul className="flex-1 overflow-y-auto">
        {active.length > 0 ? (
          <li className="px-4 pt-3 pb-1.5">
            <p className="eyebrow text-[9px]">Active</p>
          </li>
        ) : null}
        {active.map((t) => (
          <Row
            key={t.id}
            t={t}
            selected={selectedId === t.id}
            onSelect={onSelect}
          />
        ))}

        {historical.length > 0 ? (
          <li className="px-4 pt-4 pb-1.5 border-t border-[color:var(--rule)]">
            <p className="eyebrow text-[9px]">Completed</p>
          </li>
        ) : null}
        {historical.map((t) => (
          <Row
            key={t.id}
            t={t}
            selected={selectedId === t.id}
            onSelect={onSelect}
          />
        ))}

        {items.length === 0 ? (
          <li className="px-4 py-8 text-center text-sm text-muted-foreground">
            No terminations yet.
          </li>
        ) : null}
      </ul>
    </aside>
  );
}

function Row({
  t,
  selected,
  onSelect,
}: {
  t: TerminationRow;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const days = daysUntil(t.last_working_day);
  const urgent = t.status !== "complete" && days !== null && days <= 7 && days >= 0;

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(t.id)}
        className={cn(
          "w-full text-left px-4 py-3 hover:bg-[color:var(--accent)] transition-colors border-l-2 border-l-transparent",
          selected &&
            "bg-[color:var(--accent)] border-l-[color:var(--brand)]",
        )}
      >
        <div className="flex items-center gap-2 mb-1">
          {t.status === "complete" ? (
            <CheckCircle2
              className="h-3 w-3 text-[color:var(--status-ok)] shrink-0"
              aria-hidden
            />
          ) : urgent ? (
            <Clock
              className="h-3 w-3 text-[color:var(--status-crit)] shrink-0"
              aria-hidden
            />
          ) : (
            <UserMinus
              className="h-3 w-3 text-[color:var(--ink-tertiary)] shrink-0"
              aria-hidden
            />
          )}
          <span className="text-sm font-medium truncate flex-1 min-w-0">
            {t.employees?.full_name ?? "—"}
          </span>
          <span className="text-base leading-none shrink-0">
            {t.employees?.countries?.flag_emoji}
          </span>
        </div>
        <p className="font-mono text-[11px] text-[color:var(--ink-tertiary)] truncate">
          {TYPE_LABEL[t.termination_type]} · {t.employees?.role_title ?? "—"}
        </p>
        <p className="font-mono text-[10px] text-[color:var(--ink-tertiary)] tabular-nums mt-1">
          LWD {formatDate(t.last_working_day, "short")}
          {urgent && days !== null ? (
            <span className="text-[color:var(--status-crit)]"> · {days}d</span>
          ) : null}
        </p>
      </button>
    </li>
  );
}
