import { z } from "zod";

export const candidateRegistrationSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(120),
  lastName: z.string().trim().min(1, "Last name is required").max(120),
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

export type CandidateRegistrationInput = z.infer<typeof candidateRegistrationSchema>;
