"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { getAuthSession } from "@/lib/auth-session";
import { updateCompanySchema } from "@/features/companies/model/update-company.schema";

export type UpdateCompanyFormState = {
  fields?: {
    companyId?: string;
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
};

export async function updateCompanyAction(
  _prevState: UpdateCompanyFormState,
  formData: FormData
): Promise<UpdateCompanyFormState> {
  const session = await getAuthSession();
  if (!session) {
    return { errors: { form: ["You must be signed in."] } };
  }

  const companyId = String(formData.get("companyId") ?? "").trim();
  const owned = await prisma.companiesUser.findFirst({
    where: { id: companyId, createdByUserId: session.userId },
    select: { id: true },
  });
  if (!owned) {
    return { errors: { form: ["Company not found or you do not have access."] } };
  }

  const passwordRaw = String(formData.get("password") ?? "").trim();
  const parsed = updateCompanySchema.safeParse({
    companyId,
    companyName: formData.get("companyName"),
    city: formData.get("city"),
    state: formData.get("state"),
    email: formData.get("email"),
    password: passwordRaw.length > 0 ? passwordRaw : undefined,
  });

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return {
      fields: {
        companyId,
        companyName: String(formData.get("companyName") ?? ""),
        city: String(formData.get("city") ?? ""),
        state: String(formData.get("state") ?? ""),
        email: String(formData.get("email") ?? ""),
      },
      errors: fieldErrors as UpdateCompanyFormState["errors"],
    };
  }

  const emailLower = parsed.data.email.trim().toLowerCase();
  const duplicate = await prisma.companiesUser.findFirst({
    where: {
      email: emailLower,
      NOT: { id: parsed.data.companyId },
    },
    select: { id: true },
  });
  if (duplicate) {
    return {
      fields: {
        companyId,
        companyName: parsed.data.companyName,
        city: parsed.data.city,
        state: parsed.data.state,
        email: parsed.data.email,
      },
      errors: { email: ["Another company account already uses this email"] },
    };
  }

  const passwordTrimmed = parsed.data.password?.trim() ?? "";
  const hashedNew =
    passwordTrimmed.length >= 8 ? await hashPassword(passwordTrimmed) : null;

  await prisma.companiesUser.update({
    where: { id: parsed.data.companyId },
    data: {
      companyName: parsed.data.companyName.trim(),
      city: parsed.data.city.trim(),
      state: parsed.data.state.trim(),
      email: emailLower,
      ...(hashedNew
        ? { password: hashedNew, setPasswordAfterFirstLogin: false }
        : {}),
    },
  });

  return { success: true };
}

export type DeleteCompanyState = {
  error?: string;
  success?: boolean;
};

export async function deleteCompanyAction(
  _prevState: DeleteCompanyState,
  formData: FormData
): Promise<DeleteCompanyState> {
  const session = await getAuthSession();
  if (!session) {
    return { error: "You must be signed in." };
  }

  const companyId = String(formData.get("companyId") ?? "").trim();
  if (!companyId) {
    return { error: "Missing company." };
  }

  const owned = await prisma.companiesUser.findFirst({
    where: { id: companyId, createdByUserId: session.userId },
    select: { id: true },
  });
  if (!owned) {
    return { error: "Company not found or you do not have access." };
  }

  await prisma.companiesUser.delete({
    where: { id: companyId },
  });

  return { success: true };
}
