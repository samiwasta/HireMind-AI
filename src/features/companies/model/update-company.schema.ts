import { z } from "zod";

export const updateCompanySchema = z
  .object({
    companyId: z.string().min(1),
    companyName: z.string().trim().min(1, "Company name is required").max(200),
    city: z.string().trim().min(1, "City is required").max(120),
    state: z.string().trim().min(1, "State is required").max(80),
    email: z.email("Enter a valid company email"),
    password: z.string().max(128).optional(),
  })
  .superRefine((data, ctx) => {
    const p = data.password?.trim() ?? "";
    if (p.length > 0 && p.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must be at least 8 characters, or leave blank to keep the current password",
        path: ["password"],
      });
    }
  });

export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
