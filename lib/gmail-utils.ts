import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const JOB_LABEL_NAME = 'Job Applications';

// Refresh Access Token Function
export async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/gmail/callback`
  );

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  try {
    const { credentials } = await oauth2Client.refreshAccessToken();
    return credentials.access_token || null;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return null;
  }
}

// Get Gmail Client
export async function getGmailClient(accessToken: string) {
  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/gmail/callback`
  );
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.gmail({ version: 'v1', auth: oauth2Client });
}

// Search and Label Job Emails
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
          ids: messages.map((m: any) => m.id),
          addLabelIds: [label.id],
        },
      });
      labeledCount += messages.length;
    }

    pageToken = response.data.nextPageToken;
  } while (pageToken);

  return labeledCount;
}

// Fetch Job Emails
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

// Helper to Get or Create Job Label
async function getOrCreateJobLabel(gmailClient: any) {
  const res = await gmailClient.users.labels.list({ userId: 'me' });
  let label = res.data.labels.find((l: any) => l.name === JOB_LABEL_NAME);

  if (!label) {
    const createRes = await gmailClient.users.labels.create({
      userId: 'me',
      requestBody: { name: JOB_LABEL_NAME },
    });
    label = createRes.data;
  }

  return label;
}

// Fetch Email Details
async function fetchEmailDetails(gmailClient: any, messageId: string) {
  const message = await gmailClient.users.messages.get({
    userId: 'me',
    id: messageId,
    format: 'full',
  });

  const headers = message.data.payload.headers;
  const subject = headers.find((h: any) => h.name === 'Subject')?.value || '';
  const from = headers.find((h: any) => h.name === 'From')?.value || '';
  const to = headers.find((h: any) => h.name === 'To')?.value.split(',').map((e: string) => e.trim()) || [];
  const date = new Date(parseInt(message.data.internalDate));

  return {
    messageId: message.data.id,
    threadId: message.data.threadId,
    subject,
    from,
    to, // This will be used as 'toRecipients' in the JobAlert model
    snippet: message.data.snippet,
    body: extractBody(message.data.payload),
    sentDate: date,
    receivedDate: message.data.labelIds.includes('SENT') ? null : date,
    labels: message.data.labelIds,
  };
}

// Extract Email Body
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

// Search and Label Job Alerts
export async function searchAndLabelJobAlerts(gmailClient: any) {
  const query = 'from:jobalerts-noreply@linkedin.com';
  const label = await getOrCreateJobAlertsLabel(gmailClient);
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
          ids: messages.map((m: any) => m.id),
          addLabelIds: [label.id],
        },
      });
      labeledCount += messages.length;
    }

    pageToken = response.data.nextPageToken;
  } while (pageToken);

  return labeledCount;
}

// Fetch Job Alerts
export async function fetchJobAlerts(gmailClient: any) {
  const label = await getOrCreateJobAlertsLabel(gmailClient);
  let pageToken;
  const jobAlerts = [];

  do {
    const response = await gmailClient.users.messages.list({
      userId: 'me',
      labelIds: [label.id],
      pageToken: pageToken,
    });

    const messages = response.data.messages || [];
    for (const message of messages) {
      const jobAlert = await fetchEmailDetails(gmailClient, message.id);
      jobAlerts.push(jobAlert);
    }

    pageToken = response.data.nextPageToken;
  } while (pageToken);

  return jobAlerts;
}

// Helper to Get or Create Job Alerts Label
async function getOrCreateJobAlertsLabel(gmailClient: any) {
  const JOB_ALERTS_LABEL_NAME = 'LinkedIn Job Alerts';
  const res = await gmailClient.users.labels.list({ userId: 'me' });
  let label = res.data.labels.find((l: any) => l.name === JOB_ALERTS_LABEL_NAME);

  if (!label) {
    const createRes = await gmailClient.users.labels.create({
      userId: 'me',
      requestBody: { name: JOB_ALERTS_LABEL_NAME },
    });
    label = createRes.data;
  }

  return label;
}