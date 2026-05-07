"use client";

import { motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardSidebar } from "@/features/dashboard/view/dashboard-sidebar";
import type {
  AIInsightItem,
  DashboardProfile,
  RecentActivityItem,
  DashboardStat,
  OverviewAnalytics,
  TopCandidateItem,
  UpcomingInterviewItem,
} from "@/features/dashboard/model/dashboard.model";
import { OverviewStatsGrid } from "@/features/dashboard/view/overview-stats-grid";
import { OverviewAnalyticsSection } from "@/features/dashboard/view/overview-analytics-section";
import { RecentActivityFeed } from "@/features/dashboard/view/recent-activity-feed";
import { TopCandidatesSection } from "@/features/dashboard/view/top-candidates-section";
import { AIInsightsSection } from "@/features/dashboard/view/ai-insights-section";
import { UpcomingInterviewsWidget } from "@/features/dashboard/view/upcoming-interviews-widget";

type DashboardShellProps = {
  profile: DashboardProfile;
  pageTitle?: string;
  greetingTitle?: string;
  greetingDescription?: string;
  stats?: DashboardStat[];
  analytics?: OverviewAnalytics;
  recentActivity?: RecentActivityItem[];
  topCandidates?: TopCandidateItem[];
  insights?: AIInsightItem[];
  upcomingInterviews?: UpcomingInterviewItem[];
};

export function DashboardShell({
  profile,
  pageTitle = "Dashboard",
  greetingTitle = "Welcome to HireMind Dashboard",
  greetingDescription = "Your sidebar layout is ready. You can now plug your modules here.",
  stats = [],
  analytics,
  recentActivity = [],
  topCandidates = [],
  insights = [],
  upcomingInterviews = [],
}: DashboardShellProps) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <DashboardSidebar profile={profile} />

        <SidebarInset>
          <header className="flex h-14 items-center justify-between border-b border-border/80 bg-card/70 px-4 backdrop-blur-sm">
            <div className="flex items-center">
              <SidebarTrigger />
              <h1 className="ml-3 text-sm font-semibold text-foreground">{pageTitle}</h1>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                whileHover={{ y: -1, scale: 1.01 }}
                whileTap={{ y: 0, scale: 0.99 }}
                transition={{ duration: 0.16 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-lg border-primary/25 bg-primary/5 px-3.5 text-primary hover:bg-primary/10 hover:text-primary-hover"
                >
                  <Plus className="size-4" />
                  Create Interview
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ y: -1, scale: 1.01 }}
                whileTap={{ y: 0, scale: 0.99 }}
                transition={{ duration: 0.16 }}
              >
                <Button
                  size="sm"
                  className="h-9 rounded-lg bg-linear-to-r from-primary to-primary-hover px-4 shadow-[0_6px_18px_-10px_color-mix(in_oklab,var(--color-primary)_75%,transparent)] hover:from-primary-hover hover:to-primary"
                >
                  <motion.span
                    animate={{ rotate: [0, -8, 8, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 3 }}
                    className="inline-flex"
                  >
                    <Sparkles className="size-4" />
                  </motion.span>
                  Generate Interview Questions
                </Button>
              </motion.div>
            </div>
          </header>
          <main className="flex-1 bg-linear-to-b from-background to-secondary/20 p-6">
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-[0_1px_0_0_color-mix(in_oklab,var(--color-border)_70%,transparent)]">
              <h2 className="text-2xl font-semibold text-foreground">{greetingTitle}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{greetingDescription}</p>
            </div>
            {stats.length ? <OverviewStatsGrid stats={stats} /> : null}
            {analytics ? <OverviewAnalyticsSection analytics={analytics} /> : null}
            <section className="mt-4 grid gap-4 xl:grid-cols-2">
              <RecentActivityFeed activities={recentActivity} />
              <TopCandidatesSection candidates={topCandidates} />
            </section>
            <section className="mt-4 grid gap-4 xl:grid-cols-2">
              <AIInsightsSection insights={insights} />
              <UpcomingInterviewsWidget interviews={upcomingInterviews} />
            </section>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
