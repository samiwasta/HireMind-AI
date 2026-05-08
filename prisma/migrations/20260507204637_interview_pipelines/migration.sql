-- CreateEnum
CREATE TYPE "AssessmentDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "InterviewPipelineStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ParticipationStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'SHORTLISTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "QuestionKind" AS ENUM ('TEXT', 'MCQ', 'LONG_ANSWER');

-- CreateTable
CREATE TABLE "InterviewPipeline" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "description" TEXT,
    "experienceLevel" TEXT,
    "durationMinutes" INTEGER NOT NULL DEFAULT 45,
    "difficulty" "AssessmentDifficulty" NOT NULL DEFAULT 'MEDIUM'::"AssessmentDifficulty",
    "status" "InterviewPipelineStatus" NOT NULL DEFAULT 'DRAFT'::"InterviewPipelineStatus",
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "allowResumeUpload" BOOLEAN NOT NULL DEFAULT true,
    "autoAIEvaluation" BOOLEAN NOT NULL DEFAULT true,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewPipeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewQuestion" (
    "id" TEXT NOT NULL,
    "pipelineId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "text" TEXT NOT NULL,
    "questionType" "QuestionKind" NOT NULL DEFAULT 'TEXT'::"QuestionKind",
    "difficulty" "AssessmentDifficulty" NOT NULL DEFAULT 'MEDIUM'::"AssessmentDifficulty",
    "expectedKeywords" TEXT,
    "mcqOptionsJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewParticipation" (
    "id" TEXT NOT NULL,
    "pipelineId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "status" "ParticipationStatus" NOT NULL DEFAULT 'PENDING'::"ParticipationStatus",
    "aiScore" INTEGER,
    "recommendation" TEXT,
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewParticipation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InterviewParticipation_pipelineId_candidateId_key" ON "InterviewParticipation"("pipelineId", "candidateId");

-- CreateIndex
CREATE INDEX "InterviewParticipation_candidateId_idx" ON "InterviewParticipation"("candidateId");

-- CreateIndex
CREATE INDEX "InterviewParticipation_pipelineId_idx" ON "InterviewParticipation"("pipelineId");

-- CreateIndex
CREATE INDEX "InterviewPipeline_ownerId_status_idx" ON "InterviewPipeline"("ownerId", "status");

-- CreateIndex
CREATE INDEX "InterviewQuestion_pipelineId_sortOrder_idx" ON "InterviewQuestion"("pipelineId", "sortOrder");

-- AddForeignKey
ALTER TABLE "InterviewPipeline" ADD CONSTRAINT "InterviewPipeline_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewQuestion" ADD CONSTRAINT "InterviewQuestion_pipelineId_fkey" FOREIGN KEY ("pipelineId") REFERENCES "InterviewPipeline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewParticipation" ADD CONSTRAINT "InterviewParticipation_pipelineId_fkey" FOREIGN KEY ("pipelineId") REFERENCES "InterviewPipeline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewParticipation" ADD CONSTRAINT "InterviewParticipation_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
