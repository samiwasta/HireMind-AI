"use server";

import { z } from "zod";

import { ResetPasswordEmail } from "@/features/auth/view/emails/reset-password-email";
import { getResendClient } from "@/lib/resend";

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export type ForgotPasswordFormState = {
  email?: string;
  errors?: {
    email?: string[];
    form?: string[];
  };
  success?: boolean;
};

export async function forgotPasswordAction(
  _prevState: ForgotPasswordFormState,
  formData: FormData
): Promise<ForgotPasswordFormState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return {
      email: String(formData.get("email") ?? ""),
      errors: { email: fieldErrors.email },
      success: false,
    };
  }

  const resend = getResendClient();
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!resend || !fromEmail) {
    return {
      email: parsed.data.email,
      errors: {
        form: ["Email service is not configured. Add RESEND_API_KEY and RESEND_FROM_EMAIL."],
      },
      success: false,
    };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const resetLink = `${appUrl}/reset-password?email=${encodeURIComponent(parsed.data.email)}`;

  await resend.emails.send({
    from: fromEmail,
    to: parsed.data.email,
    subject: "Reset your HireMind AI password",
    react: ResetPasswordEmail({
      userEmail: parsed.data.email,
      resetLink,
    }),
  });

  return {
    email: parsed.data.email,
    success: true,
  };
}
