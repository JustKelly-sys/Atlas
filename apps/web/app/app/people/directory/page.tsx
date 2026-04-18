"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shell/PageHeader";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  EmployeeTable,
  type EmployeeRow,
} from "@/components/people/EmployeeTable";

type Country = { id: string; iso_code: string; name: string; flag_emoji: string | null };

export default function DirectoryPage() {
  const [rows, setRows] = useState<EmployeeRow[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(
    new Set(),
  );
  const [type, setType] = useState<"all" | "employee" | "contractor">("all");
  const [status, setStatus] = useState<"all" | "active" | "terminated" | "on_leave">(
    "active",
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    const sb = createClient();
    void (async () => {
      const [eResp, cResp] = await Promise.all([
        sb
          .from("employees")
          .select(
            "id,full_name,email,role_title,start_date,termination_date,employment_type,monthly_gross_amount,monthly_gross_currency,status,pay_schedule,bank_iban_masked,tax_id_masked,countries(iso_code,name,flag_emoji)",
          )
          .order("full_name"),
        sb.from("countries").select("id,iso_code,name,flag_emoji").order("name"),
      ]);
      const raw = (eResp.data ?? []) as unknown as Array<
        Omit<EmployeeRow, "countries"> & { countries: unknown }
      >;
      setRows(
        raw.map((r) => ({
          ...r,
          countries: Array.isArray(r.countries) ? r.countries[0] ?? null : (r.countries as EmployeeRow["countries"]),
        })),
      );
      setCountries((cResp.data ?? []) as Country[]);
    })();
  }, []);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (
        selectedCountries.size > 0 &&
        r.countries &&
        !selectedCountries.has(r.countries.iso_code)
      )
        return false;
      if (type !== "all" && r.employment_type !== type) return false;
      if (status !== "all" && r.status !== status) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !r.full_name.toLowerCase().includes(q) &&
          !r.role_title.toLowerCase().includes(q) &&
          !r.email.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [rows, selectedCountries, type, status, search]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="People · Directory"
        title="Global headcount"
        subtitle={`${rows.length} workers across ${countries.length} countries · source of truth for payroll, compliance, and termination workflows.`}
      />

      {/* Filters */}
      <div className="rounded-sm border border-[color:var(--rule)] bg-card p-5 space-y-4">
        <div className="flex items-center gap-3">
          <Search className="h-4 w-4 text-[color:var(--ink-tertiary)]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, role, or email…"
            className="max-w-md"
          />
          <span className="ml-auto font-mono text-[11px] text-[color:var(--ink-tertiary)] tabular-nums">
            {filtered.length} of {rows.length} shown
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="eyebrow mr-1">Country</p>
            {countries.map((c) => {
              const active = selectedCountries.has(c.iso_code);
              return (
                <button
                  key={c.iso_code}
                  type="button"
                  onClick={() => {
                    setSelectedCountries((prev) => {
                      const next = new Set(prev);
                      if (active) next.delete(c.iso_code);
                      else next.add(c.iso_code);
                      return next;
                    });
                  }}
                  className={
                    active
                      ? "px-2.5 h-7 rounded-sm border border-[color:var(--brand)] bg-[color:var(--brand)]/10 text-[color:var(--brand)] font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5"
                      : "px-2.5 h-7 rounded-sm border border-[color:var(--rule)] text-[color:var(--ink-tertiary)] font-mono text-[10px] uppercase tracking-wider hover:border-[color:var(--ink-tertiary)] flex items-center gap-1.5"
                  }
                >
                  <span>{c.flag_emoji}</span>
                  {c.iso_code}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <p className="eyebrow mr-1">Type</p>
            {(["all", "employee", "contractor"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={
                  type === t
                    ? "px-2.5 h-7 rounded-sm border border-[color:var(--brand)] bg-[color:var(--brand)]/10 text-[color:var(--brand)] font-mono text-[10px] uppercase tracking-wider"
                    : "px-2.5 h-7 rounded-sm border border-[color:var(--rule)] text-[color:var(--ink-tertiary)] font-mono text-[10px] uppercase tracking-wider"
                }
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <p className="eyebrow mr-1">Status</p>
            {(["all", "active", "on_leave", "terminated"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={
                  status === s
                    ? "px-2.5 h-7 rounded-sm border border-[color:var(--brand)] bg-[color:var(--brand)]/10 text-[color:var(--brand)] font-mono text-[10px] uppercase tracking-wider"
                    : "px-2.5 h-7 rounded-sm border border-[color:var(--rule)] text-[color:var(--ink-tertiary)] font-mono text-[10px] uppercase tracking-wider"
                }
              >
                {s.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      <EmployeeTable rows={filtered} />
    </div>
  );
}
