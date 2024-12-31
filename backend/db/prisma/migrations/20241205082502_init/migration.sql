/*
  Warnings:

  - Added the required column `userId` to the `job_seeker_info` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "job_seeker_info" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "job_seeker_info" ADD CONSTRAINT "job_seeker_info_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
