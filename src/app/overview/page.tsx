import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getDashboardProfile } from "@/features/dashboard/controller/dashboard.controller";
import { DashboardShell } from "@/features/dashboard/view/dashboard-shell";

export const metadata: Metadata = {
  title: "Overview | HireMind",
};
export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const profile = await getDashboardProfile();
  if (!profile) {
    redirect("/login");
  }
  return <DashboardShell profile={profile} pageTitle="Overview" />;
}
