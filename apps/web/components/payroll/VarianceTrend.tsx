"use client";

import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Point = {
  period: string;
  current: number;
  prior: number;
};

export function VarianceTrend({ points }: { points: Point[] }) {
  if (points.length === 0) {
    return (
      <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">
        No historical cycles to trend.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={points} margin={{ top: 8, right: 16, bottom: 4, left: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--rule)"
          vertical={false}
        />
        <XAxis
          dataKey="period"
          stroke="var(--ink-tertiary)"
          tick={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="var(--ink-tertiary)"
          tick={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
        />
        <Tooltip
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--rule)",
            borderRadius: 2,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
          }}
          formatter={(v) => `$${Number(v).toLocaleString()}`}
        />
        <Line
          type="monotone"
          dataKey="current"
          stroke="var(--brand)"
          strokeWidth={2}
          dot={{ fill: "var(--brand)", r: 3 }}
          name="Current"
        />
        <Line
          type="monotone"
          dataKey="prior"
          stroke="var(--ink-tertiary)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          dot={false}
          name="Prior"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
