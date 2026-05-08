import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function hasRequiredDelegates(client: PrismaClient) {
  const prismaAny = client as unknown as Record<string, unknown>;
  return (
    typeof prismaAny.user !== "undefined" &&
    typeof prismaAny.candidate !== "undefined" &&
    typeof prismaAny.interview !== "undefined" &&
    typeof prismaAny.aIEvaluation !== "undefined" &&
    typeof prismaAny.companiesUser !== "undefined"
  );
}

function createPrismaClient() {
  return new PrismaClient({
    adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

const cachedClient = globalForPrisma.prisma;
export const prisma =
  cachedClient && hasRequiredDelegates(cachedClient) ? cachedClient : createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
