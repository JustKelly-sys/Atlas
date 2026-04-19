import Link from "next/link";

type Alert = {
  id: string;
  severity: "info" | "warn" | "crit";
  title: string;
  body: string | null;
  link_url: string | null;
  created_at: string;
};

const PILL_CLASS: Record<Alert["severity"], string> = {
  crit: "pill-crit",
  warn: "pill-warn",
  info: "pill-neutral",
};

function timeSince(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

export function CriticalAlertsCard({ alerts }: { alerts: Alert[] }) {
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
          marginBottom: 14,
        }}
      >
        <span className="eyebrow">NEEDS ATTENTION · {alerts.length}</span>
        <span className="mono" style={{ fontSize: 10, color: "var(--ink-tertiary)" }}>
          UNRESOLVED
        </span>
      </div>

      {alerts.length === 0 ? (
        <div
          className="serif"
          style={{
            fontSize: 21,
            fontWeight: 400,
            color: "var(--ink-secondary)",
            flex: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          All clear.
        </div>
      ) : (
        <div style={{ flex: 1 }}>
          {alerts.slice(0, 4).map((a, i) => {
            const inner = (
              <div
                className="row-hover"
                style={{
                  padding: "14px 8px",
                  borderTop: i === 0 ? "1px solid var(--rule)" : "1px solid var(--rule-soft)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span className={`pill ${PILL_CLASS[a.severity]}`} style={{ padding: "1px 6px" }}>
                    {a.severity.toUpperCase()}
                  </span>
                  <span
                    className="mono"
                    style={{ fontSize: 10, color: "var(--ink-tertiary)", marginLeft: "auto" }}
                  >
                    {timeSince(a.created_at)}
                  </span>
                </div>
                <div
                  className="serif"
                  style={{
                    fontSize: 17,
                    fontWeight: 400,
                    color: "var(--foreground)",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.25,
                  }}
                >
                  {a.title}
                </div>
                {a.body && (
                  <div style={{ fontSize: 12, color: "var(--ink-secondary)", marginTop: 4 }}>
                    {a.body}
                  </div>
                )}
                {a.link_url && (
                  <div
                    className="mono"
                    style={{ fontSize: 10.5, color: "var(--ink-tertiary)", marginTop: 8, letterSpacing: "0.08em" }}
                  >
                    → {a.link_url.replace(/^https?:\/\//, "").split("/")[0]}
                  </div>
                )}
              </div>
            );
            return (
              <div key={a.id}>
                {a.link_url ? (
                  <Link href={a.link_url} style={{ textDecoration: "none" }}>
                    {inner}
                  </Link>
                ) : (
                  inner
                )}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ borderTop: "1px solid var(--rule-soft)", paddingTop: 10, marginTop: 6 }}>
        <Link
          href="/app/compliance/audit"
          className="mono"
          style={{ fontSize: 11, color: "var(--ink-secondary)", letterSpacing: "0.06em", textDecoration: "none" }}
        >
          ALL ALERTS →
        </Link>
      </div>
    </div>
  );
}
