"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Terminal } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/formatters";

type Answer =
  | { kind: "none" }
  | { kind: "error"; text: string }
  | { kind: "date"; date: string; weekend: boolean; holiday: string | null; countryIso: string }
  | { kind: "conflicts"; count: number; rows: { date: string; type: string; name: string }[] };

/**
 * Mini MCP-client input. Supports: `check 2026-04-27 ZA` and `list-conflicts`.
 * Hits Supabase directly (read-only) for the prototype — in production these
 * would call the Python MCP server's `check_date` / `list_conflicts` tools.
 */
export function McpQueryInput() {
  const [value, setValue] = useState("check 2026-04-27 ZA");
  const [answer, setAnswer] = useState<Answer>({ kind: "none" });
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    try {
      const sb = createClient();
      const tokens = value.trim().split(/\s+/);
      const cmd = tokens[0]?.toLowerCase();

      if (cmd === "check" && tokens[1] && tokens[2]) {
        const date = tokens[1];
        const iso = tokens[2].toUpperCase();
        const { data: country } = await sb
          .from("countries")
          .select("id,iso_code")
          .eq("iso_code", iso)
          .maybeSingle();
        if (!country) {
          setAnswer({ kind: "error", text: `Unknown country ${iso}` });
          return;
        }
        const dow = new Date(date).getUTCDay();
        const weekend = dow === 0 || dow === 6;
        const { data: holidays } = await sb
          .from("public_holidays")
          .select("name")
          .eq("country_id", country.id)
          .eq("holiday_date", date)
          .limit(1);
        setAnswer({
          kind: "date",
          date,
          weekend,
          holiday: holidays?.[0]?.name ?? null,
          countryIso: iso,
        });
      } else if (cmd === "list-conflicts" || cmd === "list") {
        const { data } = await sb
          .from("calendar_conflicts")
          .select("conflict_date,conflict_type,countries(name)")
          .is("resolved_at", null)
          .order("conflict_date");
        const rows = (data ?? []).map((r) => {
          const c = Array.isArray(r.countries) ? r.countries[0] : r.countries;
          return {
            date: r.conflict_date,
            type: r.conflict_type,
            name: (c as { name?: string } | null)?.name ?? "—",
          };
        });
        setAnswer({ kind: "conflicts", count: rows.length, rows });
      } else {
        setAnswer({
          kind: "error",
          text: "Commands: `check YYYY-MM-DD ISO`, `list-conflicts`",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-sm border border-[color:var(--rule)] bg-card p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Terminal
          className="h-3.5 w-3.5 text-[color:var(--brand)]"
          aria-hidden
        />
        <p className="eyebrow">MCP tool console</p>
        <span className="ml-auto font-mono text-[10px] text-[color:var(--ink-tertiary)]">
          mcp://calendar-sentinel
        </span>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void run();
        }}
        className="flex gap-2"
      >
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="check 2026-04-27 ZA"
          className="font-mono text-sm"
        />
        <Button
          type="submit"
          size="sm"
          disabled={loading}
          className="bg-[color:var(--brand)] hover:bg-[color:var(--brand-hover)] text-[color:var(--primary-foreground)]"
        >
          {loading ? "Running…" : "Run tool"}
        </Button>
      </form>

      <div className="font-mono text-[11px] text-[color:var(--ink-tertiary)] bg-[color:var(--accent)]/40 rounded-sm px-3 py-2.5 min-h-[80px]">
        {answer.kind === "none" ? (
          <p className="opacity-70">
            Try: <span className="text-[color:var(--brand)]">check 2026-04-27 ZA</span>{" "}
            or <span className="text-[color:var(--brand)]">list-conflicts</span>
          </p>
        ) : answer.kind === "error" ? (
          <p className="text-[color:var(--status-warn)]">{answer.text}</p>
        ) : answer.kind === "date" ? (
          <div className="space-y-1 text-[color:var(--ink-primary)]">
            <p>
              <span className="opacity-60">$ check</span>{" "}
              {formatDate(answer.date, "medium")}{" "}
              <span className="opacity-60">{answer.countryIso}</span>
            </p>
            <p>
              → weekend:{" "}
              <span
                style={{
                  color: answer.weekend
                    ? "var(--status-warn)"
                    : "var(--status-ok)",
                }}
              >
                {answer.weekend ? "yes" : "no"}
              </span>
            </p>
            <p>
              → holiday:{" "}
              <span
                style={{
                  color: answer.holiday
                    ? "var(--status-warn)"
                    : "var(--status-ok)",
                }}
              >
                {answer.holiday ?? "none"}
              </span>
            </p>
            <p>
              → business day:{" "}
              <span
                style={{
                  color:
                    !answer.weekend && !answer.holiday
                      ? "var(--status-ok)"
                      : "var(--status-warn)",
                }}
              >
                {!answer.weekend && !answer.holiday ? "yes" : "no"}
              </span>
            </p>
          </div>
        ) : (
          <div className="space-y-1 text-[color:var(--ink-primary)]">
            <p>
              <span className="opacity-60">$ list-conflicts</span> → {answer.count} open
            </p>
            {answer.rows.slice(0, 6).map((r, i) => (
              <p key={i}>
                · {formatDate(r.date, "short")} — {r.name} —{" "}
                <span className="opacity-60">{r.type}</span>
              </p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
