import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth-session";

const ADMIN_COMPANY_ROLE = "Admin";

export async function requireHireMindAdminRegistrationAccess() {
  const session = await getAuthSession();
  if (!session) {
    redirect(`/login?next=${encodeURIComponent("/hiremind/registration")}`);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { companyRole: true },
  });

  if (!user || user.companyRole !== ADMIN_COMPANY_ROLE) {
    redirect("/overview");
  }
}
