"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shell/PageHeader";

type AuditEntry = {
  id: string;
  action: string;
  actor_type: "user" | "system" | "mcp";
  target_type: string | null;
  occurred_at: string;
  metadata: Record<string, unknown>;
};

const FILTERS = [
  { k: "all", l: "All" },
  { k: "user", l: "User" },
  { k: "system", l: "System" },
  { k: "mcp", l: "MCP" },
] as const;

function fmtTime(date: string) {
  return new Date(date).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function fmtDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function actorColor(kind: string) {
  if (kind === "user") return "var(--brand-strong)";
  if (kind === "mcp") return "var(--foreground)";
  return "var(--ink-secondary)";
}

export default function AuditPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [filter, setFilter] = useState<string>("all");

  const load = useCallback(async () => {
    const sb = createClient();
    const { data } = await sb
      .from("audit_log")
      .select("id,action,actor_type,target_type,occurred_at,metadata")
      .order("occurred_at", { ascending: false })
      .limit(100);
    setEntries((data ?? []) as AuditEntry[]);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const filtered = filter === "all" ? entries : entries.filter((e) => e.actor_type === filter);

  const systemCount = entries.filter((e) => e.actor_type === "system").length;
  const userCount = entries.filter((e) => e.actor_type === "user").length;
  const mcpCount = entries.filter((e) => e.actor_type === "mcp").length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Compliance · Audit"
        title="Audit Trail"
        subtitle="Every mutation, every actor, every timestamp. Immutable and queryable. SOC 2 stream, 7-year retention."
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
          { label: "EVENTS · 24H", value: entries.length.toString(), sub: "past day window" },
          { label: "SYSTEM", value: systemCount.toString(), sub: "automated mutations" },
          { label: "USER", value: userCount.toString(), sub: "operator actions" },
          { label: "MCP", value: mcpCount.toString(), sub: "agent queries", accent: true },
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
                color: s.accent ? "var(--brand)" : "var(--foreground)",
              }}
            >
              {s.value}
            </div>
            <div className="mono" style={{ fontSize: 11, color: "var(--ink-tertiary)", marginTop: 6 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: 8 }}>
        {FILTERS.map(({ k, l }) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className="mono"
            style={{
              fontSize: 10.5,
              letterSpacing: "0.08em",
              padding: "6px 12px",
              border: `1px solid ${filter === k ? "var(--brand)" : "var(--rule)"}`,
              background: filter === k ? "color-mix(in oklch, var(--brand) 12%, transparent)" : "transparent",
              color: filter === k ? "var(--brand)" : "var(--ink-secondary)",
              cursor: "pointer",
            }}
          >
            {l}
          </button>
        ))}
        <span className="mono" style={{ fontSize: 11, color: "var(--ink-tertiary)", marginLeft: "auto", alignSelf: "center" }}>
          {filtered.length} of {entries.length}
        </span>
      </div>

      {/* Log table */}
      <div style={{ border: "1px solid var(--rule)", background: "var(--card)", fontFamily: "var(--font-mono)" }}>
        <div
          className="mono"
          style={{
            display: "grid",
            gridTemplateColumns: "90px 70px 80px 200px 1fr 80px",
            padding: "10px 18px",
            borderBottom: "1px solid var(--rule)",
            fontSize: 10,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--ink-tertiary)",
            columnGap: 16,
          }}
        >
          <span>Date</span>
          <span>Time</span>
          <span>Actor</span>
          <span>Action</span>
          <span>Target</span>
          <span>Kind</span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: "32px 18px", color: "var(--ink-tertiary)", fontSize: 13 }}>
            No entries.
          </div>
        ) : (
          filtered.map((a, i) => (
            <div
              key={a.id}
              className="row-hover"
              style={{
                display: "grid",
                gridTemplateColumns: "90px 70px 80px 200px 1fr 80px",
                padding: "9px 18px",
                alignItems: "center",
                borderTop: i === 0 ? "none" : "1px solid var(--rule-soft)",
                fontSize: 11.5,
                columnGap: 16,
              }}
            >
              <span className="tnum" style={{ color: "var(--ink-tertiary)" }}>{fmtDate(a.occurred_at)}</span>
              <span className="tnum" style={{ color: "var(--ink-tertiary)" }}>{fmtTime(a.occurred_at)}</span>
              <span style={{ color: actorColor(a.actor_type), textTransform: "uppercase", fontSize: 10.5, letterSpacing: "0.06em" }}>
                {a.actor_type}
              </span>
              <span style={{ color: "var(--foreground)" }}>{a.action.replace(/_/g, " ")}</span>
              <span
                style={{
                  color: "var(--ink-secondary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {a.target_type ?? "—"}
              </span>
              <span>
                <span className={`pill ${a.actor_type === "mcp" ? "pill-accent" : a.actor_type === "user" ? "pill-neutral" : "pill-proto"}`}>
                  {a.actor_type}
                </span>
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
