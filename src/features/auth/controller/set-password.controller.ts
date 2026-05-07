"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

const setPasswordSchema = z
  .object({
    email: z.email("Enter a valid email address"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type SetPasswordFormState = {
  email?: string;
  errors?: {
    email?: string[];
    newPassword?: string[];
    confirmPassword?: string[];
    form?: string[];
  };
};

export async function setPasswordAction(
  _prevState: SetPasswordFormState,
  formData: FormData
): Promise<SetPasswordFormState> {
  const parsed = setPasswordSchema.safeParse({
    email: formData.get("email"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return {
      email: String(formData.get("email") ?? ""),
      errors: {
        email: fieldErrors.email,
        newPassword: fieldErrors.newPassword,
        confirmPassword: fieldErrors.confirmPassword,
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true },
  });

  if (!user) {
    return {
      email: parsed.data.email,
      errors: {
        form: ["User not found"],
      },
    };
  }

  const hashedPassword = await hashPassword(parsed.data.newPassword);
  await prisma.user.update({
    where: { email: parsed.data.email },
    data: {
      password: hashedPassword,
      setPasswordAfterFirstLogin: false,
    },
  });

  redirect("/login");
}
