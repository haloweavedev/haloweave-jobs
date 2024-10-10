import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { disconnectGmail } from '@/lib/google-auth';

export async function POST() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    await disconnectGmail(userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error disconnecting Gmail:', error);
    return NextResponse.json({ error: 'Failed to disconnect Gmail' }, { status: 500 });
  }
}