import { PageHeader } from "@/components/shell/PageHeader";

const STAGES = ["Offer accepted", "Documents", "System setup", "Payroll config", "Go live"];

const PIPELINE = [
  { name: "Sipho Ndlovu", role: "Senior Dev", flag: "🇿🇦", iso: "ZA", stage: 0, startsIn: 21 },
  { name: "Emma Clarke", role: "Product Lead", flag: "🇬🇧", iso: "GB", stage: 1, startsIn: 14 },
  { name: "James Wu", role: "Engineering Manager", flag: "🇺🇸", iso: "US", stage: 2, startsIn: 7 },
  { name: "Lena Schmidt", role: "DevOps Lead", flag: "🇩🇪", iso: "DE", stage: 3, startsIn: 28 },
  { name: "Haruto Tanaka", role: "Data Scientist", flag: "🇿🇦", iso: "ZA", stage: 4, startsIn: 35 },
  { name: "Ama Boateng", role: "Backend Dev", flag: "🇦🇪", iso: "AE", stage: 0, startsIn: 42 },
];

export default function OnboardingPage() {
  const startingSoon = PIPELINE.filter((o) => o.startsIn <= 14).length;

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="People · Onboarding · Prototype"
        title="Onboarding"
        subtitle="Jurisdiction-aware new-hire pipelines from offer accepted to payroll live. Currently in design, shipping Q3."
        status="prototype"
      />

      {/* Stats strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          border: "1px solid var(--rule)",
          background: "var(--card)",
        }}
      >
        {[
          { label: "IN PIPELINE", value: PIPELINE.length.toString(), sub: "across 6 countries" },
          { label: "STARTING · 14D", value: startingSoon.toString(), sub: "expected live", accent: true },
          { label: "BLOCKED", value: "0", sub: "stage progression OK", ok: true },
          { label: "AVG TIME TO LIVE", value: "14d", sub: "offer → first paycheck" },
        ].map((s, i) => (
          <div
            key={s.label}
            style={{ padding: "22px 24px", borderLeft: i === 0 ? "none" : "1px solid var(--rule)" }}
          >
            <div className="eyebrow" style={{ marginBottom: 8 }}>{s.label}</div>
            <div
              className="serif tnum"
              style={{
                fontSize: 36,
                fontWeight: 400,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                color: s.accent ? "var(--brand)" : s.ok ? "var(--status-ok)" : "var(--foreground)",
              }}
            >
              {s.value}
            </div>
            <div className="mono" style={{ fontSize: 11, color: "var(--ink-tertiary)", marginTop: 6 }}>
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Stage kanban */}
      <section>
        <div className="eyebrow" style={{ marginBottom: 12 }}>STAGE BOARD</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {STAGES.map((stage, stageIdx) => {
            const inStage = PIPELINE.filter((o) => o.stage === stageIdx);
            return (
              <div
                key={stage}
                style={{
                  border: "1px solid var(--rule)",
                  background: "var(--card)",
                  padding: 14,
                  minHeight: 200,
                }}
              >
                <div className="eyebrow" style={{ fontSize: 9.5, marginBottom: 10 }}>
                  {String(stageIdx + 1).padStart(2, "0")} · {stage.toUpperCase()}
                </div>
                {inStage.map((o) => (
                  <div
                    key={o.name}
                    style={{
                      padding: 10,
                      background: "var(--surface-2)",
                      border: "1px solid var(--rule-soft)",
                      marginBottom: 8,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <span className="flag" style={{ fontSize: 12 }}>{o.flag}</span>
                      <span style={{ fontSize: 12, color: "var(--foreground)", fontWeight: 500, lineHeight: 1.2 }}>
                        {o.name}
                      </span>
                    </div>
                    <div className="mono" style={{ fontSize: 10, color: "var(--ink-tertiary)" }}>{o.role}</div>
                    <div className="mono" style={{ fontSize: 10, color: "var(--ink-secondary)", marginTop: 4 }}>
                      start · {o.startsIn}d
                    </div>
                  </div>
                ))}
                {inStage.length === 0 && (
                  <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-tertiary)" }}>—</div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Design notes */}
      <div
        style={{
          border: "1px dashed var(--rule)",
          background: "var(--surface-2)",
          padding: "22px 26px",
        }}
      >
        <div className="eyebrow" style={{ marginBottom: 8 }}>DESIGN NOTES · SHIPPING Q3</div>
        <ul style={{ margin: 0, paddingLeft: 18, color: "var(--ink-secondary)", fontSize: 13.5, lineHeight: 1.8 }}>
          <li>Per-country checklist templates (tax forms, work permits, banking verification)</li>
          <li>Slack-native new-hire onboarding concierge (auto-DM day 1, 7, 30)</li>
          <li>First-paycheck preview shared with hire before go-live</li>
          <li>Integration with BambooHR + HiBob webhooks for automatic ingest</li>
        </ul>
      </div>
    </div>
  );
}
