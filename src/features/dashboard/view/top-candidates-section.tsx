"use client";

import type { CandidateConfidence, CandidateRecommendation, TopCandidateItem } from "@/features/dashboard/model/dashboard.model";
import { cn } from "@/lib/utils";

type TopCandidatesSectionProps = {
  candidates: TopCandidateItem[];
  className?: string;
};

function getRecommendationStyles(recommendation: CandidateRecommendation) {
  if (recommendation === "Strong Hire") {
    return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  }
  if (recommendation === "Hire") {
    return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
  }
  if (recommendation === "Consider") {
    return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
  }
  return "bg-slate-500/10 text-slate-600 dark:text-slate-400";
}

function getConfidenceStyles(confidence: CandidateConfidence) {
  if (confidence === "High") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  }
  if (confidence === "Medium") {
    return "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400";
  }
  return "border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-400";
}

export function TopCandidatesSection({ candidates, className }: TopCandidatesSectionProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border/80 bg-card p-4 shadow-[0_1px_0_0_color-mix(in_oklab,var(--color-border)_70%,transparent)]",
        className
      )}
    >
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-foreground">Top Candidates</h3>
        <p className="text-xs text-muted-foreground">AI-ranked shortlist for quicker hiring decisions</p>
      </div>

      <div className="h-[280px] overflow-y-auto">
        <div className="grid grid-cols-[minmax(0,1.2fr)_0.6fr_1fr] gap-2 border-b border-border/70 pb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          <span>Candidate</span>
          <span>AI Score</span>
          <span>Recommendation</span>
        </div>

        {candidates.length ? (
          <div className="divide-y divide-border/60">
            {candidates.map((candidate) => (
              <article key={candidate.id} className="grid grid-cols-[minmax(0,1.2fr)_0.6fr_1fr] items-center gap-2 py-3">
                <p className="truncate text-sm font-medium text-foreground">{candidate.candidateName}</p>
                <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {candidate.aiScore.toFixed(1)}
                </span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      candidate.recommendation === "Strong Hire"
                        ? "bg-emerald-500"
                        : candidate.recommendation === "Hire"
                          ? "bg-blue-500"
                          : candidate.recommendation === "Consider"
                            ? "bg-amber-500"
                            : "bg-slate-500"
                    )}
                  />
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", getRecommendationStyles(candidate.recommendation))}>
                    {candidate.recommendation}
                  </span>
                  <span className={cn("rounded-full border px-1.5 py-0.5 text-[10px] font-medium", getConfidenceStyles(candidate.confidence))}>
                    {candidate.confidence}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="grid h-[244px] place-items-center rounded-lg border border-dashed border-border/70 bg-secondary/25 px-4 text-center text-xs text-muted-foreground mt-2">
            No top candidates yet.
          </div>
        )}
      </div>
    </section>
  );
}
