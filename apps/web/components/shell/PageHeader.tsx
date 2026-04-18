import type { ReactNode } from "react";
import { StatusTag, type FeatureStatus } from "./StatusTag";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  status,
  actions,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  status?: FeatureStatus;
  actions?: ReactNode;
}) {
  return (
    <header className="space-y-6 border-b border-[color:var(--rule)] pb-6">
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-2 min-w-0">
          <div className="flex items-center gap-3">
            <p className="eyebrow">{eyebrow}</p>
            {status ? <StatusTag status={status} /> : null}
          </div>
          <h1 className="display-lg">{title}</h1>
          {subtitle ? (
            <p className="text-muted-foreground text-base leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        ) : null}
      </div>
    </header>
  );
}
