import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { cache } from "react";

const AUTH_COOKIE_NAME = "hiremind_auth";

type AuthTokenPayload = {
  sub: string;
  email: string;
  accountType: "hiremind" | "company" | "candidate";
};

function getJwtSecret() {
  const secret =
    process.env.AUTH_JWT_SECRET ??
    (process.env.NODE_ENV !== "production" ? "dev-only-insecure-jwt-secret" : undefined);
  if (!secret) {
    throw new Error("Missing AUTH_JWT_SECRET environment variable");
  }
  return new TextEncoder().encode(secret);
}

export async function createAuthToken(payload: AuthTokenPayload) {
  return new SignJWT({ email: payload.email, accountType: payload.accountType })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function setAuthSession(payload: AuthTokenPayload) {
  const token = await createAuthToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthSession() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export const getAuthSession = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    const sub = payload.sub;
    const email = typeof payload.email === "string" ? payload.email : null;
    const accountType =
      payload.accountType === "hiremind" || payload.accountType === "company" || payload.accountType === "candidate"
        ? payload.accountType
        : "hiremind";
    if (!sub || !email) {
      return null;
    }
    return { userId: sub, email, accountType };
  } catch {
    return null;
  }
});
