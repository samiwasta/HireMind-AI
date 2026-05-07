import { Sparkles, CalendarCheck2, Trophy, Users } from "lucide-react";

import type { DashboardStat } from "@/features/dashboard/model/dashboard.model";

const iconMap = {
  "Active Interviews": CalendarCheck2,
  Candidates: Users,
  "AI Evaluations": Sparkles,
  Shortlisted: Trophy,
} as const;

type OverviewStatsGridProps = {
  stats: DashboardStat[];
};

export function OverviewStatsGrid({ stats }: OverviewStatsGridProps) {
  return (
    <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = iconMap[stat.label];

        return (
          <article
            key={stat.label}
            className="rounded-2xl border border-border/80 bg-card p-4 shadow-[0_1px_0_0_color-mix(in_oklab,var(--color-border)_70%,transparent)]"
          >
            <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2 text-primary">
              <Icon className="size-4" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">{stat.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.helperText}</p>
          </article>
        );
      })}
    </section>
  );
}
