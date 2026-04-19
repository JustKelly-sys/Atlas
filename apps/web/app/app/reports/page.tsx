import { PageHeader } from "@/components/shell/PageHeader";

const CATEGORIES = [
  {
    cat: "Cycle",
    items: [
      { t: "Monthly cycle summary", d: "Gross, net, tax withheld by country · month-on-month trend", out: "PDF · CSV" },
      { t: "Cost-by-country", d: "Fully-loaded cost per employee by jurisdiction, currency, and cycle", out: "CSV · XLSX" },
      { t: "Headcount movement", d: "Starters / leavers / changes by country · rolling 12mo", out: "PDF · CSV" },
    ],
  },
  {
    cat: "Compliance",
    items: [
      { t: "Filing status", d: "Due / submitted / accepted by jurisdiction and form", out: "PDF" },
      { t: "Audit extract", d: "Full audit log over a date range, filterable by actor and event", out: "CSV · JSON" },
      { t: "Tax summary", d: "PAYE/income tax withheld with reconciliation to filings", out: "PDF · CSV" },
    ],
  },
  {
    cat: "Finance",
    items: [
      { t: "GL posting file", d: "Accrual-ready journal lines for NetSuite/Xero/Workday-ledger", out: "CSV · IIF" },
      { t: "FX leakage ledger", d: "Interbank vs applied rates with dollar leakage per pair", out: "XLSX" },
      { t: "Cashflow forecast", d: "90-day payroll cashflow by funding account", out: "PDF · CSV" },
    ],
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Reports · Prototype"
        title="Reports"
        subtitle="A catalog of reports Atlas will generate on demand. The report shelf is wired; exports land next cycle."
        status="prototype"
      />

      {CATEGORIES.map((cat) => (
        <section key={cat.cat}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            {cat.cat.toUpperCase()} · {cat.items.length}
          </div>
          <div style={{ border: "1px solid var(--rule)", background: "var(--card)" }}>
            {cat.items.map((r, i) => (
              <div
                key={r.t}
                className="row-hover"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr 130px 100px",
                  padding: "14px 22px",
                  alignItems: "center",
                  borderTop: i === 0 ? "none" : "1px solid var(--rule-soft)",
                  gap: 16,
                }}
              >
                <span style={{ fontSize: 14, color: "var(--foreground)", fontWeight: 500 }}>{r.t}</span>
                <span style={{ fontSize: 12.5, color: "var(--ink-secondary)" }}>{r.d}</span>
                <span className="mono" style={{ fontSize: 11, color: "var(--ink-tertiary)", letterSpacing: "0.04em" }}>
                  {r.out}
                </span>
                <button
                  className="mono"
                  style={{
                    fontSize: 10.5,
                    letterSpacing: "0.08em",
                    padding: "5px 10px",
                    border: "1px solid var(--rule)",
                    background: "transparent",
                    color: "var(--ink-secondary)",
                    cursor: "pointer",
                    justifySelf: "end",
                  }}
                >
                  GENERATE
                </button>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
