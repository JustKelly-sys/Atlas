import { cookies } from "next/headers";
import { createServiceRoleClient as createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shell/PageHeader";
import { CycleStatusCard } from "@/components/dashboard/CycleStatusCard";
import { CriticalAlertsCard } from "@/components/dashboard/CriticalAlertsCard";
import { FiveStrip } from "@/components/dashboard/FiveStrip";
import { KpiStrip } from "@/components/dashboard/KpiStrip";
import { CountryGrid } from "@/components/dashboard/CountryGrid";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { UpcomingFilings } from "@/components/dashboard/UpcomingFilings";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const firstName = decodeURIComponent(cookieStore.get("atlas_name")?.value ?? "there");
  const supabase = await createClient();

  // Fetch everything in parallel — server component, so it all happens in one render
  const [
    currentCyclesResp,
    alertsResp,
    countriesResp,
    auditResp,
    filingsResp,
    inputsCountResp,
    fxLeakageResp,
    variancesCountResp,
    terminationsResp,
    calendarResp,
  ] = await Promise.all([
    supabase
      .from("payroll_cycles")
      .select(
        "id,country_id,total_gross_amount,employee_count,cutoff_at,countries(iso_code,name,currency,flag_emoji)",
      )
      .eq("status", "inputs_open")
      .order("cutoff_at"),
    supabase
      .from("alerts")
      .select("id,severity,title,body,link_url,created_at")
      .is("resolved_at", null)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("countries")
      .select("id,iso_code,name,currency,flag_emoji")
      .order("name"),
    supabase
      .from("audit_log")
      .select("id,action,actor_type,target_type,occurred_at,metadata")
      .order("occurred_at", { ascending: false })
      .limit(10),
    supabase
      .from("filings")
      .select("id,form_code,due_date,status,countries(iso_code,name,flag_emoji)")
      .in("status", ["not_started", "prepared"])
      .order("due_date")
      .limit(6),
    supabase
      .from("input_messages")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("fx_leakage")
      .select("cycle_leakage_amount,ytd_leakage_amount"),
    supabase
      .from("variances")
      .select("id", { count: "exact", head: true })
      .eq("flagged_for_review", true),
    supabase
      .from("terminations")
      .select("id,status,last_working_day")
      .eq("status", "in_progress"),
    supabase
      .from("calendar_conflicts")
      .select("id", { count: "exact", head: true })
      .is("resolved_at", null),
  ]);

  // Supabase returns joined relations as arrays even for single-row FKs.
  // Flatten them here so downstream components see an object.
  type WithArray<T> = Omit<T, "countries"> & { countries: unknown };
  const flatten = <T,>(row: WithArray<T>) => ({
    ...row,
    countries: Array.isArray((row as { countries: unknown }).countries)
      ? ((row as { countries: unknown[] }).countries[0] ?? null)
      : (row as { countries: unknown }).countries,
  }) as T;

  const currentCycles = (currentCyclesResp.data ?? []).map((c) => flatten<{
    id: string;
    country_id: string;
    total_gross_amount: number | null;
    employee_count: number | null;
    cutoff_at: string;
    countries: { iso_code: string; name: string; currency: string; flag_emoji: string | null };
  }>(c));
  const alerts = alertsResp.data ?? [];
  const countries = countriesResp.data ?? [];
  const audit = auditResp.data ?? [];
  const filings = (filingsResp.data ?? []).map((f) => flatten<{
    id: string;
    form_code: string;
    due_date: string;
    status: string;
    countries: { iso_code: string; name: string; flag_emoji: string | null } | null;
  }>(f));

  const pendingInputs = inputsCountResp.count ?? 0;
  const fxLeakage = fxLeakageResp.data ?? [];
  const fxTotalThisCycle = fxLeakage.reduce(
    (s, r) => s + Number(r.cycle_leakage_amount ?? 0),
    0,
  );
  const flaggedVariances = variancesCountResp.count ?? 0;
  const activeTerminations = terminationsResp.data ?? [];
  const calendarConflicts = calendarResp.count ?? 0;

  const fiveCards = [
    {
      eyebrow: "NP-01",
      name: "Input Parser",
      metric: pendingInputs.toString(),
      metricLabel: "pending parses",
      href: "/app/payroll/inputs",
      status: "live" as const,
    },
    {
      eyebrow: "NP-02",
      name: "FX Watchdog",
      metric: `$${fxTotalThisCycle.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
      metricLabel: "leakage this cycle",
      href: "/app/payroll/fx",
      status: "live" as const,
    },
    {
      eyebrow: "NP-06",
      name: "Variance Narrator",
      metric: flaggedVariances.toString(),
      metricLabel: "flagged for review",
      href: "/app/payroll/variance",
      status: "live" as const,
    },
    {
      eyebrow: "NP-20",
      name: "Termination Bot",
      metric: activeTerminations.length.toString(),
      metricLabel:
        activeTerminations.length > 0 ? "active — urgent" : "none active",
      href: "/app/people/terminations",
      status: "live" as const,
    },
    {
      eyebrow: "NP-19",
      name: "Calendar Sentinel",
      metric: calendarConflicts.toString(),
      metricLabel: "conflicts Q2",
      href: "/app/compliance/calendar",
      status: "live" as const,
    },
  ];

  const kpis = [
    {
      label: "Accuracy",
      value: "99.2%",
      delta: "0.4pt",
      deltaDirection: "up" as const,
    },
    {
      label: "On-time payment",
      value: "100%",
      delta: "target",
      deltaDirection: "flat" as const,
    },
    {
      label: "Cycle time",
      value: "2.8d",
      delta: "0.7d",
      deltaDirection: "down" as const,
    },
    {
      label: "Query response",
      value: "18h",
      delta: "4h",
      deltaDirection: "down" as const,
    },
    {
      label: "Filing success",
      value: "100%",
      delta: "target",
      deltaDirection: "flat" as const,
    },
  ];

  return (
    <div>
      {/* Hero block — greeting + primary ops status */}
      <PageHeader
        eyebrow="Operations · April 2026"
        title={`Good morning, ${firstName}.`}
        subtitle={`${currentCycles.length} ${currentCycles.length === 1 ? "country" : "countries"} open for input. Nearest cutoff in under 72 hours.`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 mt-8">
        <CycleStatusCard cycles={currentCycles} />
        <CriticalAlertsCard alerts={alerts} />
      </div>

      {/* Automation strip — tighter to the ops block above */}
      <div className="mt-8">
        <FiveStrip cards={fiveCards} />
      </div>

      {/* KPI strip — secondary, wider gap signals new section */}
      <div className="mt-14">
        <KpiStrip kpis={kpis} />
      </div>

      {/* Country overview */}
      <div className="mt-10">
        <CountryGrid countries={countries} currentCycles={currentCycles} />
      </div>

      {/* Activity + filings — widest gap, bottom of page */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-14">
        <ActivityFeed events={audit} />
        <UpcomingFilings filings={filings} />
      </div>
    </div>
  );
}
