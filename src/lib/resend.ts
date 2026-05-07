import { Resend } from "resend";

export function getResendClient() {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return null;
  }

  return new Resend(resendApiKey);
}
