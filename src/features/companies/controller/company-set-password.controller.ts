"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { verifyCompanySetupToken } from "@/lib/company-setup-token";

const schema = z
  .object({
    token: z.string().min(1, "Invalid link"),
    newPassword: z.string().min(8, "Password must be at least 8 characters").max(128),
    confirmPassword: z.string().min(8).max(128),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type CompanySetPasswordFormState = {
  errors?: {
    newPassword?: string[];
    confirmPassword?: string[];
    form?: string[];
  };
};

export async function companySetPasswordAction(
  _prevState: CompanySetPasswordFormState,
  formData: FormData
): Promise<CompanySetPasswordFormState> {
  const parsed = schema.safeParse({
    token: formData.get("token"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return {
      errors: {
        newPassword: fieldErrors.newPassword,
        confirmPassword: fieldErrors.confirmPassword,
      },
    };
  }

  const companyId = await verifyCompanySetupToken(parsed.data.token);
  if (!companyId) {
    return { errors: { form: ["This link is invalid or has expired. Ask your recruiter to resend the invitation."] } };
  }

  const row = await prisma.companiesUser.findUnique({
    where: { id: companyId },
    select: { id: true, setPasswordAfterFirstLogin: true },
  });

  if (!row) {
    return { errors: { form: ["Company account not found"] } };
  }

  if (!row.setPasswordAfterFirstLogin) {
    return { errors: { form: ["Password has already been set. Sign in when company login is available."] } };
  }

  const hashed = await hashPassword(parsed.data.newPassword);
  await prisma.companiesUser.update({
    where: { id: companyId },
    data: {
      password: hashed,
      setPasswordAfterFirstLogin: false,
    },
  });

  redirect("/login");
}
