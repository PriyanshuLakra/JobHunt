/*
  Warnings:

  - You are about to drop the column `forWhichJob` on the `job_seeker_info` table. All the data in the column will be lost.
  - Added the required column `forWhichJobId` to the `job_seeker_info` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "job_seeker_info" DROP CONSTRAINT "job_seeker_info_forWhichJob_fkey";

-- AlterTable
ALTER TABLE "job_seeker_info" DROP COLUMN "forWhichJob",
ADD COLUMN     "forWhichJobId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "job_seeker_info" ADD CONSTRAINT "job_seeker_info_forWhichJobId_fkey" FOREIGN KEY ("forWhichJobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
