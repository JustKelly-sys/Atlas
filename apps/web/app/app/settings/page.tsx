import { PageHeader } from "@/components/shell/PageHeader";

const SECTIONS = [
  {
    t: "Organization",
    items: ["Legal entity structure", "Countries of operation", "Payroll calendars", "Currencies & FX providers"],
  },
  {
    t: "Users & access",
    items: ["Team members & roles", "Country-scoped permissions", "Audit access policies", "SSO (Okta · Azure AD) · Q4"],
  },
  {
    t: "Automations",
    items: ["The five · enable/disable", "Confidence thresholds", "Approval routing", "Notification channels"],
  },
  {
    t: "Integrations",
    items: ["HRIS connections", "Accounting export", "Document storage", "Developer API keys"],
  },
  {
    t: "Data & retention",
    items: ["Audit log retention · 7 years", "PII masking", "Data residency", "GDPR subject requests"],
  },
  {
    t: "Billing",
    items: ["Plan & seats", "Invoices", "Payment method"],
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Settings · Roadmap"
        title="Settings"
        subtitle="Configuration surface for org, users, automations, data, and billing. On the roadmap; scoped but not yet built."
        status="roadmap"
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {SECTIONS.map((s) => (
          <div
            key={s.t}
            style={{ border: "1px solid var(--rule)", background: "var(--card)", padding: 22 }}
          >
            <div
              className="serif"
              style={{ fontSize: 20, fontWeight: 400, letterSpacing: "-0.01em", marginBottom: 14 }}
            >
              {s.t}
            </div>
            {s.items.map((it, i) => (
              <div
                key={it}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 0",
                  borderTop: i === 0 ? "none" : "1px solid var(--rule-soft)",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    border: "1px solid var(--rule)",
                    borderRadius: "50%",
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 13, color: "var(--ink-secondary)", flex: 1 }}>{it}</span>
                <span className="mono" style={{ fontSize: 10, color: "var(--ink-tertiary)" }}>—</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div
        style={{
          border: "1px dashed var(--rule)",
          background: "var(--surface-2)",
          padding: "22px 26px",
        }}
      >
        <div className="eyebrow" style={{ marginBottom: 8 }}>STATUS</div>
        <div style={{ fontSize: 13.5, color: "var(--ink-secondary)", lineHeight: 1.6 }}>
          Settings is designed at the structure level. The five live automations are configurable via
          environment config today; the surface above replaces env config with a reviewable UI once
          we have multi-tenant customers.
        </div>
      </div>
    </div>
  );
}
