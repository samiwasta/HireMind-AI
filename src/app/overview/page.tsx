import type { Metadata } from "next";
import { redirect } from "next/navigation";

import {
  getAIInsights,
  getDashboardProfile,
  getRecentActivity,
  getTopCandidates,
  getUpcomingInterviews,
  getOverviewAnalytics,
  getOverviewStats,
} from "@/features/dashboard/controller/dashboard.controller";
import { DashboardShell } from "@/features/dashboard/view/dashboard-shell";

export const metadata: Metadata = {
  title: "Overview | HireMind",
};
export const dynamic = "force-dynamic";

function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function OverviewPage() {
  const [profile, stats, analytics, recentActivity, topCandidates, insights, upcomingInterviews] = await Promise.all([
    getDashboardProfile(),
    getOverviewStats(),
    getOverviewAnalytics(),
    getRecentActivity(),
    getTopCandidates(),
    getAIInsights(),
    getUpcomingInterviews(),
  ]);
  if (!profile || !stats || !analytics || !recentActivity || !topCandidates || !insights || !upcomingInterviews) {
    redirect("/login");
  }

  const firstName = profile.name.split(" ").filter(Boolean)[0] ?? "there";
  const greetingTitle = `${getTimeBasedGreeting()}, ${firstName}`;
  const greetingDescription = "Here’s an overview of your hiring pipeline today.";

  return (
    <DashboardShell
      profile={profile}
      pageTitle="Overview"
      greetingTitle={greetingTitle}
      greetingDescription={greetingDescription}
      stats={stats}
      analytics={analytics}
      recentActivity={recentActivity}
      topCandidates={topCandidates}
      insights={insights}
      upcomingInterviews={upcomingInterviews}
    />
  );
}
