ALTER TABLE "Companies_User" ADD COLUMN "setPasswordAfterFirstLogin" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "Companies_User" ADD COLUMN "createdByUserId" TEXT;

CREATE INDEX "Companies_User_createdByUserId_idx" ON "Companies_User"("createdByUserId");

ALTER TABLE "Companies_User" ADD CONSTRAINT "Companies_User_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "HireMind_User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
