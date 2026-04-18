"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Pair = {
  id: string;
  base_currency: string;
  quote_currency: string;
};

type Rate = {
  pair_id: string;
  rate_date: string;
  mid_market_rate: number;
  provider_applied_rate: number | null;
  spread_bps: number | null;
};

type Leakage = {
  pair_id: string;
  cycle_leakage_amount: number;
  ytd_leakage_amount: number;
};

export function FxWatchdogGrid() {
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [rates, setRates] = useState<Rate[]>([]);
  const [leakage, setLeakage] = useState<Leakage[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    const sb = createClient();
    const [pairsResp, ratesResp, leakResp] = await Promise.all([
      sb.from("fx_pairs").select("*").eq("is_active", true).order("base_currency"),
      sb.from("fx_rates").select("*").order("rate_date", { ascending: false }).limit(450),
      sb.from("fx_leakage").select("pair_id,cycle_leakage_amount,ytd_leakage_amount"),
    ]);
    setPairs(pairsResp.data ?? []);
    setRates(ratesResp.data ?? []);
    setLeakage(leakResp.data ?? []);
    setLoading(false);
  }

  async function runCheck() {
    setRunning(true);
    try {
      const res = await fetch("/api/fx/run", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(`FX check failed: ${data.error ?? "unknown"}`);
        return;
      }
      toast.success(
        `${data.pairs_updated} pairs refreshed · $${data.total_leakage_usd ?? 0} leakage detected`,
      );
      await load();
    } finally {
      setRunning(false);
    }
  }

  const totalCycleLeakage = leakage.reduce(
    (s, r) => s + Number(r.cycle_leakage_amount ?? 0),
    0,
  );
  const totalYtdLeakage = leakage.reduce(
    (s, r) => s + Number(r.ytd_leakage_amount ?? 0),
    0,
  );

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 rounded-sm border border-[color:var(--rule)] bg-card p-5">
        <SummaryTile
          label="Cycle leakage"
          value={`$${totalCycleLeakage.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
        />
        <SummaryTile
          label="YTD leakage"
          value={`$${totalYtdLeakage.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
        />
        <SummaryTile
          label="Projected annual"
          value={`$${(totalYtdLeakage * 2).toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
          action={
            <Button
              size="sm"
              onClick={runCheck}
              disabled={running}
              className="bg-[color:var(--brand)] hover:bg-[color:var(--brand-hover)] text-[color:var(--primary-foreground)]"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 mr-2 ${running ? "animate-spin" : ""}`}
              />
              {running ? "Running..." : "Run FX check"}
            </Button>
          }
        />
      </div>

      {/* Pair grid */}
      <div className="rounded-sm border border-[color:var(--rule)] bg-card overflow-hidden">
        <div className="grid grid-cols-[100px_110px_110px_90px_130px_130px_1fr] gap-4 px-5 py-3 border-b border-[color:var(--rule)] text-[10px] uppercase tracking-[0.12em] font-mono text-[color:var(--ink-tertiary)]">
          <div>Pair</div>
          <div className="text-right">Mid-market</div>
          <div className="text-right">Applied</div>
          <div className="text-right">Spread</div>
          <div className="text-right">Cycle leak</div>
          <div className="text-right">YTD leak</div>
          <div>30-day spread</div>
        </div>
        {loading ? (
          <div className="px-5 py-8 text-sm text-muted-foreground">Loading…</div>
        ) : (
          pairs.map((p) => {
            const pairRates = rates
              .filter((r) => r.pair_id === p.id)
              .sort((a, b) =>
                new Date(a.rate_date).getTime() - new Date(b.rate_date).getTime(),
              );
            const latest = pairRates[pairRates.length - 1];
            const leak = leakage.find((l) => l.pair_id === p.id);
            const spreadColor =
              (latest?.spread_bps ?? 0) > 100
                ? "var(--status-crit)"
                : (latest?.spread_bps ?? 0) > 60
                  ? "var(--status-warn)"
                  : "var(--ink-primary)";
            const sparkData = pairRates
              .slice(-30)
              .map((r) => ({ date: r.rate_date, bps: r.spread_bps ?? 0 }));

            return (
              <div
                key={p.id}
                className="grid grid-cols-[100px_110px_110px_90px_130px_130px_1fr] gap-4 px-5 py-3 border-b border-[color:var(--rule)] last:border-b-0 items-center hover:bg-[color:var(--accent)]/40 transition-colors"
              >
                <div className="font-mono text-sm">
                  {p.base_currency}/{p.quote_currency}
                </div>
                <div className="font-mono text-sm tabular-nums text-right">
                  {latest?.mid_market_rate?.toFixed(4) ?? "—"}
                </div>
                <div className="font-mono text-sm tabular-nums text-right">
                  {latest?.provider_applied_rate?.toFixed(4) ?? "—"}
                </div>
                <div
                  className="font-mono text-sm tabular-nums text-right"
                  style={{ color: spreadColor }}
                >
                  {latest?.spread_bps ?? "—"} bps
                </div>
                <div className="font-mono text-sm tabular-nums text-right">
                  ${Number(leak?.cycle_leakage_amount ?? 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </div>
                <div className="font-mono text-sm tabular-nums text-right">
                  ${Number(leak?.ytd_leakage_amount ?? 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </div>
                <div className="h-10 w-full">
                  {sparkData.length > 3 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sparkData}>
                        <defs>
                          <linearGradient id={`g-${p.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="bps"
                          stroke="var(--chart-1)"
                          strokeWidth={1.5}
                          fill={`url(#g-${p.id})`}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <span className="text-xs text-muted-foreground">not enough data</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function SummaryTile({
  label,
  value,
  action,
}: {
  label: string;
  value: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="eyebrow">{label}</p>
        <p className="font-mono text-2xl tabular-nums mt-1">{value}</p>
      </div>
      {action}
    </div>
  );
}
