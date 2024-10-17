/*
  Warnings:

  - Added the required column `sentDate` to the `JobAlert` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobAlert" ADD COLUMN     "labels" TEXT[],
ADD COLUMN     "sentDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "toRecipients" TEXT[];
