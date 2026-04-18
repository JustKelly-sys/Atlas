import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import { StatusTag, type FeatureStatus } from "@/components/shell/StatusTag";

type Card = {
  eyebrow: string;
  name: string;
  metric: string;
  metricLabel: string;
  href: string;
  status: FeatureStatus;
};

export function FiveStrip({ cards }: { cards: Card[] }) {
  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="eyebrow">The Five</p>
          <Star
            className="h-3 w-3 fill-[color:var(--brand)] stroke-[color:var(--brand)]"
            aria-hidden
          />
        </div>
        <p className="text-[11px] text-muted-foreground">
          Signature automations
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {cards.map((card) => (
          <Link
            key={card.name}
            href={card.href}
            className="group rounded-sm border border-[color:var(--rule)] bg-card p-4 space-y-3 hover:border-[color:var(--brand)] transition-colors"
          >
            <div className="flex items-start justify-between">
              <p className="eyebrow text-[9px]">{card.eyebrow}</p>
              <ArrowUpRight className="h-3.5 w-3.5 text-[color:var(--ink-tertiary)] group-hover:text-[color:var(--brand)] transition-colors" />
            </div>
            <h3 className="font-display text-lg leading-tight tracking-[-0.01em]">
              {card.name}
            </h3>
            <div>
              <p className="font-mono text-xl tabular-nums leading-none">
                {card.metric}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1.5 leading-tight">
                {card.metricLabel}
              </p>
            </div>
            <StatusTag status={card.status} />
          </Link>
        ))}
      </div>
    </section>
  );
}
