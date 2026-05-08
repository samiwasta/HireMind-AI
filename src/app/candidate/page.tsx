import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Candidate home | HireMind AI",
};

export default async function CandidateHomePage() {
  const session = await getAuthSession();
  if (!session || session.accountType !== "candidate") {
    redirect("/login");
  }

  const candidate = await prisma.candidate.findUnique({
    where: { id: session.userId },
    select: { firstName: true, lastName: true },
  });

  if (!candidate) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-16">
      <h1 className="text-2xl font-semibold text-foreground">
        Hi {candidate.firstName} {candidate.lastName}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Your candidate workspace will appear here as we connect interviews and applications.
      </p>
    </main>
  );
}
