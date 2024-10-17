import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { getGmailClient, searchAndLabelJobEmails, fetchJobEmails, refreshAccessToken } from '@/lib/gmail-utils';

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

    // Search and label job-related emails
    const labeledCount = await searchAndLabelJobEmails(gmail);

    // Fetch job-related emails
    const jobEmails = await fetchJobEmails(gmail);

    let sentApplicationsCount = 0;

    for (const email of jobEmails) {
      // Store or update email in the database
      const storedEmail = await prisma.email.upsert({
        where: { messageId: email.messageId },
        update: email,
        create: {
          ...email,
          userId: user.id,
        },
      });

      if (email.labels.includes('SENT')) {
        sentApplicationsCount++;
        // Create or update job application
        await prisma.jobApplication.upsert({
          where: { emailId: storedEmail.id },
          update: {
            company: email.to[0], // Simplified, you might want to extract company name more accurately
            jobTitle: email.subject,
            appliedDate: email.sentDate,
          },
          create: {
            userId: user.id,
            emailId: storedEmail.id,
            company: email.to[0], // Simplified, you might want to extract company name more accurately
            jobTitle: email.subject,
            appliedDate: email.sentDate,
          },
        });
      }
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
      sentApplicationsCount,
    });
  } catch (error) {
    console.error('Error syncing sent emails:', error);
    return NextResponse.json({ error: 'Failed to sync sent emails', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}