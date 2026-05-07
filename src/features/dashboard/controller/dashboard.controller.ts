import { prisma } from "@/lib/prisma";
import type { DashboardProfile } from "@/features/dashboard/model/dashboard.model";
import { getAuthSession } from "@/lib/auth-session";

export async function getDashboardProfile(): Promise<DashboardProfile | null> {
  const session = await getAuthSession();
  if (!session) {
    return null;
  }

  const profile = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      firstName: true,
      lastName: true,
      privilageRole: true,
    },
  });

  if (!profile) return null;

  return {
    name: `${profile.firstName} ${profile.lastName}`.trim(),
    role: profile.privilageRole,
  };
}
