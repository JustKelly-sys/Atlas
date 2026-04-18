"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Clock,
  CheckCircle2,
  AlertCircle,
  Circle,
  Scale,
  Wallet,
  FileText,
  ShieldCheck,
  CalendarClock,
  Ban,
  ArrowRightLeft,
} from "lucide-react";
import { formatDate, daysUntil } from "@/lib/formatters";
import { cn } from "@/lib/utils";

type ItemType =
  | "final_pay"
  | "cobra"
  | "pension_dereg"
  | "pto_payout"
  | "garnishment_release"
  | "tax_certificate"
  | "direct_deposit_block"
  | "other";

type OwnerRole = "payroll" | "hr" | "finance" | "legal";

type ChecklistItem = {
  id: string;
  item_type: ItemType;
  description: string;
  statutory_deadline: string | null;
  owner_role: OwnerRole;
  status: "pending" | "in_progress" | "done" | "blocked";
  evidence_url: string | null;
  position: number;
};

type Termination = {
  id: string;
  termination_type: "voluntary" | "involuntary" | "deceased";
  notice_date: string;
  last_working_day: string;
  final_pay_deadline: string | null;
  jurisdiction_rules_version: string;
  status: "pending" | "in_progress" | "complete";
  employees: {
    id: string;
    full_name: string;
    role_title: string;
    email: string;
    countries: {
      iso_code: string;
      name: string;
      flag_emoji: string | null;
      currency: string;
    } | null;
  } | null;
};

const ITEM_ICON: Record<ItemType, typeof Wallet> = {
  final_pay: Wallet,
  cobra: ShieldCheck,
  pension_dereg: FileText,
  pto_payout: CalendarClock,
  garnishment_release: Scale,
  tax_certificate: FileText,
  direct_deposit_block: Ban,
  other: ArrowRightLeft,
};

const OWNER_COLOR: Record<OwnerRole, string> = {
  payroll: "var(--brand)",
  hr: "var(--status-info)",
  finance: "var(--status-ok)",
  legal: "var(--status-warn)",
};

const STATUS_ICON = {
  pending: Circle,
  in_progress: Clock,
  done: CheckCircle2,
  blocked: AlertCircle,
} as const;

export function TerminationChecklistPanel({
  terminationId,
}: {
  terminationId: string | null;
}) {
  const [termination, setTermination] = useState<Termination | null>(null);
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!terminationId) {
      setTermination(null);
      setItems([]);
      return;
    }
    void load(terminationId);
  }, [terminationId]);

  async function load(id: string) {
    setLoading(true);
    try {
      const sb = createClient();
      const [tResp, iResp] = await Promise.all([
        sb
          .from("terminations")
          .select(
            "id,termination_type,notice_date,last_working_day,final_pay_deadline,jurisdiction_rules_version,status,employees(id,full_name,role_title,email,countries(iso_code,name,flag_emoji,currency))",
          )
          .eq("id", id)
          .single(),
        sb
          .from("termination_checklist_items")
          .select("*")
          .eq("termination_id", id)
          .order("position"),
      ]);
      // flatten array-typed joined relations
      const raw = tResp.data as unknown as Record<string, unknown> | null;
      if (raw) {
        const emp = Array.isArray(raw.employees) ? raw.employees[0] : raw.employees;
        if (emp && typeof emp === "object") {
          const empObj = emp as Record<string, unknown>;
          const ctry = Array.isArray(empObj.countries)
            ? empObj.countries[0]
            : empObj.countries;
          empObj.countries = ctry ?? null;
        }
        raw.employees = emp ?? null;
        setTermination(raw as unknown as Termination);
      } else {
        setTermination(null);
      }
      setItems((iResp.data ?? []) as ChecklistItem[]);
    } finally {
      setLoading(false);
    }
  }

  if (!terminationId) {
    return (
      <div className="rounded-sm border border-[color:var(--rule)] bg-card flex items-center justify-center p-12 h-full">
        <p className="text-sm text-muted-foreground">
          Select a termination to view its jurisdiction-specific checklist.
        </p>
      </div>
    );
  }

  if (loading && !termination) {
    return (
      <div className="rounded-sm border border-[color:var(--rule)] bg-card flex items-center justify-center p-12 h-full">
        <p className="text-sm text-muted-foreground">Loading checklist…</p>
      </div>
    );
  }

  if (!termination) return null;

  const country = termination.employees?.countries;
  const done = items.filter((i) => i.status === "done").length;
  const total = items.length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="rounded-sm border border-[color:var(--rule)] bg-card flex flex-col h-full overflow-hidden">
      {/* Header: employee + jurisdiction */}
      <header className="px-6 py-5 border-b border-[color:var(--rule)]">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="eyebrow">Termination · {country?.name ?? "—"}</p>
            <h2 className="font-display text-xl tracking-[-0.01em] leading-tight mt-1">
              {termination.employees?.full_name}
            </h2>
            <p className="font-mono text-[11px] text-[color:var(--ink-tertiary)] mt-1">
              {termination.employees?.role_title} · {termination.employees?.email}
            </p>
          </div>
          <div className="text-2xl leading-none shrink-0">
            {country?.flag_emoji}
          </div>
        </div>

        <dl className="grid grid-cols-4 gap-4 mt-5 text-sm">
          <Stat label="Notice" value={formatDate(termination.notice_date, "short")} mono />
          <Stat
            label="Last day"
            value={formatDate(termination.last_working_day, "short")}
            mono
          />
          <Stat
            label="Final pay due"
            value={
              termination.final_pay_deadline
                ? formatDate(termination.final_pay_deadline, "short")
                : "—"
            }
            mono
          />
          <Stat
            label="Progress"
            value={`${done}/${total} · ${pct}%`}
            mono
            emphasis={pct === 100 ? "ok" : pct >= 50 ? "info" : "warn"}
          />
        </dl>

        <div className="mt-4 h-1 bg-[color:var(--rule)] rounded-full overflow-hidden">
          <div
            className="h-full transition-all"
            style={{
              width: `${pct}%`,
              background:
                pct === 100
                  ? "var(--status-ok)"
                  : "var(--brand)",
            }}
          />
        </div>
      </header>

      {/* Jurisdiction rules badge */}
      <div className="px-6 py-2.5 border-b border-[color:var(--rule)] bg-[color:var(--accent)]/40 flex items-center gap-2">
        <Scale className="h-3.5 w-3.5 text-[color:var(--ink-tertiary)]" aria-hidden />
        <p className="font-mono text-[11px] text-[color:var(--ink-tertiary)]">
          Jurisdiction rules {termination.jurisdiction_rules_version} · generated by
          Gemini 2.5 Flash
        </p>
      </div>

      {/* Checklist items */}
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-muted-foreground">
              No checklist items generated yet.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[color:var(--rule)]">
            {items.map((item) => (
              <ChecklistItemRow
                key={item.id}
                item={item}
                onToggle={async () => {
                  const sb = createClient();
                  const next =
                    item.status === "done" ? "pending" : "done";
                  await sb
                    .from("termination_checklist_items")
                    .update({ status: next })
                    .eq("id", item.id);
                  await load(terminationId);
                }}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  mono,
  emphasis,
}: {
  label: string;
  value: string;
  mono?: boolean;
  emphasis?: "ok" | "warn" | "info";
}) {
  const colorVar =
    emphasis === "ok"
      ? "var(--status-ok)"
      : emphasis === "warn"
        ? "var(--status-warn)"
        : emphasis === "info"
          ? "var(--status-info)"
          : undefined;
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <p
        className={cn(
          "mt-1",
          mono ? "font-mono tabular-nums text-sm" : "text-sm",
        )}
        style={colorVar ? { color: colorVar } : undefined}
      >
        {value}
      </p>
    </div>
  );
}

