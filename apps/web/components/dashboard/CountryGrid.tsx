import Link from "next/link";
import { formatCompactCurrency, formatCountdown } from "@/lib/formatters";
import { StatusTag } from "@/components/shell/StatusTag";

type Country = {
  id: string;
  iso_code: string;
  name: string;
  currency: string;
  flag_emoji: string | null;
};

type CycleSummary = {
  country_id: string;
  total_gross_amount: number | null;
  employee_count: number | null;
  cutoff_at: string;
};

export function CountryGrid({
  countries,
  currentCycles,
}: {
  countries: Country[];
  currentCycles: CycleSummary[];
}) {
  const cycleByCountry = new Map(
    currentCycles.map((c) => [c.country_id, c]),
  );

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <p className="eyebrow">Countries</p>
        <p className="text-[11px] text-muted-foreground font-mono">
          {countries.length} active
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {countries.map((country) => {
          const cycle = cycleByCountry.get(country.id);
          return (
            <div
              key={country.id}
              className="rounded-sm border border-[color:var(--rule)] bg-card p-5 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl leading-none">
                    {country.flag_emoji}
                  </span>
                  <div>
                    <p className="font-display text-lg leading-tight tracking-[-0.01em]">
                      {country.name}
                    </p>
                    <p className="eyebrow text-[9px]">{country.iso_code}</p>
                  </div>
                </div>
                <StatusTag status="live" />
              </div>

              <dl className="space-y-1.5 text-sm">
                <div className="flex items-baseline justify-between">
                  <dt className="text-xs text-muted-foreground">Employees</dt>
                  <dd className="font-mono tabular-nums">
                    {cycle?.employee_count ?? "—"}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between">
                  <dt className="text-xs text-muted-foreground">Gross</dt>
                  <dd className="font-mono tabular-nums">
                    {cycle?.total_gross_amount
                      ? formatCompactCurrency(
                          cycle.total_gross_amount,
                          country.currency,
                        )
                      : "—"}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between">
                  <dt className="text-xs text-muted-foreground">Next cutoff</dt>
                  <dd className="font-mono tabular-nums text-[color:var(--ink-primary)]">
                    {cycle ? formatCountdown(cycle.cutoff_at) : "—"}
                  </dd>
                </div>
              </dl>
            </div>
          );
        })}
      </div>
    </section>
  );
}
