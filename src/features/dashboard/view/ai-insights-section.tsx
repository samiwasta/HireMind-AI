"use client";

import { Sparkles } from "lucide-react";

import type { AIInsightItem } from "@/features/dashboard/model/dashboard.model";
import { cn } from "@/lib/utils";

type AIInsightsSectionProps = {
  insights: AIInsightItem[];
  className?: string;
};

export function AIInsightsSection({ insights, className }: AIInsightsSectionProps) {
  return (
    <section
      className={cn(
        "flex h-[340px] flex-col rounded-2xl border border-primary/25 bg-card p-4 shadow-[0_1px_0_0_color-mix(in_oklab,var(--color-border)_70%,transparent)]",
        className
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="grid size-8 place-items-center rounded-full bg-primary/15">
          <Sparkles className="size-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">AI Insights</h3>
          <p className="text-xs text-muted-foreground">Generated patterns from candidate evaluations</p>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 flex-col gap-2 overflow-y-auto pr-1">
        {insights.length ? (
          insights.map((insight) => (
            <article key={insight.id} className="rounded-xl border border-primary/15 bg-primary/5 px-3 py-2.5">
              <p className="text-sm text-foreground">{insight.message}</p>
            </article>
          ))
        ) : (
          <div className="grid flex-1 min-h-[220px] place-items-center rounded-lg border border-dashed border-primary/20 bg-primary/5 px-4 text-center text-xs text-muted-foreground">
            No AI insights available yet.
          </div>
        )}
      </div>
    </section>
  );
}
