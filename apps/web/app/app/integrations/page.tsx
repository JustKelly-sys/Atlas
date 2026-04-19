import { PageHeader } from "@/components/shell/PageHeader";

const INTEGRATIONS = [
  { mono: "Bb", name: "BambooHR", desc: "HRIS sync — headcount changes, new-hire triggers, terminations. Webhook-based, near real-time.", status: "Prototype" },
  { mono: "Hi", name: "HiBob", desc: "HRIS sync for European-entity employees. Same event model as BambooHR.", status: "Prototype" },
  { mono: "Ns", name: "NetSuite", desc: "GL posting on payroll approval. Accrual lines, journal reference IDs, cost-centre split.", status: "Roadmap" },
  { mono: "Xr", name: "Xero", desc: "Payroll journal export for AU/NZ entities on the Xero accounting stack.", status: "Roadmap" },
  { mono: "Sl", name: "Slack", desc: "Variance alerts, approval requests, onboarding notifications. Live in the five automations.", status: "Prototype" },
  { mono: "Ok", name: "Okta", desc: "SSO and employee identity sync. Provision/de-provision on hire/term.", status: "Roadmap" },
  { mono: "Az", name: "Azure AD", desc: "Identity provider for Microsoft shops. SAML 2.0 + SCIM provisioning.", status: "Roadmap" },
  { mono: "Sh", name: "Google Sheets", desc: "Bulk input ingestion via the Input Parser. CSV-style uploads mapped to payroll inputs.", status: "Prototype" },
  { mono: "Jb", name: "Greenhouse", desc: "ATS integration — offer-accept webhook triggers onboarding pipeline.", status: "Roadmap" },
  { mono: "Wk", name: "Workday", desc: "HRIS + HCM sync for enterprise deployments. SOAP API + RAAS report extracts.", status: "Roadmap" },
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Integrations · Prototype"
        title="Integrations"
        subtitle="HRIS, accounting, identity, and workflow connectors. Pilots in design today; roll-out Q3/Q4."
        status="prototype"
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {INTEGRATIONS.map((it) => (
          <div
            key={it.name}
            style={{
              border: "1px solid var(--rule)",
              background: "var(--card)",
              padding: 18,
              display: "flex",
              gap: 14,
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                border: "1px solid var(--rule)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-display)",
                fontSize: 20,
                color: "var(--foreground)",
                fontWeight: 500,
                background: "var(--surface-2)",
                flexShrink: 0,
              }}
            >
              {it.mono}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span className="serif" style={{ fontSize: 17, fontWeight: 400 }}>
                  {it.name}
                </span>
                <span className={`pill ${it.status === "Prototype" ? "pill-proto" : "pill-road"}`}>
                  {it.status}
                </span>
              </div>
              <div style={{ fontSize: 12.5, color: "var(--ink-secondary)", lineHeight: 1.5, marginBottom: 12 }}>
                {it.desc}
              </div>
              <button
                className="mono"
                style={{
                  fontSize: 10.5,
                  letterSpacing: "0.08em",
                  padding: "4px 8px",
                  border: "1px solid var(--rule)",
                  background: "transparent",
                  color: "var(--ink-secondary)",
                  cursor: "pointer",
                }}
              >
                REQUEST EARLY ACCESS
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
