"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Clock } from "lucide-react";

type Stage = {
  key: string;
  label: string;
  owner: string;
};

const STAGES: Stage[] = [
  { key: "inputs_open", label: "Inputs open", owner: "HR · All countries" },
  { key: "cutoff", label: "Cutoff", owner: "Payroll ops" },
  { key: "posting", label: "Posting", owner: "Payroll ops" },
  { key: "reconciling", label: "Reconciliation", owner: "Finance" },
  { key: "approved", label: "Approval", owner: "Finance lead" },
  { key: "paid", label: "Payment", owner: "Treasury" },
  { key: "closed", label: "Close", owner: "Payroll ops" },
];

/**
 * Horizontal pipeline showing the 7-stage cycle flow. Current stage is
 * highlighted in brand; past stages tick; future stages stay hollow.
 */
export function CycleGantt({ currentStatus }: { currentStatus: string }) {
  const currentIndex = Math.max(
    0,
    STAGES.findIndex((s) => s.key === currentStatus),
  );

  return (
    <div className="rounded-sm border border-[color:var(--rule)] bg-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Cycle pipeline</p>
          <h2 className="font-display text-lg tracking-[-0.01em] mt-1">
            April 2026
          </h2>
        </div>
        <span
          className="font-mono text-xs px-2.5 py-1 rounded-sm bg-[color:var(--brand)]/10 text-[color:var(--brand)] uppercase tracking-wider"
        >
          stage {currentIndex + 1} / {STAGES.length}
        </span>
      </div>

      {/* Pipeline track */}
      <div className="relative">
        {/* Background rail */}
        <div
          className="absolute top-5 left-5 right-5 h-0.5 bg-[color:var(--rule)]"
          aria-hidden
        />
        {/* Progress fill */}
        <div
          className="absolute top-5 left-5 h-0.5 bg-[color:var(--brand)]"
          style={{
            width:
              STAGES.length <= 1
                ? "0%"
                : `calc((100% - 2.5rem) * ${currentIndex / (STAGES.length - 1)})`,
          }}
          aria-hidden
        />

        <div className="grid grid-cols-7 gap-0 relative">
          {STAGES.map((s, i) => {
            const done = i < currentIndex;
            const current = i === currentIndex;
            return (
              <div
                key={s.key}
                className="flex flex-col items-center text-center space-y-2"
              >
                <div
                  className={cn(
                    "h-10 w-10 rounded-full border-2 flex items-center justify-center bg-card transition-colors",
                    done &&
                      "border-[color:var(--brand)] bg-[color:var(--brand)] text-[color:var(--primary-foreground)]",
                    current &&
                      "border-[color:var(--brand)] bg-card ring-4 ring-[color:var(--brand)]/20",
                    !done &&
                      !current &&
                      "border-[color:var(--rule)] text-[color:var(--ink-tertiary)]",
                  )}
                >
                  {done ? (
                    <CheckCircle2 className="h-4 w-4" aria-hidden />
                  ) : current ? (
                    <Clock
                      className="h-4 w-4 text-[color:var(--brand)]"
                      aria-hidden
                    />
                  ) : (
                    <Circle className="h-4 w-4" aria-hidden />
                  )}
                </div>
                <div className="min-h-[3rem]">
                  <p
                    className={cn(
                      "text-xs font-medium",
                      current && "text-[color:var(--brand)]",
                    )}
                  >
                    {s.label}
                  </p>
                  <p className="font-mono text-[10px] text-[color:var(--ink-tertiary)] mt-0.5 leading-tight">
                    {s.owner}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
