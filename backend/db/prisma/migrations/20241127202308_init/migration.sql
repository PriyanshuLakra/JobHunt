-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('JobSeeker', 'Employer');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "niches" JSONB NOT NULL,
    "password" TEXT NOT NULL,
    "resume" JSONB,
    "coverletter" TEXT,
    "role" "ROLE" NOT NULL,
    "createdAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_password_key" ON "User"("password");
