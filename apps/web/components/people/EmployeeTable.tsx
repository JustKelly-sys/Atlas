"use client";

import { CountryFlag } from "@/components/ui/CountryFlag";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export type EmployeeRow = {
  id: string;
  full_name: string;
  email: string;
  role_title: string;
  start_date: string;
  termination_date: string | null;
  employment_type: "employee" | "contractor";
  monthly_gross_amount: number;
  monthly_gross_currency: string;
  status: "active" | "terminated" | "on_leave";
  pay_schedule: string;
  bank_iban_masked: string | null;
  tax_id_masked: string | null;
  countries: {
    iso_code: string;
    name: string;
    flag_emoji: string | null;
  } | null;
};

const STATUS_STYLE = {
  active: { color: "var(--status-ok)", label: "Active" },
  terminated: { color: "var(--status-crit)", label: "Terminated" },
  on_leave: { color: "var(--status-warn)", label: "On leave" },
} as const;

export function EmployeeTable({ rows }: { rows: EmployeeRow[] }) {
  const [selected, setSelected] = useState<EmployeeRow | null>(null);

  return (
    <>
      <div className="rounded-sm border border-[color:var(--rule)] bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[color:var(--rule)] bg-[color:var(--accent)]/40">
              <th className="text-left eyebrow px-4 py-3">Name</th>
              <th className="text-left eyebrow px-4 py-3">Country</th>
              <th className="text-left eyebrow px-4 py-3">Role</th>
              <th className="text-left eyebrow px-4 py-3">Type</th>
              <th className="text-right eyebrow px-4 py-3">Start date</th>
              <th className="text-right eyebrow px-4 py-3">Monthly gross</th>
              <th className="text-left eyebrow px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => {
              const status = STATUS_STYLE[e.status];
              return (
                <tr
                  key={e.id}
                  onClick={() => setSelected(e)}
                  className="border-b border-[color:var(--rule)] cursor-pointer hover:bg-[color:var(--accent)]/40 transition-colors"
                >
                  <td className="px-4 py-3">
                    <p
                      className="text-sm"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {e.full_name}
                    </p>
                    <p className="font-mono text-[10px] text-[color:var(--ink-tertiary)]">
                      {e.email}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {e.countries?.iso_code && <CountryFlag isoCode={e.countries.iso_code} size={14} />}
                      <span className="text-sm">
                        {e.countries?.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{e.role_title}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "font-mono text-[10px] uppercase tracking-wider",
                        e.employment_type === "contractor"
                          ? "text-[color:var(--status-info)]"
                          : "text-[color:var(--ink-tertiary)]",
                      )}
                    >
                      {e.employment_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs tabular-nums text-right text-[color:var(--ink-tertiary)]">
                    {formatDate(e.start_date, "short")}
                  </td>
                  <td className="px-4 py-3 font-mono tabular-nums text-right text-sm">
                    {formatCurrency(
                      e.monthly_gross_amount,
                      e.monthly_gross_currency,
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] uppercase tracking-wider"
                      style={{ color: status.color, borderColor: status.color }}
                    >
                      {status.label}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {rows.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No employees match these filters.
            </p>
          </div>
        ) : null}
      </div>

      <Sheet
        open={selected !== null}
        onOpenChange={(o) => (o ? null : setSelected(null))}
      >
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
          {selected ? (
            <>
              <SheetHeader className="px-6 py-5 border-b border-[color:var(--rule)]">
                <div className="flex items-center gap-2 mb-1">
                  {selected.countries?.iso_code && <CountryFlag isoCode={selected.countries.iso_code} size={18} />}
                  <p className="eyebrow">{selected.countries?.name}</p>
                </div>
                <SheetTitle className="font-display text-2xl tracking-[-0.01em]">
                  {selected.full_name}
                </SheetTitle>
                <p className="font-mono text-xs text-[color:var(--ink-tertiary)] mt-1">
                  {selected.role_title} · {selected.email}
                </p>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                <Section label="Employment">
                  <Row label="Type" value={selected.employment_type} mono />
                  <Row label="Pay schedule" value={selected.pay_schedule} mono />
                  <Row
                    label="Start date"
                    value={formatDate(selected.start_date)}
                    mono
                  />
                  {selected.termination_date ? (
                    <Row
                      label="End date"
                      value={formatDate(selected.termination_date)}
                      mono
                    />
                  ) : null}
                </Section>

                <Section label="Compensation">
                  <Row
                    label="Monthly gross"
                    value={formatCurrency(
                      selected.monthly_gross_amount,
                      selected.monthly_gross_currency,
                    )}
                    mono
                  />
                  <Row label="Currency" value={selected.monthly_gross_currency} mono />
                </Section>

                <Section label="Payment">
                  <Row
                    label="IBAN"
                    value={selected.bank_iban_masked ?? "—"}
                    mono
                  />
                  <Row
                    label="Tax ID"
                    value={selected.tax_id_masked ?? "—"}
                    mono
                  />
                </Section>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <p className="eyebrow mb-3">{label}</p>
      <dl className="space-y-2 text-sm">{children}</dl>
    </section>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd
        className={
          mono
            ? "font-mono tabular-nums text-[color:var(--ink-primary)]"
            : "text-[color:var(--ink-primary)]"
        }
      >
        {value}
      </dd>
    </div>
  );
}
