import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Company dashboard | HireMind AI",
};

export default async function CompanyDashboardPage() {
  const session = await getAuthSession();
  if (!session || session.accountType !== "company") {
    redirect("/login");
  }

  const company = await prisma.companiesUser.findUnique({
    where: { id: session.userId },
    select: {
      companyName: true,
      city: true,
      state: true,
      email: true,
    },
  });

  if (!company) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-semibold text-foreground">{company.companyName}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Welcome to your company dashboard. We will surface interviews, candidates, and account settings here.
      </p>
      <div className="mt-6 space-y-1 text-sm text-muted-foreground">
        <p>{company.email}</p>
        <p>
          {company.city}, {company.state}
        </p>
      </div>
    </main>
  );
}
