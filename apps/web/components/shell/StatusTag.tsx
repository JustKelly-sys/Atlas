import { cn } from "@/lib/utils";

export type FeatureStatus = "live" | "prototype" | "roadmap";

const STYLES: Record<FeatureStatus, { bg: string; fg: string; label: string }> = {
  live: {
    bg: "bg-[color:var(--status-ok)]/10",
    fg: "text-[color:var(--status-ok)]",
    label: "Live",
  },
  prototype: {
    bg: "bg-[color:var(--status-warn)]/10",
    fg: "text-[color:var(--status-warn)]",
    label: "Prototype",
  },
  roadmap: {
    bg: "bg-[color:var(--color-ink-tertiary)]/10",
    fg: "text-[color:var(--color-ink-tertiary)]",
    label: "Roadmap",
  },
};

export function StatusTag({
  status,
  className,
}: {
  status: FeatureStatus;
  className?: string;
}) {
  const s = STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center font-mono text-[10px] uppercase tracking-[0.14em] px-1.5 py-0.5 rounded-sm",
        s.bg,
        s.fg,
        className,
      )}
    >
      {s.label}
    </span>
  );
}
