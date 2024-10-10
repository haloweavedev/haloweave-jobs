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

export async function getSentEmailCount(gmailClient: any): Promise<number> {
  let pageToken = undefined;
  let totalCount = 0;

  do {
    const response = await gmailClient.users.messages.list({
      userId: 'me',
      q: 'in:sent',
      maxResults: 500,
      pageToken: pageToken,
    });

    totalCount += response.data.messages?.length || 0;
    pageToken = response.data.nextPageToken;
  } while (pageToken);

  return totalCount;
}