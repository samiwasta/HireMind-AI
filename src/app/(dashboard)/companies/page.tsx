import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getDashboardProfile } from "@/features/dashboard/controller/dashboard.controller";
import { getCompaniesForSession } from "@/features/companies/controller/create-company.controller";
import { CompaniesPageContent } from "@/features/companies/view/companies-page-content";
import { DashboardShell } from "@/features/dashboard/view/dashboard-shell";

export const metadata: Metadata = {
  title: "Companies | HireMind",
};

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const [profile, rows] = await Promise.all([getDashboardProfile(), getCompaniesForSession()]);
  if (!profile || !rows) {
    redirect("/login");
  }

  return (
    <DashboardShell
      profile={profile}
      pageTitle="Companies"
      showWorkspaceGreeting={false}
      showHeaderCreateInterview={false}
    >
      <CompaniesPageContent rows={rows} />
    </DashboardShell>
  );
}
