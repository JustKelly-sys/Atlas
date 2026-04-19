import Link from "next/link";

type Card = {
  eyebrow: string;
  name: string;
  metric: string;
  metricLabel: string;
  href: string;
  status: "live" | "prototype" | "roadmap";
  tone?: "accent" | "crit" | "warn" | "ok";
};

const TONE_COLOR: Record<string, string> = {
  accent: "var(--brand)",
  crit: "var(--status-crit)",
  warn: "var(--status-warn)",
  ok: "var(--status-ok)",
};

export function FiveStrip({ cards }: { cards: Card[] }) {
  return (
    <section>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
          paddingBottom: 10,
        }}
      >
        <span className="eyebrow">THE FIVE · AI AUTOMATIONS</span>
        <span className="mono" style={{ fontSize: 10.5, color: "var(--ink-tertiary)", letterSpacing: "0.08em" }}>
          5 LIVE
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
        {cards.map((card) => {
          const valueColor = card.tone ? TONE_COLOR[card.tone] : "var(--foreground)";
          return (
            <Link
              key={card.name}
              href={card.href}
              className="row-hover"
              style={{
                padding: 20,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                minHeight: 176,
                border: "1px solid var(--rule)",
                background: "var(--card)",
                textDecoration: "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span
                  className="mono"
                  style={{ fontSize: 10.5, color: "var(--ink-tertiary)", letterSpacing: "0.1em" }}
                >
                  {card.eyebrow}
                </span>
                <span className="pill pill-live" style={{ padding: "1px 6px", fontSize: 9.5 }}>
                  <span className="dot" /> Live
                </span>
              </div>

              <div
                className="serif"
                style={{
                  fontSize: 21,
                  fontWeight: 400,
                  color: "var(--foreground)",
                  letterSpacing: "-0.015em",
                  marginTop: 18,
                  lineHeight: 1.1,
                }}
              >
                {card.name}
              </div>

              <div style={{ flex: 1 }} />

              <div style={{ marginTop: 14 }}>
                <div
                  className="serif tnum"
                  style={{
                    fontSize: 36,
                    fontWeight: 400,
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    color: valueColor,
                  }}
                >
                  {card.metric}
                </div>
                <div
                  className="mono"
                  style={{ fontSize: 10.5, color: "var(--ink-tertiary)", marginTop: 6, letterSpacing: "0.04em" }}
                >
                  {card.metricLabel}
                </div>
              </div>

              <span
                style={{
                  position: "absolute",
                  right: 16,
                  bottom: 14,
                  fontFamily: "var(--font-mono)",
                  color: "var(--ink-tertiary)",
                  fontSize: 14,
                }}
              >
                →
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
