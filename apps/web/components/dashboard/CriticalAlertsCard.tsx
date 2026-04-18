import Link from "next/link";
import { AlertTriangle, CircleAlert, Info } from "lucide-react";
import { formatRelativeTime } from "@/lib/formatters";

type Alert = {
  id: string;
  severity: "info" | "warn" | "crit";
  title: string;
  body: string | null;
  link_url: string | null;
  created_at: string;
};

const SEVERITY_META = {
  crit: { icon: CircleAlert, color: "var(--status-crit)", label: "crit" },
  warn: { icon: AlertTriangle, color: "var(--status-warn)", label: "warn" },
  info: { icon: Info, color: "var(--ink-tertiary)", label: "info" },
} as const;

export function CriticalAlertsCard({ alerts }: { alerts: Alert[] }) {
  return (
    <div className="rounded-sm border border-[color:var(--rule)] bg-card p-6 space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <p className="eyebrow">Critical alerts</p>
        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
          {alerts.length} unresolved
        </span>
      </div>

      {alerts.length === 0 ? (
        <p className="font-display text-xl text-muted-foreground flex-1 flex items-center">
          All clear.
        </p>
      ) : (
        <ul className="space-y-3 flex-1">
          {alerts.slice(0, 3).map((alert) => {
            const meta = SEVERITY_META[alert.severity];
            const Icon = meta.icon;
            const inner = (
              <div className="flex items-start gap-3 group">
                <Icon
                  className="h-4 w-4 shrink-0 mt-0.5"
                  style={{ color: meta.color }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-tight group-hover:underline decoration-[color:var(--brand)] underline-offset-4">
                    {alert.title}
                  </p>
                  {alert.body ? (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {alert.body}
                    </p>
                  ) : null}
                  <p className="text-[10px] text-[color:var(--ink-tertiary)] font-mono tabular-nums mt-1">
                    {formatRelativeTime(alert.created_at)}
                  </p>
                </div>
              </div>
            );
            return (
              <li key={alert.id}>
                {alert.link_url ? (
                  <Link href={alert.link_url}>{inner}</Link>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </ul>
      )}

      {alerts.length > 3 ? (
        <Link
          href="/app/compliance/audit"
          className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
        >
          View all {alerts.length} →
        </Link>
      ) : null}
    </div>
  );
}
