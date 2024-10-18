-- CreateTable
CREATE TABLE "JobPreference" (
    "id" TEXT NOT NULL,
    "pushSubscriptionId" TEXT NOT NULL,
    "jobTitle" TEXT,
    "company" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobPreference_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JobPreference" ADD CONSTRAINT "JobPreference_pushSubscriptionId_fkey" FOREIGN KEY ("pushSubscriptionId") REFERENCES "PushSubscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
