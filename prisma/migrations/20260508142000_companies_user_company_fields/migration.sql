ALTER TABLE "Companies_User" DROP CONSTRAINT "Companies_User_userId_fkey";

DROP INDEX "Companies_User_userId_idx";

ALTER TABLE "Companies_User" DROP COLUMN "userId";

ALTER TABLE "Companies_User" ADD COLUMN "company_name" TEXT NOT NULL;
ALTER TABLE "Companies_User" ADD COLUMN "city" TEXT NOT NULL;
ALTER TABLE "Companies_User" ADD COLUMN "state" TEXT NOT NULL;
ALTER TABLE "Companies_User" ADD COLUMN "email" TEXT NOT NULL;
ALTER TABLE "Companies_User" ADD COLUMN "password" TEXT NOT NULL;

CREATE UNIQUE INDEX "Companies_User_email_key" ON "Companies_User"("email");
