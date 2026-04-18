import { formatRelativeTime } from "@/lib/formatters";
import {
  Activity,
  FileText,
  UserMinus,
  MessageSquare,
  DollarSign,
  UserPlus,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

type AuditEntry = {
  id: string;
  action: string;
  actor_type: "user" | "system" | "mcp";
  target_type: string | null;
  occurred_at: string;
  metadata: Record<string, unknown>;
};

const ICONS: Record<string, typeof Activity> = {
  login: Activity,
  cycle_opened: FileText,
  cycle_closed: CheckCircle2,
  variance_narrated: MessageSquare,
  input_parsed: MessageSquare,
  employee_updated: UserPlus,
  filing_submitted: FileText,
  alert_resolved: CheckCircle2,
  fx_check_run: DollarSign,
  termination_logged: UserMinus,
};

function humanize(action: string) {
  return action
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function ActivityFeed({ events }: { events: AuditEntry[] }) {
  return (
    <section className="rounded-sm border border-[color:var(--rule)] bg-card p-6 space-y-4 h-full flex flex-col">
      <header className="flex items-center justify-between">
        <p className="eyebrow">Recent activity</p>
        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
          last {events.length}
        </span>
      </header>

      {events.length === 0 ? (
        <p className="text-sm text-muted-foreground flex-1 flex items-center">
          No activity recorded yet.
        </p>
      ) : (
        <ul className="divide-y divide-[color:var(--rule)] flex-1">
          {events.slice(0, 8).map((e) => {
            const Icon = ICONS[e.action] ?? AlertCircle;
            return (
              <li key={e.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <Icon
                  className="h-3.5 w-3.5 text-[color:var(--ink-tertiary)] shrink-0"
                  aria-hidden
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-tight">{humanize(e.action)}</p>
                  <p className="text-[11px] text-[color:var(--ink-tertiary)] font-mono tabular-nums">
                    {e.actor_type} · {formatRelativeTime(e.occurred_at)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Link
        href="/app/compliance/audit"
        className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 decoration-[color:var(--rule)] hover:decoration-[color:var(--brand)]"
      >
        Full audit trail →
      </Link>
    </section>
  );
}
