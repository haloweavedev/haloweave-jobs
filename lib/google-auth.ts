import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const SCOPES = ['https://www.googleapis.com/auth/gmail.modify'];

export function getOAuth2Client(): OAuth2Client {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/gmail/callback`
  );
}

export async function getGmailClient(accessToken: string) {
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });
  
  return google.gmail({ version: 'v1', auth: oauth2Client });
}

export async function getSentEmailCount(accessToken: string): Promise<number> {
  const gmail = await getGmailClient(accessToken);
  
  try {
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: 'in:sent',
    });

    return response.data.messages?.length || 0;
  } catch (error) {
    console.error('Error fetching sent email count:', error);
    throw error;
  }
}