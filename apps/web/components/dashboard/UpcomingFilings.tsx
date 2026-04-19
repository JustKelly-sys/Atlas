import Link from "next/link";
import { daysUntil } from "@/lib/formatters";

type Filing = {
  id: string;
  form_code: string;
  due_date: string;
  status: string;
  countries: { iso_code: string; name: string; flag_emoji: string | null } | null;
};

function urgencyColor(days: number | null): string {
  if (days === null) return "var(--ink-tertiary)";
  if (days < 0) return "var(--status-crit)";
  if (days <= 7) return "var(--brand)";
  if (days <= 21) return "var(--status-warn)";
  return "var(--ink-tertiary)";
}

function dueLabel(days: number | null): string {
  if (days === null) return "—";
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return "today";
  return `in ${days}d`;
}

function humanStatus(s: string) {
  return s.replace(/_/g, " ");
}

export function UpcomingFilings({ filings }: { filings: Filing[] }) {
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
        <span className="eyebrow">UPCOMING FILINGS</span>
        <span className="mono" style={{ fontSize: 10, color: "var(--ink-tertiary)", letterSpacing: "0.08em" }}>
          NEXT {Math.min(filings.length, 6)}
        </span>
      </div>

      {filings.length === 0 ? (
        <div
          className="serif"
          style={{ fontSize: 16, color: "var(--ink-secondary)", flex: 1, display: "flex", alignItems: "center" }}
        >
          No filings in the next window.
        </div>
      ) : (
        <div style={{ flex: 1 }}>
          {filings.slice(0, 6).map((f) => {
            const days = daysUntil(f.due_date);
            const color = urgencyColor(days);
            return (
              <div
                key={f.id}
                className="row-hover"
                style={{
                  display: "grid",
                  gridTemplateColumns: "22px 96px 1fr auto",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 6px",
                  borderTop: "1px solid var(--rule-soft)",
                }}
              >
                <span className="flag" style={{ fontSize: 14 }}>
                  {f.countries?.flag_emoji}
                </span>
                <span
                  className="mono"
                  style={{ fontSize: 12, color: "var(--foreground)", letterSpacing: "0.02em", fontWeight: 500 }}
                >
                  {f.form_code}
                </span>
                <span style={{ fontSize: 12.5, color: "var(--ink-secondary)" }}>
                  {humanStatus(f.status)}
                </span>
                <span className="mono tnum" style={{ fontSize: 11, letterSpacing: "0.02em", color }}>
                  {dueLabel(days)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ borderTop: "1px solid var(--rule)", marginTop: 10, paddingTop: 12 }}>
        <Link
          href="/app/compliance/filings"
          className="mono"
          style={{ fontSize: 11, color: "var(--ink-secondary)", letterSpacing: "0.08em", textDecoration: "none" }}
        >
          FILING CALENDAR →
        </Link>
      </div>
    </div>
  );
}
