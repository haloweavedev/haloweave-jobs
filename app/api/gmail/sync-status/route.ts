import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { getGmailClient, getSentEmailCount } from '@/lib/google-auth';

const prisma = new PrismaClient();

const SYNC_INTERVAL = 60 * 60 * 1000; // 1 hour in milliseconds

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user || !user.gmailToken) {
      return NextResponse.json({ isSynced: false, count: null });
    }

    const now = new Date();
    if (!user.lastSyncTime || now.getTime() - user.lastSyncTime.getTime() > SYNC_INTERVAL) {
      const gmail = await getGmailClient(user.gmailToken);
      const count = await getSentEmailCount(gmail);

      await prisma.user.update({
        where: { clerkId: userId },
        data: {
          sentEmailCount: count,
          lastSyncTime: now,
        },
      });

      return NextResponse.json({ isSynced: true, count });
    } else {
      return NextResponse.json({ isSynced: true, count: user.sentEmailCount });
    }
  } catch (error) {
    console.error('Error checking Gmail sync status:', error);
    return NextResponse.json({ error: 'Failed to check Gmail sync status' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}