import Link from "next/link";

type Country = {
  id: string;
  iso_code: string;
  name: string;
  currency: string;
  flag_emoji: string | null;
};

type CycleSummary = {
  country_id: string;
  total_gross_amount: number | null;
  employee_count: number | null;
  cutoff_at: string;
};

function fmtCompact(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toString();
}

function cdShort(date: string) {
  const ms = new Date(date).getTime() - Date.now();
  if (ms <= 0) return "overdue";
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  return `${d}d ${h}h`;
}

function DataCell({
  label,
  value,
  unit,
  divider,
  tone = "ink",
}: {
  label: string;
  value: string;
  unit?: string;
  divider?: boolean;
  tone?: "ink" | "warn";
}) {
  return (
    <div
      style={{
        padding: "16px 18px",
        borderLeft: divider ? "1px solid var(--rule)" : "none",
      }}
    >
      <div className="eyebrow" style={{ fontSize: 9.5 }}>
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
        <span
          className="serif tnum"
          style={{
            fontSize: 19,
            letterSpacing: "-0.01em",
            color: tone === "warn" ? "var(--status-warn)" : "var(--foreground)",
          }}
        >
          {value}
        </span>
        {unit && (
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-tertiary)" }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

export function CountryGrid({
  countries,
  currentCycles,
}: {
  countries: Country[];
  currentCycles: CycleSummary[];
}) {
  const cycleByCountry = new Map(currentCycles.map((c) => [c.country_id, c]));

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
        <span className="eyebrow">FOOTPRINT · {countries.length} COUNTRIES</span>
        <span className="mono" style={{ fontSize: 10.5, color: "var(--ink-tertiary)" }}>
          {currentCycles.reduce((s, c) => s + (c.employee_count ?? 0), 0)} EMPLOYEES
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {countries.map((country) => {
          const cycle = cycleByCountry.get(country.id);
          const cutoffMs = cycle ? new Date(cycle.cutoff_at).getTime() - Date.now() : Infinity;
          const isWarn = cutoffMs > 0 && cutoffMs < 86400000 * 2;

          return (
            <Link
              key={country.id}
              href={`/app/payroll/cycle?country=${country.iso_code}`}
              className="row-hover"
              style={{
                border: "1px solid var(--rule)",
                background: "var(--card)",
                display: "block",
                textDecoration: "none",
              }}
            >
              {/* Card header */}
              <div
                style={{
                  padding: "20px 22px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <span className="flag" style={{ fontSize: 22, lineHeight: 1 }}>
                  {country.flag_emoji}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    className="serif"
                    style={{ fontSize: 20, fontWeight: 400, letterSpacing: "-0.01em", lineHeight: 1.1 }}
                  >
                    {country.name}
                  </div>
                  <div
                    className="mono"
                    style={{ fontSize: 10.5, color: "var(--ink-tertiary)", letterSpacing: "0.1em", marginTop: 2 }}
                  >
                    {country.iso_code} · {country.currency}
                  </div>
                </div>
                {cycle && (
                  <span className={`pill ${isWarn ? "pill-warn" : "pill-live"}`} style={{ padding: "1px 6px" }}>
                    {isWarn ? "WARN" : <><span className="dot" /> OPEN</>}
                  </span>
                )}
              </div>

              {/* Data cells */}
              <div
                style={{
                  borderTop: "1px solid var(--rule)",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                }}
              >
                <DataCell label="EMPLOYEES" value={cycle?.employee_count?.toString() ?? "—"} />
                <DataCell
                  label="GROSS"
                  value={cycle?.total_gross_amount ? fmtCompact(cycle.total_gross_amount) : "—"}
                  unit={country.currency}
                  divider
                />
                <DataCell
                  label="NEXT CUTOFF"
                  value={cycle ? cdShort(cycle.cutoff_at) : "—"}
                  divider
                  tone={isWarn ? "warn" : "ink"}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
