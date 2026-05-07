import { redirect } from "next/navigation";

import {
  getAIInsights,
  getOverviewAnalytics,
  getOverviewStats,
  getRecentActivity,
  getTopCandidates,
  getUpcomingInterviews,
} from "@/features/dashboard/controller/dashboard.controller";
import { AIInsightsSection } from "@/features/dashboard/view/ai-insights-section";
import { OverviewAnalyticsSection } from "@/features/dashboard/view/overview-analytics-section";
import { OverviewStatsGrid } from "@/features/dashboard/view/overview-stats-grid";
import { RecentActivityFeed } from "@/features/dashboard/view/recent-activity-feed";
import { TopCandidatesSection } from "@/features/dashboard/view/top-candidates-section";
import { UpcomingInterviewsWidget } from "@/features/dashboard/view/upcoming-interviews-widget";

export async function OverviewStatsSection() {
  const stats = await getOverviewStats();
  if (!stats) redirect("/login");
  return <OverviewStatsGrid stats={stats} />;
}

export async function OverviewAnalyticsSectionLoader() {
  const analytics = await getOverviewAnalytics();
  if (!analytics) redirect("/login");
  return <OverviewAnalyticsSection analytics={analytics} />;
}

export async function OverviewActivityTopRow() {
  const [recentActivity, topCandidates] = await Promise.all([getRecentActivity(), getTopCandidates()]);
  if (!recentActivity || !topCandidates) redirect("/login");
  return (
    <section className="mt-4 grid gap-4 xl:grid-cols-2">
      <RecentActivityFeed activities={recentActivity} />
      <TopCandidatesSection candidates={topCandidates} />
    </section>
  );
}

export async function OverviewInsightsUpcomingRow() {
  const [insights, upcomingInterviews] = await Promise.all([getAIInsights(), getUpcomingInterviews()]);
  if (!insights || !upcomingInterviews) redirect("/login");
  return (
    <section className="mt-4 grid gap-4 xl:grid-cols-2">
      <AIInsightsSection insights={insights} />
      <UpcomingInterviewsWidget interviews={upcomingInterviews} />
    </section>
  );
}
