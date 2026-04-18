"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shell/PageHeader";
import {
  TerminationsList,
  type TerminationRow,
} from "@/components/people/TerminationsList";
import { TerminationChecklistPanel } from "@/components/people/TerminationChecklistPanel";
import { LogTerminationDialog } from "@/components/people/LogTerminationDialog";

export default function TerminationsPage() {
  const [items, setItems] = useState<TerminationRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const sb = createClient();
    const { data } = await sb
      .from("terminations")
      .select(
        "id,termination_type,notice_date,last_working_day,status,employees(id,full_name,role_title,countries(iso_code,name,flag_emoji))",
      )
      .order("last_working_day", { ascending: true });
    const rows = (data ?? []) as unknown as Array<
      Omit<TerminationRow, "employees"> & { employees: unknown }
    >;
    const flat: TerminationRow[] = rows.map((r) => {
      const emp = Array.isArray(r.employees) ? r.employees[0] : r.employees;
      if (emp && typeof emp === "object") {
        const empObj = emp as Record<string, unknown>;
        const ctry = Array.isArray(empObj.countries)
          ? empObj.countries[0]
          : empObj.countries;
        empObj.countries = ctry ?? null;
      }
      return { ...r, employees: (emp ?? null) as TerminationRow["employees"] };
    });
    setItems(flat);
    if (!selectedId && flat.length > 0) {
      const firstActive = flat.find((t) => t.status !== "complete");
      setSelectedId(firstActive?.id ?? flat[0].id);
    }
  }, [selectedId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <PageHeader
        eyebrow="Operations · Terminations"
        title="Termination Checklist Bot"
        subtitle="One webhook fires Gemini 2.5 Flash with the employee's jurisdiction rules and generates a full exit checklist — final pay deadlines, tax certificates, pension deregistration, garnishment release. No more scrambling."
        status="live"
        actions={<LogTerminationDialog onCreated={async (id) => { await load(); setSelectedId(id); }} />}
      />

      {/* Metric strip */}
      <div className="grid grid-cols-4 gap-4 rounded-sm border border-[color:var(--rule)] bg-card p-5">
        <Metric
          label="Active"
          value={items.filter((t) => t.status !== "complete").length.toString()}
        />
        <Metric
          label="This month"
          value={items
            .filter((t) => {
              const d = new Date(t.last_working_day);
              const now = new Date();
              return (
                d.getFullYear() === now.getFullYear() &&
                d.getMonth() === now.getMonth()
              );
            })
            .length.toString()}
        />
        <Metric
          label="Completed"
          value={items.filter((t) => t.status === "complete").length.toString()}
        />
        <div>
          <p className="eyebrow">Jurisdiction rules</p>
          <p className="font-mono text-sm mt-3">2026-04</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 flex-1 min-h-[600px]">
        <TerminationsList
          items={items}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <TerminationChecklistPanel terminationId={selectedId} />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <p className="font-mono text-2xl tabular-nums mt-1">{value}</p>
    </div>
  );
}
