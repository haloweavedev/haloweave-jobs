/*
  Warnings:

  - You are about to drop the column `companyName` on the `JobApplication` table. All the data in the column will be lost.
  - The `status` column on the `JobApplication` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `sentEmailCount` on the `User` table. All the data in the column will be lost.
  - Added the required column `company` to the `JobApplication` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('APPLIED', 'RESPONSE_RECEIVED', 'INTERVIEW_SCHEDULED', 'OFFER_RECEIVED', 'REJECTED', 'ACCEPTED');

-- AlterTable
ALTER TABLE "JobApplication" DROP COLUMN "companyName",
ADD COLUMN     "company" TEXT NOT NULL,
ADD COLUMN     "emailThreadId" TEXT,
ADD COLUMN     "lastResponseDate" TIMESTAMP(3),
ALTER COLUMN "jobTitle" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "ApplicationStatus" NOT NULL DEFAULT 'APPLIED';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "sentEmailCount";

-- CreateTable
CREATE TABLE "EmailThread" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "snippet" TEXT NOT NULL,
    "lastMessageDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Email" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT[],
    "subject" TEXT NOT NULL,
    "bodySnippet" TEXT NOT NULL,
    "sentDate" TIMESTAMP(3) NOT NULL,
    "received" BOOLEAN NOT NULL,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailThread_threadId_key" ON "EmailThread"("threadId");

-- CreateIndex
CREATE UNIQUE INDEX "Email_messageId_key" ON "Email"("messageId");

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_emailThreadId_fkey" FOREIGN KEY ("emailThreadId") REFERENCES "EmailThread"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailThread" ADD CONSTRAINT "EmailThread_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "EmailThread"("threadId") ON DELETE RESTRICT ON UPDATE CASCADE;