function ChecklistItemRow({
  item,
  onToggle,
}: {
  item: ChecklistItem;
  onToggle: () => void | Promise<void>;
}) {
  const Icon = ITEM_ICON[item.item_type];
  const StatusIcon = STATUS_ICON[item.status];
  const days = daysUntil(item.statutory_deadline);
  const overdue = days !== null && days < 0 && item.status !== "done";
  const urgent = days !== null && days >= 0 && days <= 3 && item.status !== "done";

  return (
    <li className="px-6 py-4 flex items-start gap-4">
      <button
        type="button"
        onClick={onToggle}
        className="mt-0.5 shrink-0"
        aria-label={item.status === "done" ? "mark incomplete" : "mark done"}
      >
        <StatusIcon
          className={cn(
            "h-4 w-4 transition-colors",
            item.status === "done" && "text-[color:var(--status-ok)]",
            item.status === "in_progress" && "text-[color:var(--status-info)]",
            item.status === "blocked" && "text-[color:var(--status-crit)]",
            item.status === "pending" && "text-[color:var(--ink-tertiary)]",
          )}
          aria-hidden
        />
      </button>

      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-start gap-2">
          <Icon
            className="h-3.5 w-3.5 text-[color:var(--ink-tertiary)] mt-0.5 shrink-0"
            aria-hidden
          />
          <p
            className={cn(
              "text-sm leading-snug",
              item.status === "done" &&
                "line-through text-[color:var(--ink-tertiary)]",
            )}
          >
            {item.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pl-5">
          <Badge
            variant="outline"
            className="font-mono text-[10px] uppercase tracking-wider"
            style={{
              color: OWNER_COLOR[item.owner_role],
              borderColor: OWNER_COLOR[item.owner_role],
            }}
          >
            {item.owner_role}
          </Badge>
          {item.statutory_deadline ? (
            <span
              className="font-mono text-[10px] tabular-nums"
              style={{
                color: overdue
                  ? "var(--status-crit)"
                  : urgent
                    ? "var(--status-warn)"
                    : "var(--ink-tertiary)",
              }}
            >
              Due {formatDate(item.statutory_deadline, "short")}
              {days !== null
                ? overdue
                  ? ` · ${Math.abs(days)}d overdue`
                  : ` · ${days}d left`
                : ""}
            </span>
          ) : null}
        </div>
      </div>

      {item.status !== "done" ? (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-[11px] shrink-0"
          disabled
          title="Evidence upload wired in production"
        >
          <Upload className="h-3 w-3 mr-1.5" />
          Evidence
        </Button>
      ) : null}
    </li>
  );
}
