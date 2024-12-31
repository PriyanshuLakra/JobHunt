/*
  Warnings:

  - You are about to drop the column `ApplieduserId` on the `JobInfo` table. All the data in the column will be lost.
  - Added the required column `jobId` to the `JobInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `forWhichJob` to the `job_seeker_info` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "JobInfo" DROP CONSTRAINT "JobInfo_ApplieduserId_fkey";

-- AlterTable
ALTER TABLE "JobInfo" DROP COLUMN "ApplieduserId",
ADD COLUMN     "jobId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "job_seeker_info" ADD COLUMN     "forWhichJob" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "job_seeker_info" ADD CONSTRAINT "job_seeker_info_forWhichJob_fkey" FOREIGN KEY ("forWhichJob") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobInfo" ADD CONSTRAINT "JobInfo_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
