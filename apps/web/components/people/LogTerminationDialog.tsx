"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserMinus, Sparkles } from "lucide-react";
import { toast } from "sonner";

type EmployeeOption = {
  id: string;
  full_name: string;
  role_title: string;
  countries: { iso_code: string; flag_emoji: string | null } | null;
};

type TerminationType = "voluntary" | "involuntary" | "deceased";

export function LogTerminationDialog({
  onCreated,
}: {
  onCreated: (terminationId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [employeeId, setEmployeeId] = useState<string>("");
  const [type, setType] = useState<TerminationType>("voluntary");
  const [noticeDate, setNoticeDate] = useState<string>(
    new Date().toISOString().slice(0, 10),
  );
  const [lastWorkingDay, setLastWorkingDay] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 10);
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    const sb = createClient();
    sb.from("employees")
      .select("id,full_name,role_title,countries(iso_code,flag_emoji)")
      .eq("status", "active")
      .order("full_name")
      .then(({ data }) => {
        const rows = (data ?? []) as unknown as Array<{
          id: string;
          full_name: string;
          role_title: string;
          countries: unknown;
        }>;
        const flat = rows.map((r) => ({
          ...r,
          countries: Array.isArray(r.countries) ? r.countries[0] ?? null : r.countries,
        })) as EmployeeOption[];
        setEmployees(flat);
        if (flat.length > 0 && !employeeId) setEmployeeId(flat[0].id);
      });
  }, [open, employeeId]);

  async function submit() {
    if (!employeeId) {
      toast.error("Pick an employee");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/terminations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: employeeId,
          termination_type: type,
          notice_date: noticeDate,
          last_working_day: lastWorkingDay,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(`Log failed: ${data.error ?? "unknown"}`);
        return;
      }
      const id = data.termination_id ?? data.id;
      toast.success(
        `Checklist generated · ${data.item_count ?? "?"} items`,
      );
      setOpen(false);
      if (id) onCreated(id);
    } catch (err) {
      toast.error(`Log failed: ${String(err)}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            size="sm"
            className="bg-[color:var(--brand)] hover:bg-[color:var(--brand-hover)] text-[color:var(--primary-foreground)]"
          />
        }
      >
        <UserMinus className="h-3.5 w-3.5 mr-2" />
        Log termination
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl tracking-[-0.01em]">
            Log a termination
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Gemini 2.5 Flash will generate a jurisdiction-specific checklist with
            statutory deadlines.
          </p>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="eyebrow">Employee</label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full h-9 px-3 rounded-sm border border-[color:var(--rule)] bg-background text-sm"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.countries?.flag_emoji ?? ""} {emp.full_name} — {emp.role_title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="eyebrow">Termination type</label>
            <div className="grid grid-cols-3 gap-2">
              {(["voluntary", "involuntary", "deceased"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`h-9 px-3 rounded-sm border text-sm capitalize transition-colors ${
                    type === t
                      ? "border-[color:var(--brand)] bg-[color:var(--brand)]/10 text-[color:var(--brand)]"
                      : "border-[color:var(--rule)] hover:border-[color:var(--ink-tertiary)]"
                  }`}
                >
                  {t === "voluntary"
                    ? "Resignation"
                    : t === "involuntary"
                      ? "Dismissal"
                      : "Deceased"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="eyebrow">Notice date</label>
              <Input
                type="date"
                value={noticeDate}
                onChange={(e) => setNoticeDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="eyebrow">Last working day</label>
              <Input
                type="date"
                value={lastWorkingDay}
                onChange={(e) => setLastWorkingDay(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={submit}
            disabled={submitting || !employeeId}
            className="bg-[color:var(--brand)] hover:bg-[color:var(--brand-hover)] text-[color:var(--primary-foreground)]"
          >
            <Sparkles className="h-3.5 w-3.5 mr-2" />
            {submitting ? "Generating checklist…" : "Generate with Gemini"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
