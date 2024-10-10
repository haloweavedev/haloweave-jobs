/*
  Warnings:

  - You are about to drop the column `resumeData` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "resumeData",
ADD COLUMN     "resumeAnalysis" JSONB,
ADD COLUMN     "resumeText" TEXT;
