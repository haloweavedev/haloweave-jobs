-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gmailSynced" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "gmailToken" TEXT;
