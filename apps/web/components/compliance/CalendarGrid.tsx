"use client";

import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/formatters";

type Holiday = {
  country_id: string;
  holiday_date: string;
  name: string;
};

type Cycle = {
  country_id: string;
  cutoff_at: string;
  scheduled_pay_at: string;
  status: string;
};

type Conflict = {
  country_id: string;
  conflict_date: string;
  severity: "info" | "warn" | "crit";
  conflict_type: string;
};

type Country = {
  id: string;
  iso_code: string;
  name: string;
  flag_emoji: string | null;
};

/**
 * 12-week horizontal calendar. Columns = weeks, rows = countries.
 * Cell colour indicates: normal / holiday / cutoff / conflict.
 */
export function CalendarGrid({
  countries,
  holidays,
  cycles,
  conflicts,
  anchor,
}: {
  countries: Country[];
  holidays: Holiday[];
  cycles: Cycle[];
  conflicts: Conflict[];
  anchor: Date;
}) {
  const weeks = Array.from({ length: 12 }, (_, i) => {
    const start = new Date(anchor);
    start.setDate(start.getDate() + i * 7);
    return start;
  });

  return (
    <div className="rounded-sm border border-[color:var(--rule)] bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--rule)]">
              <th className="sticky left-0 bg-card text-left eyebrow px-4 py-3 min-w-[180px]">
                Country
              </th>
              {weeks.map((w, i) => (
                <th
                  key={i}
                  className="eyebrow px-2 py-3 min-w-[60px] font-mono text-[10px]"
                >
                  {formatDate(w, "short")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {countries.map((country) => (
              <tr
                key={country.id}
                className="border-b border-[color:var(--rule)] last:border-b-0"
              >
                <td className="sticky left-0 bg-card px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none">
                      {country.flag_emoji}
                    </span>
                    <span className="text-sm">{country.name}</span>
                    <span className="font-mono text-[10px] text-[color:var(--ink-tertiary)]">
                      {country.iso_code}
                    </span>
                  </div>
                </td>
                {weeks.map((w, i) => {
                  const weekEnd = new Date(w);
                  weekEnd.setDate(weekEnd.getDate() + 6);
                  const tip: string[] = [];

                  const inWeek = (d: string) => {
                    const dd = new Date(d);
                    return dd >= w && dd <= weekEnd;
                  };

                  const countryHolidays = holidays.filter(
                    (h) => h.country_id === country.id && inWeek(h.holiday_date),
                  );
                  const countryCycles = cycles.filter(
                    (c) => c.country_id === country.id && inWeek(c.cutoff_at),
                  );
                  const countryConflicts = conflicts.filter(
                    (c) =>
                      c.country_id === country.id && inWeek(c.conflict_date),
                  );

                  countryHolidays.forEach((h) => tip.push(`🎌 ${h.name}`));
                  countryCycles.forEach(() => tip.push(`✂ Cutoff this week`));
                  countryConflicts.forEach((c) =>
                    tip.push(`⚠ ${c.conflict_type.replace(/_/g, " ")}`),
                  );

                  const severity =
                    countryConflicts.reduce<"info" | "warn" | "crit" | null>(
                      (max, c) => {
                        if (c.severity === "crit") return "crit";
                        if (c.severity === "warn" && max !== "crit")
                          return "warn";
                        if (!max) return c.severity;
                        return max;
                      },
                      null,
                    );

                  const hasHoliday = countryHolidays.length > 0;
                  const hasCutoff = countryCycles.length > 0;

                  return (
                    <td key={i} className="px-1 py-2 align-middle">
                      <div
                        title={tip.join("\n") || undefined}
                        className={cn(
                          "h-8 rounded-sm flex items-center justify-center gap-0.5 transition-colors",
                          severity === "crit" &&
                            "bg-[color:var(--status-crit)]/15 border border-[color:var(--status-crit)]",
                          severity === "warn" &&
                            "bg-[color:var(--status-warn)]/15 border border-[color:var(--status-warn)]",
                          severity === "info" &&
                            "bg-[color:var(--status-info)]/15 border border-[color:var(--status-info)]",
                          !severity &&
                            hasCutoff &&
                            "bg-[color:var(--brand)]/10 border border-[color:var(--brand)]/40",
                          !severity &&
                            !hasCutoff &&
                            hasHoliday &&
                            "bg-[color:var(--accent)]",
                          !severity &&
                            !hasCutoff &&
                            !hasHoliday &&
                            "bg-transparent",
                        )}
                      >
                        {hasHoliday ? (
                          <span className="text-[9px]">🎌</span>
                        ) : null}
                        {hasCutoff ? (
                          <span
                            className="text-[10px] font-mono font-semibold"
                            style={{ color: "var(--brand)" }}
                          >
                            ✂
                          </span>
                        ) : null}
                        {severity ? (
                          <span className="text-[9px]">⚠</span>
                        ) : null}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 border-t border-[color:var(--rule)] bg-[color:var(--accent)]/20 flex flex-wrap items-center gap-4 text-[10px] font-mono text-[color:var(--ink-tertiary)]">
        <Legend color="var(--brand)" label="Cutoff" />
        <Legend color="var(--accent)" label="Holiday" solid />
        <Legend color="var(--status-info)" label="Info" />
        <Legend color="var(--status-warn)" label="Warn" />
        <Legend color="var(--status-crit)" label="Conflict" />
      </div>
    </div>
  );
}

function Legend({
  color,
  label,
  solid,
}: {
  color: string;
  label: string;
  solid?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="h-3 w-3 rounded-sm"
        style={
          solid
            ? { background: color }
            : { background: `color-mix(in srgb, ${color} 15%, transparent)`, border: `1px solid ${color}` }
        }
      />
      <span className="uppercase tracking-wider">{label}</span>
    </div>
  );
}
