import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long"),
  companyRole: z.string().trim().min(1, "Company role is required"),
  privilageRole: z.string().trim().min(1, "Privilage role is required"),
  setPasswordAfterFirstLogin: z.boolean().default(false),
});

export type RegisterInput = z.infer<typeof registerSchema>;
