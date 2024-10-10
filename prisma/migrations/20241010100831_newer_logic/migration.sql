/*
  Warnings:

  - You are about to drop the column `bodySnippet` on the `Email` table. All the data in the column will be lost.
  - You are about to drop the column `received` on the `Email` table. All the data in the column will be lost.
  - You are about to drop the column `emailThreadId` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `resumeAnalysis` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resumeData` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `EmailThread` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[emailId]` on the table `JobApplication` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `body` to the `Email` table without a default value. This is not possible if the table is not empty.
  - Added the required column `snippet` to the `Email` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Email` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emailId` to the `JobApplication` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Email" DROP CONSTRAINT "Email_threadId_fkey";

-- DropForeignKey
ALTER TABLE "EmailThread" DROP CONSTRAINT "EmailThread_userId_fkey";

-- DropForeignKey
ALTER TABLE "JobApplication" DROP CONSTRAINT "JobApplication_emailThreadId_fkey";

-- AlterTable
ALTER TABLE "Email" DROP COLUMN "bodySnippet",
DROP COLUMN "received",
ADD COLUMN     "body" TEXT NOT NULL,
ADD COLUMN     "isJobRelated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "labels" TEXT[],
ADD COLUMN     "receivedDate" TIMESTAMP(3),
ADD COLUMN     "snippet" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "JobApplication" DROP COLUMN "emailThreadId",
ADD COLUMN     "emailId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "resumeAnalysis",
DROP COLUMN "resumeData";

-- DropTable
DROP TABLE "EmailThread";

-- CreateIndex
CREATE UNIQUE INDEX "JobApplication_emailId_key" ON "JobApplication"("emailId");

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "Email"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
