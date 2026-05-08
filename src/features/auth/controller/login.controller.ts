"use server";

import { loginSchema } from "@/features/auth/model/login.schema";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { setAuthSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";

export type LoginFormState = {
  fields?: {
    email?: string;
  };
  errors?: {
    email?: string[];
    password?: string[];
    form?: string[];
  };
  success?: boolean;
};

export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return {
      fields: {
        email: String(formData.get("email") ?? ""),
      },
      errors: {
        email: fieldErrors.email,
        password: fieldErrors.password,
      },
      success: false,
    };
  }

  const emailLower = parsed.data.email.trim().toLowerCase();
  const [hiremindUser, companyUser, candidateUser] = await Promise.all([
    prisma.user.findUnique({
      where: { email: emailLower },
      select: {
        id: true,
        password: true,
        setPasswordAfterFirstLogin: true,
      },
    }),
    prisma.companiesUser.findUnique({
      where: { email: emailLower },
      select: {
        id: true,
        password: true,
        setPasswordAfterFirstLogin: true,
      },
    }),
    prisma.candidate.findUnique({
      where: { email: emailLower },
      select: {
        id: true,
        password: true,
      },
    }),
  ]);

  const rawCallback = String(formData.get("callbackUrl") ?? "").trim();
  const callbackUrl =
    rawCallback.startsWith("/") && !rawCallback.startsWith("//") ? rawCallback : null;

  if (hiremindUser) {
    const isValidPassword = await verifyPassword(parsed.data.password, hiremindUser.password);
    if (isValidPassword) {
      if (hiremindUser.setPasswordAfterFirstLogin) {
        redirect(`/set-password?email=${encodeURIComponent(emailLower)}`);
      }

      await setAuthSession({ sub: hiremindUser.id, email: emailLower, accountType: "hiremind" });
      if (callbackUrl) {
        redirect(callbackUrl);
      }
      redirect("/overview");
    }
  }

  if (companyUser) {
    const isValidPassword = await verifyPassword(parsed.data.password, companyUser.password);
    if (isValidPassword) {
      if (companyUser.setPasswordAfterFirstLogin) {
        return {
          fields: { email: emailLower },
          errors: {
            form: ["Set your password using the email link sent during onboarding before signing in."],
          },
          success: false,
        };
      }

      await setAuthSession({ sub: companyUser.id, email: emailLower, accountType: "company" });
      redirect("/company");
    }
  }

  if (candidateUser?.password) {
    const isValidPassword = await verifyPassword(parsed.data.password, candidateUser.password);
    if (isValidPassword) {
      await setAuthSession({ sub: candidateUser.id, email: emailLower, accountType: "candidate" });
      redirect("/candidate");
    }
  }

  return {
    fields: {
      email: parsed.data.email,
    },
    errors: {
      form: ["Invalid email or password"],
    },
    success: false,
  };
}
