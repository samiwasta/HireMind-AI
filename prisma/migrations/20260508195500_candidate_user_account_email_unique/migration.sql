ALTER TABLE "Candidate" DROP CONSTRAINT IF EXISTS "Candidate_ownerId_email_key";

ALTER TABLE "Candidate" ALTER COLUMN "ownerId" DROP NOT NULL;

ALTER TABLE "Candidate" ADD COLUMN "userId" TEXT;

CREATE UNIQUE INDEX "Candidate_userId_key" ON "Candidate"("userId");

ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "HireMind_User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE UNIQUE INDEX "Candidate_email_key" ON "Candidate"("email");
