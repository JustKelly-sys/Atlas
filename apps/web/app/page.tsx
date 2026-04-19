import Link from "next/link";

const FIVE = [
  {
    code: "NP-01",
    name: "Input Parser",
    stack: "n8n · Gemini 2.5 Flash · Supabase",
    why: "HR teams send payroll changes over email, Slack, WhatsApp. Nobody has time to build an API. This automation reads the message, extracts the structured change, and routes it to the right cycle — saving 6h per cycle.",
  },
  {
    code: "NP-02",
    name: "FX Watchdog",
    stack: "FastAPI MCP · exchangerate.host",
    why: "The 0.5–5% FX spread that nobody itemises is real money at scale. This service watches live rates against the rate used at approval and flags leakage before the run closes.",
  },
  {
    code: "NP-06",
    name: "Variance Narrator",
    stack: "FastAPI MCP · Gemini 2.5 Flash",
    why: "Month-on-month variance reviews are tedious. This MCP server generates a one-sentence English narrative for every flagged line — cutting the review meeting from 90 minutes to 20.",
  },
  {
    code: "NP-20",
    name: "Termination Checklist",
    stack: "n8n · Dedukto MCP · SARS PAYE",
    why: "Missed final-pay calculations, IRP5 codes, and pension windows generate fines and callbacks. This bot builds a jurisdiction-aware checklist the moment a termination is logged.",
  },
  {
    code: "NP-19",
    name: "Calendar Sentinel",
    stack: "FastAPI MCP · public holiday APIs",
    why: "Public-holiday collisions with payroll cut-off dates cause late payments and SLA breaches. This service checks every upcoming deadline against 6 countries' holiday calendars.",
  },
];

