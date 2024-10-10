import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const stats = await prisma.jobApplication.groupBy({
      by: ['status'],
      where: { userId: user.id },
      _count: true,
    });

    const totalApplications = stats.reduce((sum, stat) => sum + stat._count, 0);
    const responseRate = stats.find(s => s.status === 'RESPONSE_RECEIVED')?._count || 0;

    return NextResponse.json({
      totalApplications,
      responseRate: totalApplications > 0 ? responseRate / totalApplications : 0,
      statusBreakdown: stats,
    });
  } catch (error) {
    console.error('Error fetching job application stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}