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

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: {
      id: true,
      password: true,
      setPasswordAfterFirstLogin: true,
    },
  });

  if (!user) {
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

  const isValidPassword = await verifyPassword(parsed.data.password, user.password);
  if (!isValidPassword) {
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

  if (user.setPasswordAfterFirstLogin) {
    redirect(`/set-password?email=${encodeURIComponent(parsed.data.email)}`);
  }

  await setAuthSession({ sub: user.id, email: parsed.data.email });
  redirect("/overview");
}
