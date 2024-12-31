-- CreateTable
CREATE TABLE "applications" (
    "id" SERIAL NOT NULL,
    "jobSeekerInfoId" INTEGER NOT NULL,
    "employerInfoId" INTEGER NOT NULL,
    "jobInfoId" INTEGER NOT NULL,
    "deletedBy" JSONB DEFAULT '{}',

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_seeker_info" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "coverLetter" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'Job Seeker',
    "resume" JSONB,

    CONSTRAINT "job_seeker_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employer_info" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'Employer',

    CONSTRAINT "employer_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobInfo" (
    "id" SERIAL NOT NULL,
    "jobTitle" TEXT NOT NULL,

    CONSTRAINT "JobInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "job_seeker_info_email_key" ON "job_seeker_info"("email");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_jobSeekerInfoId_fkey" FOREIGN KEY ("jobSeekerInfoId") REFERENCES "job_seeker_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_employerInfoId_fkey" FOREIGN KEY ("employerInfoId") REFERENCES "employer_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_jobInfoId_fkey" FOREIGN KEY ("jobInfoId") REFERENCES "JobInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
