import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getOAuth2Client } from '@/lib/google-auth';

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const oauth2Client = getOAuth2Client();
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.modify'],
    prompt: 'consent',
  });

  return NextResponse.json({ url: authUrl });
}