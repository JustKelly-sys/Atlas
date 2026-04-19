import Link from "next/link";
import { PageHeader } from "@/components/shell/PageHeader";

const PRINCIPLES = [
  {
    k: "01",
    t: "Narrate, don't summarize",
    b: "Every variance, every exception, every alert ships with a plain-English explanation. Operators don't hunt for root causes; the system tells them.",
  },
  {
    k: "02",
    t: "Human-in-the-loop by default",
    b: "AI proposes; operator disposes. Confidence scores on every parse. One-click approve, edit, or reject. No silent mutations.",
  },
  {
    k: "03",
    t: "Audit everything",
    b: "Every action — user, system, or MCP — is timestamped, attributed, and immutable. SOC 2 stream with 7-year retention.",
  },
  {
    k: "04",
    t: "Jurisdiction-aware",
    b: "Checklists, calendars, forms, and rates are local. The system knows ANZAC day closes AU banks and ZA tax certificates are due a year after termination.",
  },
  {
    k: "05",
    t: "Open where it matters",
    b: "MCP server surface for agents. Direct SQL on audit. CSV in / CSV out. No proprietary lock-in on your data.",
  },
];

const FIVE = [
  { code: "NP-01", name: "Input Parser", stack: "n8n · Gemini 2.5 Flash · Supabase", saved: "~6h/cycle", href: "/app/payroll/inputs" },
  { code: "NP-02", name: "FX Watchdog", stack: "FastAPI MCP · exchangerate.host", saved: "~2h/cycle", href: "/app/payroll/fx" },
  { code: "NP-06", name: "Variance Narrator", stack: "FastAPI MCP · Gemini 2.5 Flash", saved: "~4h/cycle", href: "/app/payroll/variance" },
  { code: "NP-20", name: "Termination Bot", stack: "n8n · Dedukto MCP · SARS PAYE", saved: "~3h/case", href: "/app/people/terminations" },
  { code: "NP-19", name: "Calendar Sentinel", stack: "FastAPI MCP · public holiday APIs", saved: "~1h/cycle", href: "/app/compliance/calendar" },
];

const ARCH = [
  { head: "INGEST", items: ["slack webhooks", "email parser", "whatsapp", "sheets", "bamboohr"] },
  { head: "BRAIN", items: ["gemini 2.5 flash", "n8n workflows", "fastapi services", "mcp server"] },
  { head: "STORE", items: ["supabase postgres", "audit log (append)", "document archive", "vector index"] },
  { head: "EGRESS", items: ["this dashboard", "slack notifications", "email alerts", "mcp → agents", "filing connectors"] },
];

export default function WhyAtlasPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="For Reviewers · Rationale"
        title="Why Atlas"
        subtitle="This is a working prototype, not a pitch deck. Below is the thinking behind what you're seeing, the architecture we chose, and where each piece sits on the live / prototype / roadmap continuum."
      />

      {/* Thesis */}
      <section className="corners" style={{ padding: "36px 40px", position: "relative" }}>
        <span className="cmark-tr" />
        <span className="cmark-bl" />
        <div className="eyebrow" style={{ marginBottom: 16 }}>THESIS</div>
        <div
          className="serif"
          style={{ fontSize: 28, fontWeight: 400, letterSpacing: "-0.015em", lineHeight: 1.3, maxWidth: 760 }}
        >
          Global payroll is <em>email and spreadsheets</em>, coordinated by heroes who remember everyone&apos;s
          public holidays. Atlas replaces the coordination layer, not the payroll engines, with narration,
          checks, and a memory.
        </div>
      </section>

      {/* Principles */}
      <section>
        <div className="eyebrow" style={{ marginBottom: 16 }}>PRINCIPLES</div>
        <div style={{ border: "1px solid var(--rule)" }}>
          {PRINCIPLES.map((p, i) => (
            <div
              key={p.k}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr 2fr",
                padding: "22px 26px",
                borderTop: i === 0 ? "none" : "1px solid var(--rule-soft)",
                gap: 24,
                alignItems: "start",
              }}
            >
              <span
                className="mono"
                style={{ fontSize: 28, color: "var(--ink-tertiary)", fontWeight: 300, letterSpacing: "-0.02em" }}
              >
                {p.k}
              </span>
              <div
                className="serif"
                style={{ fontSize: 22, fontWeight: 400, letterSpacing: "-0.01em", lineHeight: 1.2 }}
              >
                {p.t}
              </div>
              <div style={{ fontSize: 14, color: "var(--ink-secondary)", lineHeight: 1.6 }}>{p.b}</div>
            </div>
          ))}
        </div>
      </section>

      {/* The Five */}
      <section>
        <div className="eyebrow" style={{ marginBottom: 16 }}>THE FIVE · LIVE AUTOMATIONS</div>
        <div style={{ display: "grid", gap: 10 }}>
          {FIVE.map((a) => (
            <Link
              key={a.code}
              href={a.href}
              className="row-hover"
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1.6fr 1fr auto",
                padding: "18px 22px",
                border: "1px solid var(--rule)",
                background: "var(--card)",
                textDecoration: "none",
                gap: 18,
                alignItems: "center",
              }}
            >
              <span className="mono" style={{ fontSize: 11, color: "var(--ink-tertiary)", letterSpacing: "0.1em" }}>
                {a.code}
              </span>
              <div>
                <div className="serif" style={{ fontSize: 18, fontWeight: 400, letterSpacing: "-0.01em" }}>
                  {a.name}
                </div>
                <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-tertiary)", marginTop: 2 }}>
                  {a.stack}
                </div>
              </div>
              <div>
                <div className="eyebrow" style={{ fontSize: 9.5 }}>TIME SAVED</div>
                <div className="mono tnum" style={{ fontSize: 13, color: "var(--foreground)", marginTop: 2 }}>
                  {a.saved}
                </div>
              </div>
              <span className="mono" style={{ fontSize: 14, color: "var(--ink-tertiary)" }}>→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Status legend */}
      <section>
        <div className="eyebrow" style={{ marginBottom: 16 }}>STATUS LEGEND</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {(
            [
              ["Live", "pill-live", "Built, wired to real services, exercised in the demo. The five automations, dashboard, variance, FX, calendar, terminations, audit."],
              ["Prototype", "pill-proto", "UI designed and navigable. Data model documented. Not yet wired. Onboarding, Filings, Integrations, Reports."],
              ["Roadmap", "pill-road", "On the horizon. Scoped but not designed in detail. Settings, SSO, Workday, NetSuite."],
            ] as const
          ).map(([label, cls, desc]) => (
            <div key={label} style={{ border: "1px solid var(--rule)", background: "var(--card)", padding: 18 }}>
              <span className={`pill ${cls}`}>
                {label === "Live" && <span className="dot" />}
                {label}
              </span>
              <div style={{ fontSize: 13, color: "var(--ink-secondary)", marginTop: 12, lineHeight: 1.55 }}>
                {desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <section>
        <div className="eyebrow" style={{ marginBottom: 16 }}>ARCHITECTURE</div>
        <div style={{ border: "1px solid var(--rule)", background: "var(--card)", padding: 26 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {ARCH.map(({ head, items }) => (
              <div
                key={head}
                style={{ border: "1px solid var(--rule-soft)", padding: 14, background: "var(--surface-2)" }}
              >
                <div className="eyebrow" style={{ fontSize: 9.5, marginBottom: 10 }}>{head}</div>
                {items.map((it) => (
                  <div
                    key={it}
                    className="mono"
                    style={{ fontSize: 11, color: "var(--ink-secondary)", padding: "4px 0", letterSpacing: "0.02em" }}
                  >
                    {it}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
