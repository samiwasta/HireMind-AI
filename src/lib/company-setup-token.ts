import { SignJWT, jwtVerify } from "jose";

const ISSUER = "hiremind-company-setup";

function getSecret() {
  const secret =
    process.env.AUTH_JWT_SECRET ??
    (process.env.NODE_ENV !== "production" ? "dev-only-insecure-jwt-secret" : undefined);
  if (!secret) {
    throw new Error("Missing AUTH_JWT_SECRET environment variable");
  }
  return new TextEncoder().encode(secret);
}

export async function createCompanySetupToken(companyUserId: string) {
  return new SignJWT({ iss: ISSUER })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(companyUserId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyCompanySetupToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), { issuer: ISSUER });
    if (typeof payload.sub !== "string") {
      return null;
    }
    return payload.sub;
  } catch {
    return null;
  }
}
