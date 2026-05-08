import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/view/login-form";

export const metadata: Metadata = {
  title: "Login | HireMind AI",
  description: "Login to your HireMind AI account",
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <LoginForm redirectTo={next} />
    </main>
  );
}
