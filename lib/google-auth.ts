import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SCOPES = ['https://www.googleapis.com/auth/gmail.modify'];

export function getOAuth2Client(): OAuth2Client {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/gmail/callback`
  );
}

export async function getGmailClient(userId: string) {
  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user || !user.gmailToken) {
    throw new Error('User not found or Gmail not connected');
  }

  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({
    access_token: user.gmailToken,
    refresh_token: user.gmailRefreshToken,
  });

  oauth2Client.on('tokens', async (tokens) => {
    if (tokens.access_token) {
      await prisma.user.update({
        where: { clerkId: userId },
        data: { gmailToken: tokens.access_token },
      });
    }
    if (tokens.refresh_token) {
      await prisma.user.update({
        where: { clerkId: userId },
        data: { gmailRefreshToken: tokens.refresh_token },
      });
    }
  });

  try {
    await oauth2Client.getAccessToken();
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw new Error('Failed to refresh Google token');
  }

  return google.gmail({ version: 'v1', auth: oauth2Client });
}

export async function disconnectGmail(userId: string) {
  await prisma.user.update({
    where: { clerkId: userId },
    data: {
      gmailSynced: false,
      gmailToken: null,
      gmailRefreshToken: null,
      lastSyncTime: null,
    },
  });
}