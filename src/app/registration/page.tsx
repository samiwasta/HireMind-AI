import type { Metadata } from "next";

import { CandidateRegistrationForm } from "@/features/candidates/view/candidate-registration-form";

export const metadata: Metadata = {
  title: "Candidate registration | HireMind AI",
  description: "Register as a candidate on HireMind",
};

export default function CandidateRegistrationPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <CandidateRegistrationForm />
    </main>
  );
}