function AutomationCard({ code, name, stack, why }: { code: string; name: string; stack: string; why: string }) {
  return (
    <div style={{ border: "1px solid var(--rule)", background: "var(--card)", padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="mono" style={{ fontSize: 11, color: "var(--ink-tertiary)", letterSpacing: "0.1em" }}>{code}</span>
        <span className="pill pill-live" style={{ padding: "1px 6px", fontSize: 10 }}>
          <span className="dot" /> Live
        </span>
      </div>
      <p className="serif" style={{ fontSize: 20, fontWeight: 400, letterSpacing: "-0.01em", margin: 0 }}>{name}</p>
      <p className="mono" style={{ fontSize: 10.5, color: "var(--ink-tertiary)", letterSpacing: "0.02em", margin: 0 }}>{stack}</p>
      <p style={{ fontSize: 12.5, color: "var(--ink-secondary)", lineHeight: 1.6, margin: 0, borderTop: "1px solid var(--rule-soft)", paddingTop: 12 }}>{why}</p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div style={{ background: "var(--background)", color: "var(--foreground)", fontFamily: "var(--font-geist-sans)" }}>

      {/* Top bar */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 40px", borderBottom: "1px solid var(--rule)",
        position: "sticky", top: 0,
        background: "color-mix(in oklch, var(--background) 92%, transparent)",
        backdropFilter: "blur(8px)", zIndex: 50,
      }}>
        <span className="mono" style={{ fontSize: 10, letterSpacing: "0.1em", color: "var(--ink-tertiary)", textTransform: "uppercase" }}>
          Global Payroll Ops · A Portfolio by Tshepiso Jafta
        </span>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span className="serif" style={{ fontSize: 22, fontWeight: 400, letterSpacing: "-0.01em", lineHeight: 1 }}>Atlas</span>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--brand)" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span className="mono" style={{ fontSize: 10, letterSpacing: "0.1em", color: "var(--ink-tertiary)", textTransform: "uppercase" }}>
            Cape Town · April 2026
          </span>
          <Link href="/sign-in" className="mono" style={{
            fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase",
            padding: "6px 14px", border: "1px solid var(--brand)", color: "var(--brand)", textDecoration: "none",
          }}>
            → Enter the suite
          </Link>
        </div>
      </header>

      {/* Beat 1 — Hero */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "80px 40px", position: "relative", textAlign: "center",
      }}>
        {/* Corner rules */}
        <span style={{ position: "absolute", top: 0, left: 0, width: 120, height: 120, borderTop: "1px solid var(--rule)", borderLeft: "1px solid var(--rule)" }} />
        <span style={{ position: "absolute", top: 0, right: 0, width: 120, height: 120, borderTop: "1px solid var(--rule)", borderRight: "1px solid var(--rule)" }} />
        <span style={{ position: "absolute", bottom: 0, left: 0, width: 120, height: 120, borderBottom: "1px solid var(--rule)", borderLeft: "1px solid var(--rule)" }} />
        <span style={{ position: "absolute", bottom: 0, right: 0, width: 120, height: 120, borderBottom: "1px solid var(--rule)", borderRight: "1px solid var(--rule)" }} />

        <p className="mono eyebrow" style={{ marginBottom: 40 }}>Payroll Operations · Reconsidered.</p>
        <h1 className="serif" style={{ fontSize: "clamp(64px, 10vw, 96px)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 32 }}>
          Atlas.
        </h1>
        <p className="serif" style={{ fontSize: 26, fontWeight: 400, fontStyle: "italic", maxWidth: 680, lineHeight: 1.5, color: "var(--ink-secondary)", marginBottom: 80 }}>
          A payroll operations suite for the senior operator who has seen every generic SaaS dashboard already — and is done with them.
        </p>
        <p className="mono" style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-tertiary)", marginBottom: 48 }}>
          Built in a weekend. Five automations. Six deployed services. One editorial suite.
        </p>
        <div style={{ display: "flex", gap: 16 }}>
          <Link href="/sign-in" className="mono" style={{
            fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase",
            padding: "12px 24px", border: "1px solid var(--brand)", color: "var(--brand)", textDecoration: "none",
          }}>→ Enter the suite</Link>
          <Link href="/app/why-atlas" className="mono" style={{
            fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase",
            padding: "12px 24px", border: "1px solid var(--rule)", color: "var(--ink-secondary)", textDecoration: "none",
          }}>Read the why</Link>
        </div>
      </section>

      {/* Beat 2 — The problem */}
      <section style={{ padding: "100px 40px", borderTop: "1px solid var(--rule)", background: "var(--card)", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.35,
          backgroundImage: "linear-gradient(to right, var(--rule) 1px, transparent 1px), linear-gradient(to bottom, var(--rule) 1px, transparent 1px)",
          backgroundSize: "25% 80px",
        }} />
        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto" }}>
          <p className="eyebrow" style={{ marginBottom: 24 }}>The Problem · 21 Niche Frictions</p>
          <h2 className="serif" style={{ fontSize: 32, fontWeight: 400, maxWidth: 640, marginBottom: 48, lineHeight: 1.3 }}>
            The major payroll platforms compete on country count. None of them solve this.
          </h2>
          <blockquote style={{
            fontSize: 18, lineHeight: 1.7, maxWidth: 780, margin: "0 auto 24px",
            color: "var(--ink-secondary)", borderLeft: "2px solid var(--brand)",
            paddingLeft: 28, fontFamily: "var(--font-fraunces)", fontStyle: "italic",
          }}>
            "The 0.5–5% FX spread nobody itemises. The EMP501 that quietly mismatches interim IRP5 certificates. The pension re-enrolment window missed by two weeks and fined £400. The commission spreadsheet sorted alphabetically before import, so everyone got the wrong amount. The person holding forty manual checks in their head. These are the frictions ADP announced an enterprise agent for on 28 January 2026. The mid-market and EOR gap is open. Atlas is how it closes."
          </blockquote>
          <p className="mono" style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-tertiary)" }}>
            From the Valyu Deep Research · April 2026 · 21 Pain Points Identified
          </p>
        </div>
      </section>

      {/* Beat 3 — The five */}
      <section style={{ padding: "100px 40px", borderTop: "1px solid var(--rule)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p className="eyebrow" style={{ marginBottom: 24 }}>The Five Automations · Live</p>
          <h2 className="serif" style={{ fontSize: 32, fontWeight: 400, marginBottom: 48 }}>Each one built against a real pain point.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 12 }}>
            {FIVE.slice(0, 3).map((a) => <AutomationCard key={a.code} {...a} />)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, maxWidth: "66.6%", margin: "0 auto" }}>
            {FIVE.slice(3).map((a) => <AutomationCard key={a.code} {...a} />)}
          </div>
        </div>
      </section>

      {/* Beat 4 — The stack */}
      <section style={{ padding: "100px 40px", borderTop: "1px solid var(--rule)", background: "var(--card)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p className="eyebrow" style={{ marginBottom: 48 }}>The Stack · Six Deployed Services</p>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 48 }}>
            <div>
              <p className="eyebrow" style={{ fontSize: 9.5, marginBottom: 20 }}>Architecture</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  ["Next.js 16", "App Router + Turbopack"],
                  ["Supabase", "17 tables · RLS · Realtime"],
                  ["n8n (Render)", "2 workflows"],
                  ["variance-narrator-mcp", "FastAPI · MCP stdio"],
                  ["calendar-sentinel-mcp", "FastAPI · MCP stdio"],
                  ["fx-watchdog", "FastAPI · exchangerate.host"],
                ].map(([label, sub], i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", border: "1px solid var(--rule-soft)", background: "var(--surface-2)" }}>
                    <span className="mono" style={{ fontSize: 11, color: "var(--foreground)", fontWeight: 500 }}>{label}</span>
                    <span className="mono" style={{ fontSize: 10, color: "var(--ink-tertiary)" }}>· {sub}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="eyebrow" style={{ fontSize: 9.5, marginBottom: 20 }}>Five-Layer AI Stack</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {[
                  ["01", "Orchestration", "n8n"],
                  ["02", "Intelligence", "Gemini 2.5 Flash"],
                  ["03", "Persistence", "Supabase Postgres"],
                  ["04", "Protocol", "MCP stdio (2 services)"],
                  ["05", "Interface", "Next.js 16"],
                ].map(([n, label, val]) => (
                  <div key={n} style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
                    <span className="mono" style={{ fontSize: 11, color: "var(--ink-tertiary)", minWidth: 24 }}>{n}</span>
                    <span className="serif" style={{ fontSize: 16, fontWeight: 400 }}>{label}</span>
                    <span className="mono" style={{ fontSize: 11, color: "var(--ink-tertiary)" }}>· {val}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="eyebrow" style={{ fontSize: 9.5, marginBottom: 20 }}>Proof</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  ["GitHub", "github.com/JustKelly-sys/Atlas", "https://github.com/JustKelly-sys/Atlas"],
                  ["Live URL", "atlas-ops.vercel.app", "https://atlas-ops.vercel.app"],
                ].map(([label, val, href]) => (
                  <div key={label as string}>
                    <div className="eyebrow" style={{ fontSize: 9, marginBottom: 4 }}>{label as string}</div>
                    <a href={href as string} target="_blank" rel="noreferrer" className="mono" style={{ fontSize: 11, color: "var(--brand)", textDecoration: "underline", textUnderlineOffset: 3 }}>{val as string}</a>
                  </div>
                ))}
                <div>
                  <div className="eyebrow" style={{ fontSize: 9, marginBottom: 4 }}>Tests</div>
                  <span className="mono" style={{ fontSize: 11, color: "var(--ink-secondary)" }}>28 Python tests passing</span>
                </div>
                <div>
                  <div className="eyebrow" style={{ fontSize: 9, marginBottom: 6 }}>MCP Config</div>
                  <pre className="mono" style={{ fontSize: 10, background: "var(--surface-2)", border: "1px solid var(--rule)", padding: "8px 10px", lineHeight: 1.7, color: "var(--ink-secondary)", margin: 0, whiteSpace: "pre-wrap" }}>{`"variance-narrator": {\n  "command": "python",\n  "args": ["mcp_server.py"]\n}`}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beat 5 — Why Playroll */}
      <section style={{ padding: "100px 40px", borderTop: "1px solid var(--rule)", display: "flex", gap: 0 }}>
        <div style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", display: "flex", alignItems: "center", marginRight: 48, flexShrink: 0 }}>
          <span className="mono" style={{ fontSize: 9.5, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-tertiary)" }}>
            For · Playroll · Senior · Payroll · Ops
          </span>
        </div>
        <div style={{ maxWidth: 900 }}>
          <h2 className="serif" style={{ fontSize: 30, fontWeight: 400, marginBottom: 40 }}>Why Playroll specifically.</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {[
              "Playroll leads on emerging markets, compliance, white-label partnerships, and in-house expertise. Atlas is designed to sit on that positioning. The first automation (Input Parser) reflects the messy HR-comms reality of mid-market clients. The SARS EMP501/EMP201 mismatch pain point is surfaced deliberately — Playroll's Johannesburg and Cape Town ops hub sees that one every reconciliation window.",
              "ADP identified the category opportunity and shipped for enterprise on 28 January 2026. It will take 18 months to come down-market. In those 18 months, Playroll's mid-market segment has a window — and I'd like to help close it.",
              "This page is not a marketing pitch. It is a receipt that shows the work was done before the conversation started. Two commissioned Valyu deep-research reports. Eight reference images curated. A six-service deploy. One editorial suite.",
            ].map((p, i) => (
              <p key={i} className="serif" style={{ fontSize: 16, lineHeight: 1.75, color: "var(--ink-secondary)", margin: 0 }}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Beat 6 — Footer */}
      <footer style={{ borderTop: "1px solid var(--rule)", background: "var(--card)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", maxWidth: 1200, margin: "0 auto" }}>
          {[
            {
              eyebrow: "Built By",
              heading: "Tshepiso Jafta",
              body: (
                <span className="mono" style={{ fontSize: 11, color: "var(--ink-tertiary)" }}>
                  <a href="mailto:tshepiso@atlas-ops.app" style={{ color: "var(--brand)", textDecoration: "none" }}>tshepiso@atlas-ops.app</a>
                  {" · "}
                  <a href="https://linkedin.com/in/tshepiso-jafta" target="_blank" rel="noreferrer" style={{ color: "var(--ink-secondary)", textDecoration: "none" }}>LinkedIn</a>
                  {" · "}
                  <a href="https://github.com/JustKelly-sys" target="_blank" rel="noreferrer" style={{ color: "var(--ink-secondary)", textDecoration: "none" }}>GitHub</a>
                </span>
              ),
            },
            {
              eyebrow: "Built For",
              heading: null as string | null,
              body: <p className="serif" style={{ fontSize: 16, fontStyle: "italic", color: "var(--ink-secondary)", lineHeight: 1.6, margin: 0 }}>The senior global payroll ops role at Playroll, as a portfolio piece and interview artefact.</p>,
            },
            {
              eyebrow: "Built In",
              heading: "A weekend · April 2026" as string | null,
              body: <span className="mono" style={{ fontSize: 11, color: "var(--ink-tertiary)" }}>docs/superpowers/specs · two Valyu research reports in the repo</span>,
            },
          ].map((col, i) => (
            <div key={i} style={{ padding: "40px 32px", borderLeft: i === 0 ? "none" : "1px solid var(--rule)" }}>
              <p className="eyebrow" style={{ marginBottom: 12 }}>{col.eyebrow}</p>
              {col.heading && <p className="serif" style={{ fontSize: 18, fontWeight: 400, marginBottom: 8 }}>{col.heading}</p>}
              {col.body}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid var(--rule)", padding: "16px 40px", textAlign: "center" }}>
          <span className="mono" style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-tertiary)" }}>
            Made in Cape Town · Open Source (MIT) · Atlas is not a real product · It is a demonstration
          </span>
        </div>
      </footer>

      {/* Beat 7 — Fixed CTA */}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 50 }}>
        <Link href="/sign-in" className="mono" style={{
          fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase",
          padding: "8px 16px", border: "1px solid var(--brand)", color: "var(--brand)",
          textDecoration: "none", display: "block",
          background: "color-mix(in oklch, var(--background) 85%, transparent)",
          backdropFilter: "blur(8px)",
        }}>
          → Enter the suite
        </Link>
      </div>
    </div>
  );
}
