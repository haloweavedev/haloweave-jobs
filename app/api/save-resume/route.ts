import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { userId, resumeData } = await req.json();

  try {
    await prisma.user.update({
      where: { clerkId: userId },
      data: { resumeData: { text: resumeData } },
    });

    return NextResponse.json({ message: 'Resume data saved successfully' });
  } catch (error) {
    console.error('Error saving resume data:', error);
    return NextResponse.json({ error: 'Failed to save resume data' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}