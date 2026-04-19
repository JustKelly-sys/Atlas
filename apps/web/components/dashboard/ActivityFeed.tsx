import Link from "next/link";
import { formatRelativeTime } from "@/lib/formatters";

type AuditEntry = {
  id: string;
  action: string;
  actor_type: "user" | "system" | "mcp";
  target_type: string | null;
  occurred_at: string;
  metadata: Record<string, unknown>;
};

const ACTION_ICON: Record<string, string> = {
  login: "→",
  cycle_opened: "◎",
  cycle_closed: "✓",
  variance_narrated: "≋",
  input_parsed: "⟳",
  employee_updated: "✦",
  filing_submitted: "◈",
  alert_resolved: "✓",
  fx_check_run: "◆",
  termination_logged: "✗",
};

function humanize(action: string) {
  return action.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function ActivityFeed({ events }: { events: AuditEntry[] }) {
  return (
    <div
      style={{
        border: "1px solid var(--rule)",
        background: "var(--card)",
        padding: 22,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <span className="eyebrow">RECENT ACTIVITY</span>
        <span className="mono" style={{ fontSize: 10, color: "var(--ink-tertiary)", letterSpacing: "0.08em" }}>
          LAST {Math.min(events.length, 8)}
        </span>
      </div>

      {events.length === 0 ? (
        <div
          className="serif"
          style={{ fontSize: 16, color: "var(--ink-secondary)", flex: 1, display: "flex", alignItems: "center" }}
        >
          No activity recorded yet.
        </div>
      ) : (
        <div style={{ flex: 1 }}>
          {events.slice(0, 8).map((e) => (
            <div
              key={e.id}
              className="row-hover"
              style={{
                display: "grid",
                gridTemplateColumns: "20px 1fr auto",
                alignItems: "center",
                gap: 10,
                padding: "10px 6px",
                borderTop: "1px solid var(--rule-soft)",
              }}
            >
              <span style={{ fontSize: 12, color: "var(--ink-tertiary)", fontFamily: "var(--font-mono)" }}>
                {ACTION_ICON[e.action] ?? "·"}
              </span>
              <span style={{ fontSize: 13, color: "var(--foreground)" }}>{humanize(e.action)}</span>
              <span className="mono tnum" style={{ fontSize: 10, color: "var(--ink-tertiary)" }}>
                {formatRelativeTime(e.occurred_at)}
              </span>
            </div>
          ))}
        </div>
      )}

      <div style={{ borderTop: "1px solid var(--rule)", marginTop: 10, paddingTop: 12 }}>
        <Link
          href="/app/compliance/audit"
          className="mono"
          style={{ fontSize: 11, color: "var(--ink-secondary)", letterSpacing: "0.08em", textDecoration: "none" }}
        >
          FULL AUDIT TRAIL →
        </Link>
      </div>
    </div>
  );
}
