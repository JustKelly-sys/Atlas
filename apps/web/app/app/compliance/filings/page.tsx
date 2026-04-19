import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shell/PageHeader";
import { daysUntil } from "@/lib/formatters";

export const dynamic = "force-dynamic";

type Filing = {
  id: string;
  form_code: string;
  due_date: string;
  status: string;
  countries: { iso_code: string; name: string; flag_emoji: string | null } | null;
};

function urgencyClass(days: number | null) {
  if (days === null) return "var(--ink-tertiary)";
  if (days < 0) return "var(--status-crit)";
  if (days <= 7) return "var(--brand)";
  if (days <= 21) return "var(--status-warn)";
  return "var(--ink-tertiary)";
}

function pillClass(status: string) {
  if (status === "accepted" || status === "submitted") return "pill-ok";
  if (status === "rejected") return "pill-crit";
  if (status === "prepared") return "pill-accent";
  return "pill-proto";
}

export default async function FilingsPage() {
  const supabase = await createClient();

  const { data: raw } = await supabase
    .from("filings")
    .select("id,form_code,due_date,status,countries(iso_code,name,flag_emoji)")
    .order("due_date");

  const filings: Filing[] = (raw ?? []).map((f) => ({
    ...f,
    countries: Array.isArray(f.countries) ? (f.countries[0] ?? null) : f.countries,
  }));

  const due30 = filings.filter((f) => {
    const d = daysUntil(f.due_date);
    return d !== null && d >= 0 && d <= 30;
  }).length;

  const submitted = filings.filter((f) => f.status === "submitted" || f.status === "accepted").length;
  const pending = filings.filter((f) => f.status === "not_started" || f.status === "prepared").length;

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Compliance · Filings · Prototype"
        title="Statutory Filings"
        subtitle="Scheduled and submitted payroll tax returns across every jurisdiction. Currently read-only; submission wired in pilot."
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
          { label: "DUE · 30D", value: due30.toString(), sub: "across 6 jurisdictions" },
          { label: "SUBMITTED · 30D", value: submitted.toString(), sub: "auto-filed where supported", ok: true },
          { label: "ACCEPTED", value: submitted > 0 ? "100%" : "—", sub: "no rejections · 12mo", ok: true },
          { label: "PENDING", value: pending.toString(), sub: "not yet filed" },
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
                color: s.ok ? "var(--status-ok)" : "var(--foreground)",
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

      {/* Filings table */}
      <div style={{ border: "1px solid var(--rule)", background: "var(--card)" }}>
        <div
          className="mono"
          style={{
            display: "grid",
            gridTemplateColumns: "32px 120px 1fr 120px 130px",
            padding: "11px 20px",
            borderBottom: "1px solid var(--rule)",
            fontSize: 10,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--ink-tertiary)",
            columnGap: 16,
          }}
        >
          <span />
          <span>Form</span>
          <span>Country</span>
          <span style={{ textAlign: "right" }}>Due</span>
          <span>Status</span>
        </div>

        {filings.length === 0 ? (
          <div style={{ padding: "32px 20px", color: "var(--ink-tertiary)", fontFamily: "var(--font-mono)", fontSize: 13 }}>
            No filings found.
          </div>
        ) : (
          filings.map((f, i) => {
            const days = daysUntil(f.due_date);
            return (
              <div
                key={f.id}
                className="row-hover"
                style={{
                  display: "grid",
                  gridTemplateColumns: "32px 120px 1fr 120px 130px",
                  padding: "14px 20px",
                  alignItems: "center",
                  borderTop: i === 0 ? "none" : "1px solid var(--rule-soft)",
                  columnGap: 16,
                }}
              >
                <span className="flag" style={{ fontSize: 16 }}>{f.countries?.flag_emoji}</span>
                <span className="mono" style={{ fontSize: 12, color: "var(--foreground)", fontWeight: 500 }}>
                  {f.form_code}
                </span>
                <span style={{ fontSize: 12.5, color: "var(--ink-secondary)" }}>
                  {f.countries?.name ?? "—"}
                </span>
                <span
                  className="mono tnum"
                  style={{ fontSize: 11.5, textAlign: "right", color: urgencyClass(days) }}
                >
                  {days === null ? "—" : days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? "today" : `${days}d`}
                </span>
                <span>
                  <span className={`pill ${pillClass(f.status)}`}>
                    {f.status.replace(/_/g, " ")}
                  </span>
                </span>
              </div>
            );
          })
        )}
      </div>

      <div
        style={{
          border: "1px dashed var(--rule)",
          background: "var(--surface-2)",
          padding: "22px 26px",
        }}
      >
        <div className="eyebrow" style={{ marginBottom: 8 }}>ROADMAP</div>
        <div style={{ fontSize: 13.5, color: "var(--ink-secondary)", lineHeight: 1.6 }}>
          Direct e-filing connectors for SARS (ZA), HMRC (GB), IRS (US), Finanzamt (DE), ATO (AU),
          and MOHRE (AE) are in pilot. Today, Atlas prepares and stages submissions; operators file
          one-click from the staging screen.
        </div>
      </div>
    </div>
  );
}
