import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { getGmailClient, searchAndLabelJobAlerts, fetchJobAlerts, refreshAccessToken } from '@/lib/gmail-utils';

const prisma = new PrismaClient();

export async function POST() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user || !user.gmailToken || !user.gmailRefreshToken) {
      return NextResponse.json({ error: 'Gmail not connected' }, { status: 400 });
    }

    let gmail;
    try {
      gmail = await getGmailClient(user.gmailToken);
    } catch (error) {
      if (error.message === 'Invalid Credentials') {
        // Token expired, try to refresh
        const newToken = await refreshAccessToken(user.gmailRefreshToken);
        if (newToken) {
          await prisma.user.update({
            where: { id: user.id },
            data: { gmailToken: newToken },
          });
          gmail = await getGmailClient(newToken);
        } else {
          // If refresh fails, disconnect Gmail
          await prisma.user.update({
            where: { id: user.id },
            data: {
              gmailToken: null,
              gmailRefreshToken: null,
              gmailSynced: false,
              lastSyncTime: null,
            },
          });
          return NextResponse.json({ error: 'Gmail token expired and refresh failed. Please reconnect your account.' }, { status: 401 });
        }
      } else {
        throw error;
      }
    }

    // Search and label job alerts
    const labeledCount = await searchAndLabelJobAlerts(gmail);

    // Fetch job alerts
    const jobAlerts = await fetchJobAlerts(gmail);

    for (const alert of jobAlerts) {
      // Store or update job alert in the database
      await prisma.jobAlert.upsert({
        where: { messageId: alert.messageId },
        update: {
          threadId: alert.threadId,
          from: alert.from,
          toRecipients: alert.to, // Use 'toRecipients' instead of 'to'
          subject: alert.subject,
          snippet: alert.snippet,
          body: alert.body,
          sentDate: alert.sentDate,
          receivedDate: alert.receivedDate,
          labels: alert.labels,
        },
        create: {
          userId: user.id,
          messageId: alert.messageId,
          threadId: alert.threadId,
          from: alert.from,
          toRecipients: alert.to, // Use 'toRecipients' instead of 'to'
          subject: alert.subject,
          snippet: alert.snippet,
          body: alert.body,
          sentDate: alert.sentDate,
          receivedDate: alert.receivedDate,
          labels: alert.labels,
        },
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { 
        gmailSynced: true, 
        lastSyncTime: new Date() 
      },
    });

    return NextResponse.json({ 
      success: true, 
      labeledCount,
      jobAlertsCount: jobAlerts.length,
    });
  } catch (error) {
    console.error('Error syncing job alerts:', error);
    return NextResponse.json({ error: 'Failed to sync job alerts', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}