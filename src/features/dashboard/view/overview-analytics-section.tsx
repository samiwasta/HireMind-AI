"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { OverviewAnalytics } from "@/features/dashboard/model/dashboard.model";

type OverviewAnalyticsSectionProps = {
  analytics: OverviewAnalytics;
};

export function OverviewAnalyticsSection({ analytics }: OverviewAnalyticsSectionProps) {
  const funnelData = analytics.funnel.map((item, index) => ({
    ...item,
    fill: ["#6366f1", "#7c83f7", "#9ca3ff", "#c7d2fe"][index] ?? "#6366f1",
  }));
  const funnelMax = Math.max(...funnelData.map((item) => item.value), 1);
  const funnelDomainMax = Math.ceil(funnelMax * 1.2);

  const chartInitialSize = { width: 560, height: 240 };

  return (
    <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <article className="min-w-0 rounded-2xl border border-border/80 bg-card p-4 shadow-[0_1px_0_0_color-mix(in_oklab,var(--color-border)_70%,transparent)]">
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-foreground">Hiring Funnel</h3>
          <p className="text-xs text-muted-foreground">Applied → Attempted → Evaluated → Shortlisted</p>
        </div>
        <div className="h-60 min-h-[240px] min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={chartInitialSize}>
            <BarChart data={funnelData} layout="vertical" margin={{ left: 8, right: 56, top: 8, bottom: 8 }}>
              <Tooltip />
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" hide domain={[0, funnelDomainMax]} />
              <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={72} tick={{ fontSize: 12 }} />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                <LabelList dataKey="value" position="right" fill="var(--color-foreground)" fontSize={12} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="min-w-0 rounded-2xl border border-border/80 bg-card p-4 shadow-[0_1px_0_0_color-mix(in_oklab,var(--color-border)_70%,transparent)]">
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-foreground">Weekly Activity</h3>
          <p className="text-xs text-muted-foreground">Interviews scheduled across the week</p>
        </div>
        <div className="h-60 min-h-[240px] min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={chartInitialSize}>
            <LineChart data={analytics.weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="interviews"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={{ fill: "var(--color-primary)", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
}
