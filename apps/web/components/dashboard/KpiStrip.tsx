type Kpi = {
  label: string;
  value: string;
  delta?: string;
  deltaDirection?: "up" | "down" | "flat";
  target?: string;
};

const DELTA_COLOR: Record<string, string> = {
  up: "var(--status-ok)",
  down: "var(--status-crit)",
  flat: "var(--ink-tertiary)",
};

export function KpiStrip({ kpis }: { kpis: Kpi[] }) {
  return (
    <section>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <span className="eyebrow">CYCLE METRICS · APR 2026</span>
        <span className="mono" style={{ fontSize: 10.5, color: "var(--ink-tertiary)" }}>
          VS LAST CYCLE · EST.
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          border: "1px solid var(--rule)",
          background: "var(--card)",
        }}
      >
        {kpis.map((kpi, i) => {
          const deltaColor = kpi.deltaDirection ? DELTA_COLOR[kpi.deltaDirection] : "var(--ink-tertiary)";
          const arrow =
            kpi.deltaDirection === "up" ? "↑" :
            kpi.deltaDirection === "down" ? "↓" :
            kpi.deltaDirection === "flat" ? "=" : null;

          return (
            <div
              key={kpi.label}
              style={{
                padding: "22px 22px",
                borderLeft: i === 0 ? "none" : "1px solid var(--rule)",
              }}
            >
              <div className="eyebrow">{kpi.label}</div>
              <div
                className="serif tnum"
                style={{
                  fontSize: 34,
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  marginTop: 10,
                  lineHeight: 1,
                  color: "var(--foreground)",
                }}
              >
                {kpi.value}
              </div>
              <div
                className="mono tnum"
                style={{ fontSize: 11.5, marginTop: 8, letterSpacing: "0.02em", color: deltaColor }}
              >
                {arrow} {kpi.delta ?? kpi.target ?? ""}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
