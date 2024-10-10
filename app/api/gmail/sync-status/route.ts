import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { getGmailClient } from '@/lib/google-auth';

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

    if (!user || !user.gmailToken) {
      return NextResponse.json({ isSynced: false, count: null });
    }

    const gmail = await getGmailClient(user.gmailToken);
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: 'in:sent',
    });

    const count = response.data.messages?.length || 0;

    return NextResponse.json({ isSynced: true, count });
  } catch (error) {
    console.error('Error checking Gmail sync status:', error);
    return NextResponse.json({ error: 'Failed to check Gmail sync status' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}