/*
  Warnings:

  - You are about to drop the column `userId` on the `job_seeker_info` table. All the data in the column will be lost.
  - Added the required column `ApplieduserId` to the `JobInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `EmployeruserId` to the `employer_info` table without a default value. This is not possible if the table is not empty.
  - Added the required column `JobSeekeruserId` to the `job_seeker_info` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "job_seeker_info" DROP CONSTRAINT "job_seeker_info_userId_fkey";

-- DropIndex
DROP INDEX "job_seeker_info_email_key";

-- AlterTable
ALTER TABLE "JobInfo" ADD COLUMN     "ApplieduserId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "employer_info" ADD COLUMN     "EmployeruserId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "job_seeker_info" DROP COLUMN "userId",
ADD COLUMN     "JobSeekeruserId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "job_seeker_info" ADD CONSTRAINT "job_seeker_info_JobSeekeruserId_fkey" FOREIGN KEY ("JobSeekeruserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employer_info" ADD CONSTRAINT "employer_info_EmployeruserId_fkey" FOREIGN KEY ("EmployeruserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobInfo" ADD CONSTRAINT "JobInfo_ApplieduserId_fkey" FOREIGN KEY ("ApplieduserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
