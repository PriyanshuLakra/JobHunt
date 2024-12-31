/*
  Warnings:

  - You are about to drop the column `coverLetter` on the `job_seeker_info` table. All the data in the column will be lost.
  - Added the required column `coverletter` to the `job_seeker_info` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "job_seeker_info" DROP COLUMN "coverLetter",
ADD COLUMN     "coverletter" TEXT NOT NULL;
