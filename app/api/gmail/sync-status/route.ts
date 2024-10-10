import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ isSynced: false });
    }

    return NextResponse.json({
      isSynced: user.gmailSynced,
      lastSyncTime: user.lastSyncTime,
    });
  } catch (error) {
    console.error('Error checking Gmail sync status:', error);
    return NextResponse.json({ error: 'Failed to check Gmail sync status' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}