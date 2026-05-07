"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { registerSchema } from "@/features/auth/model/register.schema";
import { NewUserCredentialsEmail } from "@/features/auth/view/emails/new-user-credentials-email";
import { getResendClient } from "@/lib/resend";

export type RegisterFormState = {
  fields?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    companyRole?: string;
    privilageRole?: string;
    setPasswordAfterFirstLogin?: boolean;
  };
  errors?: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    password?: string[];
    companyRole?: string[];
    privilageRole?: string[];
    form?: string[];
  };
  success?: boolean;
  emailSent?: boolean;
};

export async function registerAction(
  _prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const parsed = registerSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    companyRole: formData.get("companyRole"),
    privilageRole: formData.get("privilageRole"),
    setPasswordAfterFirstLogin: formData.get("setPasswordAfterFirstLogin") === "true",
  });

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return {
      fields: {
        firstName: String(formData.get("firstName") ?? ""),
        lastName: String(formData.get("lastName") ?? ""),
        email: String(formData.get("email") ?? ""),
        companyRole: String(formData.get("companyRole") ?? ""),
        privilageRole: String(formData.get("privilageRole") ?? ""),
        setPasswordAfterFirstLogin: formData.get("setPasswordAfterFirstLogin") === "true",
      },
      errors: {
        firstName: fieldErrors.firstName,
        lastName: fieldErrors.lastName,
        email: fieldErrors.email,
        password: fieldErrors.password,
        companyRole: fieldErrors.companyRole,
        privilageRole: fieldErrors.privilageRole,
      },
      success: false,
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true },
  });

  if (existingUser) {
    return {
      fields: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email: parsed.data.email,
        companyRole: parsed.data.companyRole,
        privilageRole: parsed.data.privilageRole,
        setPasswordAfterFirstLogin: parsed.data.setPasswordAfterFirstLogin,
      },
      errors: {
        email: ["A user with this email already exists"],
      },
      success: false,
    };
  }

  const hashedPassword = await hashPassword(parsed.data.password);

  await prisma.user.create({
    data: {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      password: hashedPassword,
      companyRole: parsed.data.companyRole,
      privilageRole: parsed.data.privilageRole,
      setPasswordAfterFirstLogin: parsed.data.setPasswordAfterFirstLogin,
    },
  });

  let emailSent = false;
  const resend = getResendClient();
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (resend && fromEmail) {
    try {
      await resend.emails.send({
        from: fromEmail,
        to: parsed.data.email,
        subject: "Your HireMind AI account credentials",
        react: NewUserCredentialsEmail({
          fullName: `${parsed.data.firstName} ${parsed.data.lastName}`,
          email: parsed.data.email,
          password: parsed.data.password,
          loginLink: `${appUrl}/login`,
        }),
      });
      emailSent = true;
    } catch {
      emailSent = false;
    }
  }

  return {
    fields: {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      companyRole: parsed.data.companyRole,
      privilageRole: parsed.data.privilageRole,
      setPasswordAfterFirstLogin: parsed.data.setPasswordAfterFirstLogin,
    },
    success: true,
    emailSent,
  };
}
