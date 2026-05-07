"use client";

import { CalendarCheck2, Sparkles, UserCheck } from "lucide-react";

import type { RecentActivityItem } from "@/features/dashboard/model/dashboard.model";
import { cn } from "@/lib/utils";

type RecentActivityFeedProps = {
  activities: RecentActivityItem[];
  className?: string;
};

function formatTimeAgo(date: string) {
  const now = Date.now();
  const diffMs = Math.max(0, now - new Date(date).getTime());
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function ActivityIcon({ type }: { type: RecentActivityItem["type"] }) {
  if (type === "interview-created") {
    return <CalendarCheck2 className="size-4 text-primary" />;
  }
  if (type === "evaluation-completed") {
    return <Sparkles className="size-4 text-primary" />;
  }
  return <UserCheck className="size-4 text-primary" />;
}

export function RecentActivityFeed({ activities, className }: RecentActivityFeedProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border/80 bg-card p-4 shadow-[0_1px_0_0_color-mix(in_oklab,var(--color-border)_70%,transparent)]",
        className
      )}
    >
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
        <p className="text-xs text-muted-foreground">Latest updates from your hiring pipeline</p>
      </div>
      <div className="h-[280px] overflow-y-auto pr-1">
        {activities.length ? (
          <div className="divide-y divide-border/60">
            {activities.map((activity) => (
              <article key={activity.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <div className="grid size-8 place-items-center rounded-full bg-secondary">
                  <ActivityIcon type={activity.type} />
                </div>
                <div className="grid size-8 place-items-center rounded-full bg-primary/10">
                  <span className="text-[11px] font-semibold text-primary">{activity.actorInitials}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                </div>
                <time className="shrink-0 text-[11px] text-muted-foreground">{formatTimeAgo(activity.timestamp)}</time>
              </article>
            ))}
          </div>
        ) : (
          <div className="grid h-full place-items-center rounded-lg border border-dashed border-border/70 bg-secondary/25 px-4 text-center text-xs text-muted-foreground">
            No recent activity yet.
          </div>
        )}
      </div>
    </section>
  );
}
