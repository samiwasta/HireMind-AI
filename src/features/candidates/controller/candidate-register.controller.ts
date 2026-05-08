"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { candidateRegistrationSchema } from "@/features/candidates/model/candidate-registration.schema";
import { CandidateAccountCreatedEmail } from "@/features/candidates/view/emails/candidate-account-created-email";
import { getResendClient } from "@/lib/resend";

export type CandidateRegistrationFormState = {
  fields?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  errors?: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    password?: string[];
    resumeUrl?: string[];
    form?: string[];
  };
  success?: boolean;
};

const CANDIDATE_EMAIL_TAKEN = "A candidate with this email is already registered";

async function messageForUniqueEmailConflict(emailLower: string) {
  const candidateRow = await prisma.candidate.findUnique({
    where: { email: emailLower },
    select: { id: true },
  });
  if (candidateRow) {
    return CANDIDATE_EMAIL_TAKEN;
  }
  return "This email could not be registered right now. Please try again in a moment.";
}

function isPrismaUniqueConstraintError(e: unknown) {
  return typeof e === "object" && e !== null && "code" in e && (e as { code: string }).code === "P2002";
}

function isAllowedResumeUrl(url: string) {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:" && u.protocol !== "http:") {
      return false;
    }
    const host = u.hostname.toLowerCase();
    return (
      host.endsWith("uploadthing.com") ||
      host.endsWith("utfs.io") ||
      host.endsWith(".ufs.sh") ||
      host === "ufs.sh" ||
      host === "localhost"
    );
  } catch {
    return false;
  }
}

export async function candidateRegistrationAction(
  _prevState: CandidateRegistrationFormState,
  formData: FormData
): Promise<CandidateRegistrationFormState> {
  const resumeUrlRaw = String(formData.get("resumeUrl") ?? "").trim();

  const parsed = candidateRegistrationSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return {
      fields: {
        firstName: String(formData.get("firstName") ?? ""),
        lastName: String(formData.get("lastName") ?? ""),
        email: String(formData.get("email") ?? ""),
      },
      errors: fieldErrors as CandidateRegistrationFormState["errors"],
      success: false,
    };
  }

  if (!resumeUrlRaw) {
    return {
      fields: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email: parsed.data.email,
      },
      errors: { resumeUrl: ["Upload your resume (PDF) using the button above"] },
      success: false,
    };
  }

  if (!isAllowedResumeUrl(resumeUrlRaw)) {
    return {
      fields: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email: parsed.data.email,
      },
      errors: {
        resumeUrl: [
          "Resume link was not recognized. Try uploading again, or contact support if the issue continues.",
        ],
      },
      success: false,
    };
  }

  const emailLower = parsed.data.email.trim().toLowerCase();

  const existingCandidate = await prisma.candidate.findUnique({
    where: { email: emailLower },
    select: { id: true },
  });
  if (existingCandidate) {
    return {
      fields: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email: parsed.data.email,
      },
      errors: { email: [CANDIDATE_EMAIL_TAKEN] },
      success: false,
    };
  }

  try {
    await prisma.candidate.create({
      data: {
        firstName: parsed.data.firstName.trim(),
        lastName: parsed.data.lastName.trim(),
        email: emailLower,
        resumeUrl: resumeUrlRaw,
        ownerId: null,
      },
    });
  } catch (e) {
    if (isPrismaUniqueConstraintError(e)) {
      const message = await messageForUniqueEmailConflict(emailLower);
      return {
        fields: {
          firstName: parsed.data.firstName,
          lastName: parsed.data.lastName,
          email: parsed.data.email,
        },
        errors: { email: [message] },
        success: false,
      };
    }
    throw e;
  }

  const resend = getResendClient();
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (resend && fromEmail) {
    try {
      const { error } = await resend.emails.send({
        from: fromEmail,
        to: emailLower,
        subject: "Your HireMind candidate account is ready",
        react: CandidateAccountCreatedEmail({
          fullName: `${parsed.data.firstName.trim()} ${parsed.data.lastName.trim()}`,
          email: emailLower,
          loginLink: `${appUrl}/login`,
        }),
      });
      if (error) {
        console.error("Candidate registration email failed", {
          candidateEmail: emailLower,
          resendError: error,
        });
      }
    } catch (error) {
      console.error("Candidate registration email request failed", {
        candidateEmail: emailLower,
        error,
      });
    }
  }

  redirect("/login");
}
