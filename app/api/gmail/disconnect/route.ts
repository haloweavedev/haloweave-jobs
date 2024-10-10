import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    await prisma.user.update({
      where: { clerkId: userId },
      data: {
        gmailToken: null,
        gmailRefreshToken: null,
        gmailSynced: false,
        lastSyncTime: null,
      },
    });

    return NextResponse.json({ success: true, message: 'Gmail disconnected successfully' });
  } catch (error) {
    console.error('Error disconnecting Gmail:', error);
    return NextResponse.json({ error: 'Failed to disconnect Gmail' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}