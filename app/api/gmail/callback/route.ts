import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_APP_URL}/api/gmail/callback`
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const { userId } = auth();

  if (!code || !userId) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=AuthFailed`);
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Fetch the user's email from Clerk
    const clerkUser = await clerkClient.users.getUser(userId);
    const userEmail = clerkUser.emailAddresses[0]?.emailAddress;

    if (!userEmail) {
      throw new Error('User email not found');
    }

    // Update or create the user in the database
    await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        gmailToken: tokens.access_token,
        gmailSynced: true,
      },
      create: {
        clerkId: userId,
        email: userEmail,
        gmailToken: tokens.access_token,
        gmailSynced: true,
      },
    });

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=GmailSynced`);
  } catch (error) {
    console.error('Error during Gmail callback:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=CallbackFailed`);
  } finally {
    await prisma.$disconnect();
  }
}