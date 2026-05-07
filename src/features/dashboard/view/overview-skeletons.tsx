import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const cardShell =
  "rounded-2xl border border-border/80 bg-card shadow-[0_1px_0_0_color-mix(in_oklab,var(--color-border)_70%,transparent)]";

export function OverviewStatsGridSkeleton({ className }: { className?: string }) {
  return (
    <section className={cn("mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4", className)} aria-hidden>
      {Array.from({ length: 4 }).map((_, i) => (
        <article key={i} className={cn(cardShell, "p-4")}>
          <Skeleton className="mb-3 size-8 rounded-lg" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-2 h-8 w-16" />
          <Skeleton className="mt-2 h-3 w-full max-w-[200px]" />
        </article>
      ))}
    </section>
  );
}

export function OverviewAnalyticsSectionSkeleton({ className }: { className?: string }) {
  return (
    <section
      className={cn("mt-6 grid gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]", className)}
      aria-hidden
    >
      {[0, 1].map((key) => (
        <article key={key} className={cn(cardShell, "min-w-0 p-4")}>
          <Skeleton className="h-4 w-36" />
          <Skeleton className="mt-2 h-3 w-64 max-w-full" />
          <Skeleton className="mt-4 h-60 min-h-[240px] w-full rounded-xl" />
        </article>
      ))}
    </section>
  );
}

function feedCardSkeleton() {
  return (
    <section className={cn(cardShell, "p-4")} aria-hidden>
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-2 h-3 w-56 max-w-full" />
      <div className="mt-3 h-[280px] space-y-0 pr-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 border-b border-border/60 py-3 last:border-0">
            <Skeleton className="size-8 shrink-0 rounded-full" />
            <Skeleton className="size-8 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-3/5 max-w-[180px]" />
              <Skeleton className="h-3 w-2/5 max-w-[120px]" />
            </div>
            <Skeleton className="h-3 w-10 shrink-0" />
          </div>
        ))}
      </div>
    </section>
  );
}

function topCandidatesCardSkeleton() {
  return (
    <section className={cn(cardShell, "p-4")} aria-hidden>
      <Skeleton className="h-4 w-36" />
      <Skeleton className="mt-2 h-3 w-64 max-w-full" />
      <div className="mt-3 h-[280px]">
        <div className="grid grid-cols-[minmax(0,1.2fr)_0.6fr_1fr] gap-2 border-b border-border/70 pb-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-24" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-[minmax(0,1.2fr)_0.6fr_1fr] items-center gap-2 border-b border-border/60 py-3 last:border-0">
            <Skeleton className="h-4 w-full max-w-[140px]" />
            <Skeleton className="h-6 w-10 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function OverviewActivityTopRowSkeleton({ className }: { className?: string }) {
  return (
    <section className={cn("mt-4 grid gap-4 xl:grid-cols-2", className)} aria-hidden>
      {feedCardSkeleton()}
      {topCandidatesCardSkeleton()}
    </section>
  );
}

export function OverviewInsightsUpcomingRowSkeleton({ className }: { className?: string }) {
  return (
    <section className={cn("mt-4 grid gap-4 xl:grid-cols-2", className)} aria-hidden>
      <section
        className={cn(
          "flex h-[340px] flex-col rounded-2xl border border-primary/25 bg-card p-4 shadow-[0_1px_0_0_color-mix(in_oklab,var(--color-border)_70%,transparent)]"
        )}
      >
        <div className="mb-3 flex items-center gap-2">
          <Skeleton className="size-8 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-48 max-w-[min(100%,280px)]" />
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-2 pr-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </section>
      <section
        className={cn(
          "flex h-[340px] flex-col rounded-2xl border border-border/80 bg-card p-4 shadow-[0_1px_0_0_color-mix(in_oklab,var(--color-border)_70%,transparent)]"
        )}
      >
        <div className="mb-3 flex items-center gap-2">
          <Skeleton className="size-8 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-52 max-w-full" />
          </div>
          <Skeleton className="h-6 w-20 rounded-md" />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </section>
    </section>
  );
}
