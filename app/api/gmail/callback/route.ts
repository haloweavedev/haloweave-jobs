import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { getOAuth2Client } from '@/lib/google-auth';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const { userId } = auth();

  if (!code || !userId) {
    console.error('Missing code or userId');
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=AuthFailed`);
  }

  try {
    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);

    console.log('Received tokens:', tokens);

    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      console.error('User email not found');
      throw new Error('User email not found');
    }

    // Try to find user by email or clerkId
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { clerkId: userId }
        ]
      }
    });

    if (user) {
      // Update existing user
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          clerkId: userId, // Ensure clerkId is always up to date
          email: email, // Update email in case it changed
          gmailToken: tokens.access_token,
          gmailRefreshToken: tokens.refresh_token,
          gmailSynced: true,
          lastSyncTime: new Date(),
        },
      });
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: email,
          gmailToken: tokens.access_token,
          gmailRefreshToken: tokens.refresh_token,
          gmailSynced: true,
          lastSyncTime: new Date(),
        },
      });
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=GmailConnected`);
  } catch (error) {
    console.error('Error during Gmail callback:', error);
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=CallbackFailed&message=${encodeURIComponent(errorMessage)}`);
  } finally {
    await prisma.$disconnect();
  }
}