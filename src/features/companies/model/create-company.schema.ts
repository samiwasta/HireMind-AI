import { z } from "zod";

export const createCompanySchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required").max(200),
  city: z.string().trim().min(1, "City is required").max(120),
  state: z.string().trim().min(1, "State is required").max(80),
  email: z.email("Enter a valid company email"),
  password: z.string().max(128).optional(),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
