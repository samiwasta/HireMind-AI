import type { Metadata } from "next";
import { CompanySetPasswordForm } from "@/features/companies/view/company-set-password-form";

export const metadata: Metadata = {
  title: "Set company password | HireMind",
};

type PageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function CompanySetPasswordPage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <CompanySetPasswordForm token={typeof token === "string" ? token : ""} />
    </main>
  );
}
