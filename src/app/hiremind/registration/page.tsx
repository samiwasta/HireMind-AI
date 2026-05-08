import type { Metadata } from "next";

import { RegistrationForm } from "@/features/auth/view/registration-form";
import { requireHireMindAdminRegistrationAccess } from "@/lib/require-hiremind-admin";

export const metadata: Metadata = {
  title: "Register HireMind user | HireMind AI",
  description: "Create a HireMind team user (admin only)",
};

export default async function HireMindRegistrationPage() {
  await requireHireMindAdminRegistrationAccess();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <RegistrationForm />
    </main>
  );
}
