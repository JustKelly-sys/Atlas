"use client";

import { useEffect, useState } from "react";
import { CountryFlag } from "@/components/ui/CountryFlag";

type Cycle = {
  id: string;
  cutoff_at: string;
  total_gross_amount: number | null;
  employee_count: number | null;
  countries: { iso_code: string; name: string; currency: string; flag_emoji: string | null };
};

const TREND_12 = [
  { m: "MAY", v: 2510000 }, { m: "JUN", v: 2540000 }, { m: "JUL", v: 2580000 },
  { m: "AUG", v: 2600000 }, { m: "SEP", v: 2620000 }, { m: "OCT", v: 2670000 },
  { m: "NOV", v: 2690000 }, { m: "DEC", v: 2720000 }, { m: "JAN", v: 2760000 },
  { m: "FEB", v: 2790000 }, { m: "MAR", v: 2820000 }, { m: "APR", v: 2847392 },
];

const CLOSEOUT_12 = [
  { m: "MAY", ok: true }, { m: "JUN", ok: true }, { m: "JUL", ok: true },
  { m: "AUG", ok: true }, { m: "SEP", ok: true }, { m: "OCT", ok: true },
  { m: "NOV", ok: false }, { m: "DEC", ok: true },
  { m: "JAN", ok: true }, { m: "FEB", ok: true }, { m: "MAR", ok: true }, { m: "APR", ok: true },
];

