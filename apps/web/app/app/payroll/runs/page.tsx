import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shell/PageHeader";
import { StatusTag } from "@/components/shell/StatusTag";
import { formatCompactCurrency, formatDate } from "@/lib/formatters";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RunsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("payroll_runs")
    .select(
      "id,run_type,run_date,status,payroll_cycles(cycle_month,total_gross_amount,employee_count,countries(iso_code,name,currency,flag_emoji))",
    )
    .order("run_date", { ascending: false })
    .limit(60);

  type RunRow = {
    id: string;
    run_type: "regular" | "off_cycle";
    run_date: string;
    status: string;
    payroll_cycles: {
      cycle_month: string;
      total_gross_amount: number | null;
      employee_count: number | null;
      countries: {
        iso_code: string;
        name: string;
        currency: string;
        flag_emoji: string | null;
      } | null;
    } | null;
  };

  const rows: RunRow[] = (data ?? []).map((r) => {
    const cycle = Array.isArray(r.payroll_cycles)
      ? r.payroll_cycles[0]
      : r.payroll_cycles;
    if (cycle && typeof cycle === "object") {
      const c = cycle as Record<string, unknown>;
      const country = Array.isArray(c.countries) ? c.countries[0] : c.countries;
      c.countries = country ?? null;
    }
    return { ...r, payroll_cycles: cycle } as unknown as RunRow;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operations · Runs"
        title="Payroll runs"
        subtitle="Every regular and off-cycle run, reverse-chronological. Click a row for the employee-by-employee breakdown."
      />

      <div className="rounded-sm border border-[color:var(--rule)] bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[color:var(--rule)] bg-[color:var(--accent)]/40">
              <th className="text-left eyebrow px-4 py-3">Date</th>
              <th className="text-left eyebrow px-4 py-3">Country</th>
              <th className="text-left eyebrow px-4 py-3">Type</th>
              <th className="text-right eyebrow px-4 py-3">Employees</th>
              <th className="text-right eyebrow px-4 py-3">Gross</th>
              <th className="text-left eyebrow px-4 py-3">Status</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                className="border-b border-[color:var(--rule)] last:border-b-0 hover:bg-[color:var(--accent)]/40 transition-colors"
              >
                <td className="px-4 py-3 font-mono text-xs tabular-nums text-[color:var(--ink-tertiary)]">
                  {formatDate(r.run_date, "medium")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">
                      {r.payroll_cycles?.countries?.flag_emoji}
                    </span>
                    <span className="text-sm">
                      {r.payroll_cycles?.countries?.name ?? "—"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--ink-tertiary)]">
                    {r.run_type.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono tabular-nums text-right text-sm">
                  {r.payroll_cycles?.employee_count ?? "—"}
                </td>
                <td className="px-4 py-3 font-mono tabular-nums text-right text-sm">
                  {r.payroll_cycles?.total_gross_amount
                    ? formatCompactCurrency(
                        r.payroll_cycles.total_gross_amount,
                        r.payroll_cycles.countries?.currency ?? "USD",
                      )
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <StatusTag
                    status={r.status === "approved" ? "live" : "prototype"}
                  />
                  <span className="ml-2 font-mono text-[10px] text-[color:var(--ink-tertiary)] uppercase tracking-wider">
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/app/payroll/runs/${r.id}`}
                    className="text-[color:var(--brand)] hover:opacity-70 transition-opacity"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rows.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-muted-foreground">No runs yet.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
