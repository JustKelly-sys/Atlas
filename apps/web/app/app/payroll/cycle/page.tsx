import { CountryFlag } from "@/components/ui/CountryFlag";
import { createServiceRoleClient as createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shell/PageHeader";
import { CycleGantt } from "@/components/payroll/CycleGantt";
import { formatCountdown, formatDate, formatCompactCurrency } from "@/lib/formatters";
import { StatusTag } from "@/components/shell/StatusTag";

export const dynamic = "force-dynamic";

export default async function CyclePage() {
  const supabase = await createClient();

  const { data: cycles } = await supabase
    .from("payroll_cycles")
    .select(
      "id,country_id,cycle_month,cutoff_at,scheduled_pay_at,status,total_gross_amount,employee_count,countries(iso_code,name,currency,flag_emoji,timezone)",
    )
    .in("status", ["inputs_open", "cutoff", "posting", "reconciling"])
    .order("cutoff_at");

  type Cycle = {
    id: string;
    country_id: string;
    cycle_month: string;
    cutoff_at: string;
    scheduled_pay_at: string;
    status: string;
    total_gross_amount: number | null;
    employee_count: number | null;
    countries: {
      iso_code: string;
      name: string;
      currency: string;
      flag_emoji: string | null;
      timezone: string | null;
    } | null;
  };

  const flat: Cycle[] = (cycles ?? []).map((c) => {
    const country = Array.isArray(c.countries) ? c.countries[0] : c.countries;
    return { ...c, countries: (country ?? null) as Cycle["countries"] };
  });

  // Aggregate current status across all open cycles — pick the earliest stage
  const stageOrder = [
    "inputs_open",
    "cutoff",
    "posting",
    "reconciling",
    "approved",
    "paid",
    "closed",
  ];
  const earliestStage =
    flat
      .map((c) => c.status)
      .sort(
        (a, b) => stageOrder.indexOf(a) - stageOrder.indexOf(b),
      )[0] ?? "inputs_open";

  const totalEmployees = flat.reduce((s, c) => s + (c.employee_count ?? 0), 0);
  const totalGross = flat.reduce(
    (s, c) => s + Number(c.total_gross_amount ?? 0),
    0,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operations · Cycle"
        title="Payroll cycle — April 2026"
        subtitle="Live view of every country's position in the 7-stage cycle, with timezone-aware cutoffs and the earliest global stage highlighted."
      />

      {/* Metric strip */}
      <div className="grid grid-cols-4 gap-4 rounded-sm border border-[color:var(--rule)] bg-card p-5">
        <Metric label="Countries open" value={flat.length.toString()} />
        <Metric label="Employees in cycle" value={totalEmployees.toString()} />
        <Metric
          label="Gross this cycle"
          value={formatCompactCurrency(totalGross, "USD")}
        />
        <Metric
          label="Next cutoff"
          value={flat[0] ? formatCountdown(flat[0].cutoff_at) : "—"}
          emphasis="warn"
        />
      </div>

      <CycleGantt currentStatus={earliestStage} />

      {/* Per-country cutoff grid */}
      <section className="rounded-sm border border-[color:var(--rule)] bg-card overflow-hidden">
        <header className="px-5 py-4 border-b border-[color:var(--rule)]">
          <p className="eyebrow">Country cutoffs · timezone-aware</p>
          <p className="font-mono text-[11px] text-[color:var(--ink-tertiary)] mt-0.5">
            Local cutoff time is what the ops owner actually operates against.
          </p>
        </header>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[color:var(--rule)] bg-[color:var(--accent)]/40">
              <th className="text-left eyebrow px-4 py-3">Country</th>
              <th className="text-left eyebrow px-4 py-3">Stage</th>
              <th className="text-right eyebrow px-4 py-3">Employees</th>
              <th className="text-right eyebrow px-4 py-3">Gross</th>
              <th className="text-right eyebrow px-4 py-3">Cutoff (UTC)</th>
              <th className="text-right eyebrow px-4 py-3">Countdown</th>
            </tr>
          </thead>
          <tbody>
            {flat.map((c) => (
              <tr
                key={c.id}
                className="border-b border-[color:var(--rule)] last:border-b-0"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {c.countries?.iso_code && <CountryFlag isoCode={c.countries.iso_code} size={16} />}
                    <span className="text-sm">{c.countries?.name}</span>
                    <span className="font-mono text-[10px] text-[color:var(--ink-tertiary)]">
                      {c.countries?.timezone ?? c.countries?.iso_code}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusTag
                    status={c.status === "inputs_open" ? "live" : "prototype"}
                  />
                  <span className="ml-2 font-mono text-[10px] text-[color:var(--ink-tertiary)] uppercase tracking-wider">
                    {c.status.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono tabular-nums text-right text-sm">
                  {c.employee_count ?? "—"}
                </td>
                <td className="px-4 py-3 font-mono tabular-nums text-right text-sm">
                  {c.total_gross_amount
                    ? formatCompactCurrency(
                        c.total_gross_amount,
                        c.countries?.currency ?? "USD",
                      )
                    : "—"}
                </td>
                <td className="px-4 py-3 font-mono tabular-nums text-right text-sm text-[color:var(--ink-tertiary)]">
                  {formatDate(c.cutoff_at, "short")}
                </td>
                <td className="px-4 py-3 font-mono tabular-nums text-right text-sm text-[color:var(--brand)]">
                  {formatCountdown(c.cutoff_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
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
  emphasis?: "warn" | "ok" | "crit";
}) {
  const color =
    emphasis === "warn"
      ? "var(--status-warn)"
      : emphasis === "crit"
        ? "var(--status-crit)"
        : emphasis === "ok"
          ? "var(--status-ok)"
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
