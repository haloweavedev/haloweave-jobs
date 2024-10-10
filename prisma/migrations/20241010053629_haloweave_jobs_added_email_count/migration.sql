-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastSyncTime" TIMESTAMP(3),
ADD COLUMN     "sentEmailCount" INTEGER NOT NULL DEFAULT 0;
