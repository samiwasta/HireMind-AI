-- Table mapped from model User -> @@map("HireMind_User")
ALTER TABLE "User" RENAME TO "HireMind_User";

ALTER INDEX "User_email_key" RENAME TO "HireMind_User_email_key";

ALTER TABLE "HireMind_User" RENAME CONSTRAINT "User_pkey" TO "HireMind_User_pkey";

CREATE TABLE "Companies_User" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Companies_User_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Companies_User_userId_idx" ON "Companies_User"("userId");

ALTER TABLE "Companies_User" ADD CONSTRAINT "Companies_User_userId_fkey" FOREIGN KEY ("userId") REFERENCES "HireMind_User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
