"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shell/PageHeader";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { CalendarGrid } from "@/components/compliance/CalendarGrid";
import {
  ConflictPanel,
  type ConflictRow,
} from "@/components/compliance/ConflictPanel";
import { McpQueryInput } from "@/components/compliance/McpQueryInput";

type Country = {
  id: string;
  iso_code: string;
  name: string;
  flag_emoji: string | null;
};

export default function CalendarPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [holidays, setHolidays] = useState<
    { country_id: string; holiday_date: string; name: string }[]
  >([]);
  const [cycles, setCycles] = useState<
    {
      country_id: string;
      cutoff_at: string;
      scheduled_pay_at: string;
      status: string;
    }[]
  >([]);
  const [conflicts, setConflicts] = useState<ConflictRow[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const anchor = (() => {
    const d = new Date();
    // snap to Monday of current week
    const dow = d.getUTCDay();
    const offset = dow === 0 ? -6 : 1 - dow;
    d.setUTCDate(d.getUTCDate() + offset);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  })();

  const horizonEnd = new Date(anchor);
  horizonEnd.setUTCDate(horizonEnd.getUTCDate() + 7 * 12);

  const load = useCallback(async () => {
    const sb = createClient();
    const [cResp, hResp, cyResp, confResp] = await Promise.all([
      sb.from("countries").select("id,iso_code,name,flag_emoji").order("name"),
      sb
        .from("public_holidays")
        .select("country_id,holiday_date,name")
        .gte("holiday_date", anchor.toISOString().slice(0, 10))
        .lte("holiday_date", horizonEnd.toISOString().slice(0, 10)),
      sb
        .from("payroll_cycles")
        .select("country_id,cutoff_at,scheduled_pay_at,status")
        .gte("cutoff_at", anchor.toISOString())
        .lte("cutoff_at", horizonEnd.toISOString()),
      sb
        .from("calendar_conflicts")
        .select(
          "id,conflict_date,conflict_type,severity,suggested_shift_date,explanation,resolved_at,countries(iso_code,name,flag_emoji)",
        )
        .order("conflict_date"),
    ]);
    setCountries((cResp.data ?? []) as Country[]);
    setHolidays(hResp.data ?? []);
    setCycles(cyResp.data ?? []);
    const raw = (confResp.data ?? []) as unknown as Array<
      Omit<ConflictRow, "countries"> & { countries: unknown }
    >;
    const flat: ConflictRow[] = raw.map((r) => ({
      ...r,
      countries: Array.isArray(r.countries) ? r.countries[0] ?? null : (r.countries as ConflictRow["countries"]),
    }));
    setConflicts(flat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function refresh() {
    setRefreshing(true);
    try {
      const res = await fetch("/api/calendar/refresh", { method: "POST" });
      if (res.ok) {
        toast.success("Sentinel rescanned");
        await load();
      } else {
        toast.warning(
          "Sentinel service offline — showing cached conflicts",
        );
      }
    } catch {
      toast.warning("Sentinel service offline — showing cached conflicts");
    } finally {
      setRefreshing(false);
    }
  }

  async function resolve(id: string) {
    const sb = createClient();
    await sb
      .from("calendar_conflicts")
      .update({ resolved_at: new Date().toISOString() })
      .eq("id", id);
    toast.success("Conflict resolved");
    await load();
  }

  const crit = conflicts.filter(
    (c) => c.severity === "crit" && !c.resolved_at,
  ).length;
  const openCount = conflicts.filter((c) => !c.resolved_at).length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Compliance · Calendar"
        title="Calendar Sentinel"
        subtitle="Cross-references every country's cutoff against public holidays, weekend rules, and approver availability — across 12 weeks. Exposed as an MCP server so Claude can answer date questions directly."
        status="live"
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={refresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={`h-3.5 w-3.5 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Rescanning…" : "Rescan horizon"}
          </Button>
        }
      />

      {/* Metric strip */}
      <div className="grid grid-cols-4 gap-4 rounded-sm border border-[color:var(--rule)] bg-card p-5">
        <Metric label="Countries monitored" value={countries.length.toString()} />
        <Metric label="Horizon" value="12 weeks" />
        <Metric
          label="Open conflicts"
          value={openCount.toString()}
          emphasis={openCount > 0 ? "warn" : "ok"}
        />
        <Metric
          label="Critical"
          value={crit.toString()}
          emphasis={crit > 0 ? "crit" : "ok"}
        />
      </div>

      {/* Grid */}
      <CalendarGrid
        countries={countries}
        holidays={holidays}
        cycles={cycles}
        conflicts={conflicts.map((c) => ({
          country_id:
            countries.find((cc) => cc.iso_code === c.countries?.iso_code)?.id ??
            "",
          conflict_date: c.conflict_date,
          severity: c.severity,
          conflict_type: c.conflict_type,
        }))}
        anchor={anchor}
      />

      {/* Conflicts + MCP console */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-4">
        <ConflictPanel conflicts={conflicts} onResolve={resolve} />
        <McpQueryInput />
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: "ok" | "warn" | "crit";
}) {
  const color =
    emphasis === "ok"
      ? "var(--status-ok)"
      : emphasis === "warn"
        ? "var(--status-warn)"
        : emphasis === "crit"
          ? "var(--status-crit)"
          : undefined;
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <p
        className="font-mono text-2xl tabular-nums mt-1"
        style={color ? { color } : undefined}
      >
        {value}
      </p>
    </div>
  );
}
