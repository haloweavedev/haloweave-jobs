import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { auth, clerkClient } from '@clerk/nextjs/server';

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    const gmailTokens = user.privateMetadata.gmailTokens;

    if (!gmailTokens) {
      return NextResponse.json({ error: 'Gmail not synced' }, { status: 400 });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials(gmailTokens);

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: 'in:sent',
    });

    const count = response.data.messages?.length || 0;
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching email count:', error);
    return NextResponse.json({ error: 'Failed to fetch email count' }, { status: 500 });
  }
}