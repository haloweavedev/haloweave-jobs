import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Job {
  companyLogoURL: string;
  jobTitle: string;
  companyName: string;
  location: string;
  jobType: string;
  applyLink: string;
  ifEasyApply: boolean;
}

interface JobAlert {
  date: string;
  jobs: Job[];
}

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

    console.log(`Fetching job alerts for user: ${user.id}`);

    const latestJobAlerts = await prisma.jobAlert.findMany({
      where: { userId: user.id },
      orderBy: { receivedDate: 'desc' },
      take: 4,
    });

    console.log(`Found ${latestJobAlerts.length} job alerts`);

    const parsedAlerts = latestJobAlerts.map((alert) => ({
      date: alert.receivedDate.toLocaleDateString(),
      jobs: parseJobsFromEmail(alert.body),
    }));

    console.log('Parsed alerts:', JSON.stringify(parsedAlerts, null, 2));

    return NextResponse.json(parsedAlerts);
  } catch (error) {
    console.error('Error fetching job alerts:', error);
    return NextResponse.json({ error: 'Failed to fetch job alerts' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

function parseJobsFromEmail(emailBody: string): Job[] {
  const jobs: Job[] = [];
  const lines = emailBody.split('\n');
  let currentJob: Partial<Job> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('[image:')) {
      if (Object.keys(currentJob).length > 0) {
        jobs.push(currentJob as Job);
      }
      currentJob = {
        companyName: line.replace('[image:', '').replace(']', '').trim(),
        companyLogoURL: '',
        ifEasyApply: false,
      };
    } else if (line.startsWith('https://www.linkedin.com/comm/jobs/view/')) {
      currentJob.applyLink = line;
      currentJob.companyLogoURL = line; // Using applyLink as companyLogoURL for now
    } else if (!currentJob.jobTitle && line.length > 0 && !line.startsWith('https://')) {
      currentJob.jobTitle = line;
    } else if (line.includes('·')) {
      const [location, jobType] = line.split('·').map(s => s.trim());
      currentJob.location = location;
      currentJob.jobType = extractJobType(jobType);
    } else if (line.toLowerCase().includes('easy apply')) {
      currentJob.ifEasyApply = true;
    }

    if (currentJob.jobTitle && currentJob.companyName && currentJob.applyLink && 
        currentJob.location && currentJob.jobType && 
        !jobs.find(job => job.applyLink === currentJob.applyLink)) {
      jobs.push(currentJob as Job);
      currentJob = {};
    }
  }

  console.log(`Parsed ${jobs.length} jobs`);
  console.log('First job:', JSON.stringify(jobs[0], null, 2));

  return jobs;
}

function extractJobType(jobTypeString: string): string {
  if (jobTypeString.includes('Remote')) return 'Remote';
  if (jobTypeString.includes('Hybrid')) return 'Hybrid';
  if (jobTypeString.includes('On-site')) return 'On-site';
  return 'Not specified';
}

export const config = {
  runtime: 'edge',
};