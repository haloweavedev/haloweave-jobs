import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { getGmailClient, searchAndLabelJobEmails, fetchJobEmails } from '@/lib/gmail-utils';

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

    if (!user || !user.gmailToken) {
      return NextResponse.json({ error: 'Gmail not connected' }, { status: 400 });
    }

    const gmail = await getGmailClient(user.gmailToken);
    
    // Search and label job-related emails
    const labeledCount = await searchAndLabelJobEmails(gmail);

    // Fetch job-related emails
    const jobEmails = await fetchJobEmails(gmail);

    let sentApplicationsCount = 0;
    let receivedResponsesCount = 0;

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
      } else {
        receivedResponsesCount++;
        // Update job application status if it exists
        const existingApplication = await prisma.jobApplication.findFirst({
          where: {
            userId: user.id,
            email: {
              threadId: email.threadId,
            },
          },
        });

        if (existingApplication) {
          await prisma.jobApplication.update({
            where: { id: existingApplication.id },
            data: {
              status: 'RESPONSE_RECEIVED',
              lastResponseDate: email.receivedDate,
            },
          });
        }
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
      jobRelatedEmailsCount: jobEmails.length,
      sentApplicationsCount,
      receivedResponsesCount,
    });
  } catch (error) {
    console.error('Error syncing Gmail:', error);
    return NextResponse.json({ error: 'Failed to sync Gmail', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}