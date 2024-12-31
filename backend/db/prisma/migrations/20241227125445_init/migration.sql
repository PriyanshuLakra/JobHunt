-- AlterTable
ALTER TABLE "employer_info" ADD COLUMN     "jobPostedId" INTEGER;

-- AddForeignKey
ALTER TABLE "employer_info" ADD CONSTRAINT "employer_info_jobPostedId_fkey" FOREIGN KEY ("jobPostedId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
