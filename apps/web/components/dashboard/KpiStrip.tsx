type Kpi = {
  label: string;
  value: string;
  delta?: string;
  deltaDirection?: "up" | "down" | "flat";
  target?: string;
};

export function KpiStrip({ kpis }: { kpis: Kpi[] }) {
  return (
    <section className="grid grid-cols-2 md:grid-cols-5 gap-6 rounded-sm border border-[color:var(--rule)] bg-card p-6">
      {kpis.map((kpi) => {
        const arrow =
          kpi.deltaDirection === "up"
            ? "↑"
            : kpi.deltaDirection === "down"
              ? "↓"
              : kpi.deltaDirection === "flat"
                ? "="
                : null;
        const deltaColor =
          kpi.deltaDirection === "up"
            ? "var(--status-ok)"
            : kpi.deltaDirection === "down"
              ? "var(--status-crit)"
              : "var(--ink-tertiary)";

        return (
          <div key={kpi.label} className="space-y-2">
            <p className="eyebrow">{kpi.label}</p>
            <p className="font-mono text-2xl tabular-nums leading-none">
              {kpi.value}
            </p>
            <div className="flex items-center gap-2 min-h-[16px]">
              {kpi.delta ? (
                <span
                  className="font-mono text-[11px] tabular-nums"
                  style={{ color: deltaColor }}
                >
                  {arrow} {kpi.delta}
                </span>
              ) : null}
              {kpi.target ? (
                <span className="text-[11px] text-muted-foreground font-mono">
                  {kpi.target}
                </span>
              ) : null}
            </div>
          </div>
        );
      })}
    </section>
  );
}
