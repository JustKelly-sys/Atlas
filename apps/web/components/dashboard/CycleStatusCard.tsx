import { formatCompactCurrency, formatCountdown } from "@/lib/formatters";

type Cycle = {
  id: string;
  cutoff_at: string;
  total_gross_amount: number | null;
  employee_count: number | null;
  countries: { iso_code: string; name: string; currency: string; flag_emoji: string | null };
};

export function CycleStatusCard({ cycles }: { cycles: Cycle[] }) {
  if (cycles.length === 0) {
    return (
      <div className="rounded-sm border border-[color:var(--rule)] bg-card p-6">
        <p className="eyebrow mb-2">This cycle</p>
        <p className="font-display text-2xl text-muted-foreground">
          No open cycles.
        </p>
      </div>
    );
  }

  // Aggregate across all open cycles, normalising to "USD-ish" total view.
  // For the demo we just show count + the nearest cutoff.
  const nearest = cycles.reduce((a, b) =>
    new Date(a.cutoff_at) < new Date(b.cutoff_at) ? a : b,
  );

  const totalEmployees = cycles.reduce(
    (sum, c) => sum + (c.employee_count ?? 0),
    0,
  );

  return (
    <div className="rounded-sm border border-[color:var(--rule)] bg-card p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="eyebrow mb-2">Active cycles</p>
          <p className="font-display text-5xl leading-none tracking-[-0.02em]">
            {cycles.length}
          </p>
          <p className="text-sm text-muted-foreground mt-2 tabular-nums">
            {totalEmployees} employees across {cycles.length}{" "}
            {cycles.length === 1 ? "country" : "countries"}
          </p>
        </div>
        <div className="text-right">
          <p className="eyebrow mb-2">Next cutoff</p>
          <p className="font-mono text-2xl leading-none">
            {formatCountdown(nearest.cutoff_at)}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {nearest.countries.flag_emoji} {nearest.countries.name}
          </p>
        </div>
      </div>

      {/* Country allocation bar */}
      <div className="space-y-2">
        <div className="flex h-1 w-full overflow-hidden rounded-sm">
          {cycles.map((c, i) => {
            const share = cycles.length
              ? (c.employee_count ?? 0) / Math.max(totalEmployees, 1)
              : 0;
            const colors = [
              "var(--chart-1)",
              "var(--chart-2)",
              "var(--chart-3)",
              "var(--chart-4)",
              "var(--chart-5)",
              "var(--brand)",
            ];
            return (
              <div
                key={c.id}
                style={{
                  width: `${share * 100}%`,
                  background: colors[i % colors.length],
                }}
                className="h-full"
              />
            );
          })}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground font-mono">
          {cycles.map((c) => (
            <span key={c.id}>
              {c.countries.iso_code} {c.employee_count ?? 0}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
