import { Suspense } from "react";
import { SetPasswordForm } from "@/features/auth/view/set-password-form";

export default function SetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Suspense fallback={null}>
        <SetPasswordForm />
      </Suspense>
    </main>
  );
}
