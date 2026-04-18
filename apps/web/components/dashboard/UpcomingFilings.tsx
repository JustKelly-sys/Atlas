import Link from "next/link";
import { formatDate, daysUntil } from "@/lib/formatters";

type Filing = {
  id: string;
  form_code: string;
  due_date: string;
  status: string;
  countries: { iso_code: string; name: string; flag_emoji: string | null } | null;
};

function urgencyStyle(days: number | null) {
  if (days === null) return { label: "—", color: "var(--ink-tertiary)" };
  if (days < 0) return { label: "overdue", color: "var(--status-crit)" };
  if (days <= 3) return { label: `in ${days}d`, color: "var(--status-crit)" };
  if (days <= 14) return { label: `in ${days}d`, color: "var(--status-warn)" };
  return { label: `in ${days}d`, color: "var(--ink-secondary)" };
}

export function UpcomingFilings({ filings }: { filings: Filing[] }) {
  return (
    <section className="rounded-sm border border-[color:var(--rule)] bg-card p-6 space-y-4 h-full flex flex-col">
      <header className="flex items-center justify-between">
        <p className="eyebrow">Upcoming filings</p>
        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
          {filings.length} open
        </span>
      </header>

      {filings.length === 0 ? (
        <p className="text-sm text-muted-foreground flex-1 flex items-center">
          No filings in the next window.
        </p>
      ) : (
        <ul className="divide-y divide-[color:var(--rule)] flex-1">
          {filings.slice(0, 6).map((f) => {
            const days = daysUntil(f.due_date);
            const u = urgencyStyle(days);
            return (
              <li key={f.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-lg leading-none shrink-0">
                    {f.countries?.flag_emoji}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm leading-tight font-mono">
                      {f.form_code}
                    </p>
                    <p className="text-[11px] text-[color:var(--ink-tertiary)] tabular-nums">
                      {formatDate(f.due_date, "long")} · {f.status.replace(/_/g, " ")}
                    </p>
                  </div>
                </div>
                <span
                  className="font-mono text-xs tabular-nums shrink-0"
                  style={{ color: u.color }}
                >
                  {u.label}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      <Link
        href="/app/compliance/filings"
        className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 decoration-[color:var(--rule)] hover:decoration-[color:var(--brand)]"
      >
        Full filings calendar →
      </Link>
    </section>
  );
}
