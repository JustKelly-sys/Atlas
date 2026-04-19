import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shell/PageHeader";

export const dynamic = "force-dynamic";

const ROADMAP = [
  { code: "NP-03", name: "Rate-change Validator", desc: "Flag mid-cycle rate changes that conflict with contract effective dates", status: "Prototype" },
  { code: "NP-04", name: "Retro-pay Calculator", desc: "Auto-compute backdated pay adjustments across partial cycles", status: "Prototype" },
  { code: "NP-07", name: "Statutory Scanner", desc: "Watch local payroll laws (MTD, thresholds, limits) and flag impact", status: "Roadmap" },
  { code: "NP-08", name: "Bonus Governor", desc: "Pre-flight bonus pools against policy + tax impact", status: "Roadmap" },
  { code: "NP-11", name: "Benefits Reconciler", desc: "Match benefits invoices to headcount; flag drift", status: "Roadmap" },
  { code: "NP-14", name: "Expense Auto-parse", desc: "Reimbursements through the inputs channel", status: "Roadmap" },
  { code: "NP-22", name: "Contractor Compliance", desc: "Classify IC vs employee, flag misclassification risk", status: "Roadmap" },
  { code: "NP-24", name: "Pay-parity Auditor", desc: "Monthly gender / region pay-gap calculation", status: "Roadmap" },
];

export default async function AutomationsPage() {
  const supabase = await createClient();

  const [inputsResp, fxResp, variancesResp, terminationsResp, calendarResp] = await Promise.all([
    supabase.from("input_messages").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("fx_leakage").select("cycle_leakage_amount"),
    supabase.from("variances").select("id", { count: "exact", head: true }).eq("flagged_for_review", true),
    supabase.from("terminations").select("id", { count: "exact", head: true }).eq("status", "in_progress"),
    supabase.from("calendar_conflicts").select("id", { count: "exact", head: true }).is("resolved_at", null),
  ]);

  const pendingInputs = inputsResp.count ?? 0;
  const fxLeakage = (fxResp.data ?? []).reduce((s, r) => s + Number(r.cycle_leakage_amount ?? 0), 0);
  const flaggedVariances = variancesResp.count ?? 0;
  const activeTerminations = terminationsResp.count ?? 0;
  const conflicts = calendarResp.count ?? 0;

  const FIVE = [
    {
      code: "NP-01",
      name: "Input Parser",
      stack: "n8n · Gemini 2.5 Flash · Supabase",
      value: pendingInputs.toString(),
      unit: "pending parses",
      saved: "~6h/cycle",
      href: "/app/payroll/inputs",
    },
    {
      code: "NP-02",
      name: "FX Watchdog",
      stack: "FastAPI MCP · exchangerate.host",
      value: `$${fxLeakage.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
      unit: "leakage this cycle",
      saved: "~2h/cycle",
      href: "/app/payroll/fx",
    },
    {
      code: "NP-06",
      name: "Variance Narrator",
      stack: "FastAPI MCP · Gemini 2.5 Flash",
      value: flaggedVariances.toString(),
      unit: "flagged for review",
      saved: "~4h/cycle",
      href: "/app/payroll/variance",
    },
    {
      code: "NP-20",
      name: "Termination Bot",
      stack: "n8n · Dedukto MCP · SARS PAYE",
      value: activeTerminations.toString(),
      unit: "active cases",
      saved: "~3h/case",
      href: "/app/people/terminations",
    },
    {
      code: "NP-19",
      name: "Calendar Sentinel",
      stack: "FastAPI MCP · public holiday APIs",
      value: conflicts.toString(),
      unit: "conflicts Q2",
      saved: "~1h/cycle",
      href: "/app/compliance/calendar",
    },
  ];

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Automations · Catalog"
        title="Automations"
        subtitle="The five live automations that power Atlas today, plus what's in design. Everything here has a spec; anything marked Live runs against real data."
      />

      {/* Live automations */}
      <section>
        <div className="eyebrow" style={{ marginBottom: 16 }}>LIVE · {FIVE.length}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {FIVE.map((a) => (
            <Link
              key={a.code}
              href={a.href}
              className="row-hover"
              style={{
                border: "1px solid var(--rule)",
                background: "var(--card)",
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                textDecoration: "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span className="mono" style={{ fontSize: 11, color: "var(--ink-tertiary)", letterSpacing: "0.1em" }}>
                  {a.code}
                </span>
                <span className="pill pill-live" style={{ padding: "1px 6px" }}>
                  <span className="dot" /> Live
                </span>
              </div>
              <div
                className="serif"
                style={{ fontSize: 22, fontWeight: 400, letterSpacing: "-0.01em", marginTop: 4 }}
              >
                {a.name}
              </div>
              <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-tertiary)", letterSpacing: "0.02em" }}>
                {a.stack}
              </div>
              <div
                style={{
                  borderTop: "1px solid var(--rule-soft)",
                  paddingTop: 12,
                  marginTop: 4,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <div className="eyebrow" style={{ fontSize: 9.5 }}>CURRENT</div>
                  <div
                    className="serif tnum"
                    style={{ fontSize: 22, marginTop: 4, lineHeight: 1, color: "var(--foreground)" }}
                  >
                    {a.value}
                  </div>
                  <div className="mono" style={{ fontSize: 10, color: "var(--ink-tertiary)", marginTop: 3 }}>
                    {a.unit}
                  </div>
                </div>
                <div>
                  <div className="eyebrow" style={{ fontSize: 9.5 }}>TIME SAVED</div>
                  <div className="mono tnum" style={{ fontSize: 14, color: "var(--foreground)", marginTop: 4 }}>
                    {a.saved}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section>
        <div className="eyebrow" style={{ marginBottom: 16 }}>IN DESIGN · {ROADMAP.length}</div>
        <div style={{ border: "1px solid var(--rule)", background: "var(--card)" }}>
          {ROADMAP.map((a, i) => (
            <div
              key={a.code}
              className="row-hover"
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1.4fr 2fr 120px",
                padding: "14px 22px",
                alignItems: "center",
                borderTop: i === 0 ? "none" : "1px solid var(--rule-soft)",
                gap: 16,
              }}
            >
              <span className="mono" style={{ fontSize: 11, color: "var(--ink-tertiary)", letterSpacing: "0.1em" }}>
                {a.code}
              </span>
              <span style={{ fontSize: 14, color: "var(--foreground)", fontWeight: 500 }}>{a.name}</span>
              <span style={{ fontSize: 12.5, color: "var(--ink-secondary)" }}>{a.desc}</span>
              <span>
                <span className={`pill ${a.status === "Prototype" ? "pill-proto" : "pill-road"}`}>
                  {a.status}
                </span>
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
