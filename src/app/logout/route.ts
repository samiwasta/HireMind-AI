import { NextResponse } from "next/server";

import { clearAuthSession } from "@/lib/auth-session";

export async function GET(request: Request) {
  await clearAuthSession();
  return NextResponse.redirect(new URL("/login", request.url));
}