function cdShort(ms: number) {
  if (ms <= 0) return "0s";
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${d}d ${h}h ${m}m`;
}

function TrendChart({ data }: { data: { m: string; v: number }[] }) {
  const W = 320, H = 48, pad = 2;
  const vals = data.map((d) => d.v);
  const min = Math.min(...vals), max = Math.max(...vals);
  const range = max - min || 1;
  const dx = (W - pad * 2) / (vals.length - 1);
  const pts = vals.map((v, i) => [
    pad + i * dx,
    H - pad - ((v - min) / range) * (H - pad * 2),
  ]);
  const path = pts
    .map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + " " + p[1].toFixed(1))
    .join(" ");
  const last = pts[pts.length - 1];
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height={H}
      preserveAspectRatio="none"
      style={{ display: "block" }}
    >
      <path
        d={path}
        fill="none"
        stroke="var(--ink-secondary)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={last[0]} cy={last[1]} r="2.5" fill="var(--brand)" />
    </svg>
  );
}

export function CycleStatusCard({ cycles }: { cycles: Cycle[] }) {
  const nearest = cycles.length
    ? cycles.reduce((a, b) =>
        new Date(a.cutoff_at) < new Date(b.cutoff_at) ? a : b,
      )
    : null;

  const [ms, setMs] = useState(() =>
    nearest ? new Date(nearest.cutoff_at).getTime() - Date.now() : 0,
  );

  useEffect(() => {
    if (!nearest) return;
    const tick = () => setMs(new Date(nearest.cutoff_at).getTime() - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [nearest?.cutoff_at]);

  if (cycles.length === 0) {
    return (
      <div style={{ border: "1px solid var(--rule)", background: "var(--card)", padding: "28px 32px" }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>CURRENT CYCLE</div>
        <div className="serif" style={{ fontSize: 32, color: "var(--ink-tertiary)", fontWeight: 400 }}>
          No open cycles.
        </div>
      </div>
    );
  }

  const totalEmployees = cycles.reduce((s, c) => s + (c.employee_count ?? 0), 0);
  const totalGross = cycles.reduce((s, c) => s + (c.total_gross_amount ?? 0), 0);
  const maxEmp = Math.max(...cycles.map((c) => c.employee_count ?? 0), 1);

  return (
    <div
      style={{
        border: "1px solid var(--rule)",
        background: "var(--card)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div style={{ padding: "22px 28px 14px", borderBottom: "1px solid var(--rule)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="eyebrow">CURRENT CYCLE · APR 2026</span>
          <span
            className="mono"
            style={{ fontSize: 10.5, color: "var(--ink-tertiary)", letterSpacing: "0.08em" }}
          >
            ALL {cycles.length} {cycles.length === 1 ? "COUNTRY" : "COUNTRIES"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 12 }}>
          <div
            className="serif tnum"
            style={{ fontSize: 54, fontWeight: 400, lineHeight: 1, letterSpacing: "-0.02em" }}
          >
            ${totalGross.toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </div>
          <div
            className="mono"
            style={{ fontSize: 11, color: "var(--ink-tertiary)", letterSpacing: "0.08em", marginBottom: 8 }}
          >
            USD
          </div>
          <div style={{ flex: 1 }} />
          <span className="pill pill-ok" style={{ marginBottom: 6 }}>↑ 3.2% vs March</span>
        </div>
        <div className="mono" style={{ fontSize: 11, color: "var(--ink-tertiary)", marginTop: 6 }}>
          total gross · open cycles · prior-cycle same stage
        </div>
      </div>

      {/* Country table */}
      <div style={{ padding: "8px 20px 4px" }}>
        <div className="eyebrow" style={{ padding: "10px 0 8px", color: "var(--ink-tertiary)" }}>
          BY COUNTRY
        </div>
        <div
          className="mono"
          style={{
            display: "grid",
            gridTemplateColumns: "22px 1.7fr 0.7fr 1.3fr 1fr 0.9fr",
            fontSize: 10,
            color: "var(--ink-tertiary)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "0 6px 6px",
            borderBottom: "1px solid var(--rule-soft)",
          }}
        >
          <span />
          <span>Country</span>
          <span>Emp</span>
          <span>Gross (local)</span>
          <span style={{ textAlign: "right" }}>Share</span>
          <span style={{ textAlign: "right" }}>Cutoff</span>
        </div>
        {cycles.map((c, i) => {
          const share = (c.employee_count ?? 0) / Math.max(totalEmployees, 1);
          const relShare = (c.employee_count ?? 0) / maxEmp;
          const cutoffMs = new Date(c.cutoff_at).getTime() - Date.now();
          const cd = cutoffMs > 0 ? cdShort(cutoffMs) : "overdue";
          const isWarn = cutoffMs > 0 && cutoffMs < 86400000 * 2;
          return (
            <div
              key={c.id}
              className="row-hover"
              style={{
                display: "grid",
                gridTemplateColumns: "22px 1.7fr 0.7fr 1.3fr 1fr 0.9fr",
                alignItems: "center",
                padding: "9px 6px",
                borderBottom: i < cycles.length - 1 ? "1px solid var(--rule-soft)" : "none",
              }}
            >
              <CountryFlag isoCode={c.countries.iso_code} size={16} />
              <span style={{ fontSize: 13, color: "var(--foreground)", fontWeight: 500 }}>
                {c.countries.name}
                <span
                  className="mono"
                  style={{ fontSize: 10, color: "var(--ink-tertiary)", marginLeft: 4, letterSpacing: "0.08em" }}
                >
                  {c.countries.currency}
                </span>
              </span>
              <span className="mono tnum" style={{ fontSize: 12, color: "var(--ink-secondary)" }}>
                {c.employee_count ?? 0}
              </span>
              <span style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                <span className="mono tnum" style={{ fontSize: 12.5, color: "var(--foreground)" }}>
                  {(c.total_gross_amount ?? 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </span>
                <span className="mono" style={{ fontSize: 10, color: "var(--ink-tertiary)" }}>
                  {c.countries.currency}
                </span>
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 12 }}>
                <div className="track" style={{ flex: 1 }}>
                  <div
                    className="fill"
                    style={{ right: `${(1 - relShare) * 100}%`, background: "var(--brand-soft)" }}
                  />
                </div>
                <span
                  className="mono tnum"
                  style={{ fontSize: 11.5, color: "var(--ink-secondary)", minWidth: 38, textAlign: "right" }}
                >
                  {(share * 100).toFixed(1)}%
                </span>
              </div>
              <span
                className="mono tnum"
                style={{
                  fontSize: 11.5,
                  textAlign: "right",
                  color: isWarn ? "var(--status-warn)" : "var(--ink-secondary)",
                }}
              >
                {cd}
              </span>
            </div>
          );
        })}
      </div>

      {/* Trend + Closeout strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          borderTop: "1px solid var(--rule)",
          marginTop: "auto",
        }}
      >
        <div style={{ padding: "14px 22px 16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <span className="eyebrow" style={{ fontSize: 9.5 }}>12-MONTH GROSS · USD</span>
            <span className="mono tnum" style={{ fontSize: 10.5, color: "var(--ink-tertiary)" }}>
              2.51M → 2.85M
            </span>
          </div>
          <TrendChart data={TREND_12} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            {TREND_12.filter((_, i) => i % 3 === 0 || i === TREND_12.length - 1).map((d, i) => (
              <span
                key={i}
                className="mono"
                style={{ fontSize: 9.5, color: "var(--ink-tertiary)", letterSpacing: "0.04em" }}
              >
                {d.m}
              </span>
            ))}
          </div>
        </div>
        <div style={{ padding: "14px 22px 16px", borderLeft: "1px solid var(--rule)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <span className="eyebrow" style={{ fontSize: 9.5 }}>12-MONTH CLOSEOUT</span>
            <span className="mono" style={{ fontSize: 10.5, color: "var(--status-ok)" }}>
              11 of 12 on-time
            </span>
          </div>
          <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 48 }}>
            {CLOSEOUT_12.map((d, i) => (
              <div
                key={i}
                title={d.ok ? `${d.m} · on time` : `${d.m} · late`}
                style={{
                  flex: 1,
                  height: d.ok ? "100%" : "60%",
                  background: d.ok
                    ? "color-mix(in oklch, var(--status-ok) 65%, transparent)"
                    : "var(--status-warn)",
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            {CLOSEOUT_12.filter((_, i) => i % 3 === 0 || i === CLOSEOUT_12.length - 1).map((d, i) => (
              <span
                key={i}
                className="mono"
                style={{ fontSize: 9.5, color: "var(--ink-tertiary)", letterSpacing: "0.04em" }}
              >
                {d.m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Cutoff countdown chip */}
      <div
        style={{
          position: "absolute",
          right: 22,
          top: 18,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            border: "1px solid var(--brand-strong)",
            borderRadius: "50%",
          }}
        />
        <span
          className="mono"
          style={{ fontSize: 11, color: "var(--brand-strong)", letterSpacing: "0.06em" }}
        >
          CUTOFF IN <span className="tnum">{cdShort(ms)}</span>
        </span>
      </div>
    </div>
  );
}
