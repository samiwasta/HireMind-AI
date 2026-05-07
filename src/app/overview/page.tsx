import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { getDashboardProfile } from "@/features/dashboard/controller/dashboard.controller";
import { DashboardShell } from "@/features/dashboard/view/dashboard-shell";
import {
  OverviewActivityTopRowSkeleton,
  OverviewAnalyticsSectionSkeleton,
  OverviewInsightsUpcomingRowSkeleton,
  OverviewStatsGridSkeleton,
} from "@/features/dashboard/view/overview-skeletons";
import {
  OverviewActivityTopRow,
  OverviewAnalyticsSectionLoader,
  OverviewInsightsUpcomingRow,
  OverviewStatsSection,
} from "@/features/dashboard/view/overview-streaming-sections";

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
  const profile = await getDashboardProfile();
  if (!profile) {
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
    >
      <Suspense fallback={<OverviewStatsGridSkeleton />}>
        <OverviewStatsSection />
      </Suspense>
      <Suspense fallback={<OverviewAnalyticsSectionSkeleton />}>
        <OverviewAnalyticsSectionLoader />
      </Suspense>
      <Suspense fallback={<OverviewActivityTopRowSkeleton />}>
        <OverviewActivityTopRow />
      </Suspense>
      <Suspense fallback={<OverviewInsightsUpcomingRowSkeleton />}>
        <OverviewInsightsUpcomingRow />
      </Suspense>
    </DashboardShell>
  );
}
