"use server";

import { prisma } from "@/lib/prisma";
import { generateTemporaryPassword, hashPassword } from "@/lib/password";
import { getAuthSession } from "@/lib/auth-session";
import { createCompanySetupToken } from "@/lib/company-setup-token";
import { createCompanySchema } from "@/features/companies/model/create-company.schema";
import { CompanyAccountCreatedEmail } from "@/features/companies/view/emails/company-account-created-email";
import { getResendClient } from "@/lib/resend";

export type CreateCompanyFormState = {
  fields?: {
    companyName?: string;
    city?: string;
    state?: string;
    email?: string;
  };
  errors?: {
    companyName?: string[];
    city?: string[];
    state?: string[];
    email?: string[];
    password?: string[];
    form?: string[];
  };
  success?: boolean;
  emailSent?: boolean;
};

export async function createCompanyAction(
  _prevState: CreateCompanyFormState,
  formData: FormData
): Promise<CreateCompanyFormState> {
  const session = await getAuthSession();
  if (!session) {
    return { errors: { form: ["You must be signed in to create a company."] } };
  }

  const passwordRaw = String(formData.get("password") ?? "").trim();
  const parsed = createCompanySchema.safeParse({
    companyName: formData.get("companyName"),
    city: formData.get("city"),
    state: formData.get("state"),
    email: formData.get("email"),
  });

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return {
      fields: {
        companyName: String(formData.get("companyName") ?? ""),
        city: String(formData.get("city") ?? ""),
        state: String(formData.get("state") ?? ""),
        email: String(formData.get("email") ?? ""),
      },
      errors: fieldErrors as CreateCompanyFormState["errors"],
    };
  }

  if (passwordRaw.length > 0 && passwordRaw.length < 8) {
    return {
      fields: {
        companyName: parsed.data.companyName,
        city: parsed.data.city,
        state: parsed.data.state,
        email: parsed.data.email,
      },
      errors: { password: ["Password must be at least 8 characters, or leave empty to generate one"] },
    };
  }

  const plainPassword = passwordRaw.length > 0 ? passwordRaw : generateTemporaryPassword(14);

  const existing = await prisma.companiesUser.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
    select: { id: true },
  });
  if (existing) {
    return {
      fields: {
        companyName: parsed.data.companyName,
        city: parsed.data.city,
        state: parsed.data.state,
        email: parsed.data.email,
      },
      errors: { email: ["A company account already uses this email"] },
    };
  }

  const hashed = await hashPassword(plainPassword);

  const company = await prisma.companiesUser.create({
    data: {
      companyName: parsed.data.companyName.trim(),
      city: parsed.data.city.trim(),
      state: parsed.data.state.trim(),
      email: parsed.data.email.trim().toLowerCase(),
      password: hashed,
      setPasswordAfterFirstLogin: true,
      createdByUserId: session.userId,
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const token = await createCompanySetupToken(company.id);
  const setPasswordLink = `${appUrl}/companies/set-password?token=${encodeURIComponent(token)}`;

  let emailSent = false;
  const resend = getResendClient();
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (resend && fromEmail) {
    try {
      await resend.emails.send({
        from: fromEmail,
        to: company.email,
        subject: `${company.companyName} — account created on HireMind`,
        react: CompanyAccountCreatedEmail({
          companyName: company.companyName,
          email: company.email,
          temporaryPassword: plainPassword,
          locationLine: `${company.city}, ${company.state}`,
          setPasswordLink,
        }),
      });
      emailSent = true;
    } catch {
      emailSent = false;
    }
  }

  return { success: true, emailSent };
}

export type CompaniesListRow = {
  id: string;
  companyName: string;
  city: string;
  state: string;
  email: string;
  createdAt: string;
};

export async function getCompaniesForSession(): Promise<CompaniesListRow[] | null> {
  const session = await getAuthSession();
  if (!session) return null;

  const rows = await prisma.companiesUser.findMany({
    where: { createdByUserId: session.userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      companyName: true,
      city: true,
      state: true,
      email: true,
      createdAt: true,
    },
  });

  return rows.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }));
}
