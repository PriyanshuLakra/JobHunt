-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('FullTime', 'PartTime');

-- CreateEnum
CREATE TYPE "YesNo" AS ENUM ('Yes', 'No');

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "jobType" "JobType" NOT NULL,
    "location" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "introduction" TEXT,
    "responsibilities" TEXT NOT NULL,
    "qualifications" TEXT NOT NULL,
    "offers" TEXT,
    "salary" TEXT NOT NULL,
    "hiringMultipleCandidates" "YesNo" NOT NULL,
    "personalWebsite" JSONB,
    "jobNiche" TEXT NOT NULL,
    "newsLettersSent" BOOLEAN NOT NULL DEFAULT false,
    "jobPostedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postedById" INTEGER NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_postedById_fkey" FOREIGN KEY ("postedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
