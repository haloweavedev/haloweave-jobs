import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const JOB_LABEL_NAME = 'Job Applications';

export async function getGmailClient(accessToken: string) {
  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/gmail/callback`
  );
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.gmail({ version: 'v1', auth: oauth2Client });
}

export async function searchAndLabelJobEmails(gmailClient: any) {
  const query = 'in:sent (subject:"Application" OR subject:"application" OR subject:"job" OR subject:"resume")';
  const label = await getOrCreateJobLabel(gmailClient);
  let pageToken;
  let labeledCount = 0;

  do {
    const response = await gmailClient.users.messages.list({
      userId: 'me',
      q: query,
      pageToken: pageToken,
    });

    const messages = response.data.messages || [];
    if (messages.length > 0) {
      await gmailClient.users.messages.batchModify({
        userId: 'me',
        requestBody: {
          ids: messages.map(m => m.id),
          addLabelIds: [label.id],
        },
      });
      labeledCount += messages.length;
    }

    pageToken = response.data.nextPageToken;
  } while (pageToken);

  return labeledCount;
}

export async function fetchJobEmails(gmailClient: any) {
  const label = await getOrCreateJobLabel(gmailClient);
  let pageToken;
  const emails = [];

  do {
    const response = await gmailClient.users.messages.list({
      userId: 'me',
      labelIds: [label.id],
      pageToken: pageToken,
    });

    const messages = response.data.messages || [];
    for (const message of messages) {
      const email = await fetchEmailDetails(gmailClient, message.id);
      emails.push(email);
    }

    pageToken = response.data.nextPageToken;
  } while (pageToken);

  return emails;
}

async function getOrCreateJobLabel(gmailClient: any) {
  const res = await gmailClient.users.labels.list({ userId: 'me' });
  let label = res.data.labels.find(l => l.name === JOB_LABEL_NAME);

  if (!label) {
    const createRes = await gmailClient.users.labels.create({
      userId: 'me',
      requestBody: { name: JOB_LABEL_NAME },
    });
    label = createRes.data;
  }

  return label;
}

async function fetchEmailDetails(gmailClient: any, messageId: string) {
  const message = await gmailClient.users.messages.get({
    userId: 'me',
    id: messageId,
    format: 'full',
  });

  const headers = message.data.payload.headers;
  const subject = headers.find(h => h.name === 'Subject')?.value || '';
  const from = headers.find(h => h.name === 'From')?.value || '';
  const to = headers.find(h => h.name === 'To')?.value.split(',').map(e => e.trim()) || [];
  const date = new Date(parseInt(message.data.internalDate));

  return {
    messageId: message.data.id,
    threadId: message.data.threadId,
    subject,
    from,
    to,
    snippet: message.data.snippet,
    body: extractBody(message.data.payload),
    sentDate: date,
    receivedDate: message.data.labelIds.includes('SENT') ? null : date,
    labels: message.data.labelIds,
  };
}

function extractBody(payload: any): string {
  if (payload.body.data) {
    return Buffer.from(payload.body.data, 'base64').toString('utf-8');
  }

  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain') {
        return Buffer.from(part.body.data, 'base64').toString('utf-8');
      }
    }
  }

  return '';
}