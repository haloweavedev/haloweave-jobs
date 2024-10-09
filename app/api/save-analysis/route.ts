import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { userId, analysis } = await req.json();

  try {
    await prisma.user.update({
      where: { clerkId: userId },
      data: { resumeAnalysis: analysis },
    });

    return NextResponse.json({ message: 'Resume analysis saved successfully' });
  } catch (error) {
    console.error('Error saving resume analysis:', error);
    return NextResponse.json({ error: 'Failed to save resume analysis' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}