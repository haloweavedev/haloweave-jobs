import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Job {
  title: string;
  company: string;
  location?: string;
  jobType?: string;
  salary?: string;
  additionalInfo?: string;
  applyLink: string;
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

    // Check if the jobAlert model exists on the Prisma client
    if (!prisma.jobAlert) {
      console.error('JobAlert model not found in Prisma client');
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    const latestJobAlerts = await prisma.jobAlert.findMany({
      where: { userId: user.id },
      orderBy: { receivedDate: 'desc' },
      take: 4,
    });

    console.log(`Found ${latestJobAlerts.length} job alerts`);

    if (latestJobAlerts.length > 0) {
      console.log('Raw email content of first alert:', latestJobAlerts[0]?.body);
    }

    const parsedAlerts = latestJobAlerts.map((alert) => ({
      date: alert.receivedDate.toLocaleDateString(),
      jobs: parseJobsFromEmail(alert.body),
    }));

    console.log('Parsed alerts:', parsedAlerts);

    return NextResponse.json(parsedAlerts);
  } catch (error) {
    console.error('Error fetching job alerts:', error);
    return NextResponse.json({ error: 'Failed to fetch job alerts' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

function parseJobsFromEmail(emailBody: string): Job[] {
  debugLog('Parsing email body');
  const lines = emailBody.split('\n');
  const jobs: Job[] = [];
  let currentJob: Partial<Job> = {};
  let isParsingJobs = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line === '13 new jobs in') {
      isParsingJobs = true;
      continue;
    }

    if (!isParsingJobs) continue;

    if (line === 'See all jobs') {
      break; // End of job listings
    }

    if (line.startsWith('[image:')) {
      // New job listing starts
      if (Object.keys(currentJob).length > 0) {
        jobs.push(currentJob as Job);
      }
      currentJob = { company: line.replace('[image:', '').replace(']', '').trim() };
    } else if (line.startsWith('https://www.linkedin.com/comm/jobs/view/')) {
      currentJob.applyLink = line;
    } else if (!currentJob.title && line.length > 0 && !line.startsWith('https://')) {
      currentJob.title = line;
    } else if (line.includes('·')) {
      const [location, jobType] = line.split('·').map(s => s.trim());
      currentJob.location = location;
      currentJob.jobType = jobType;
    } else if (line.startsWith('$') || line.includes('/year')) {
      currentJob.salary = line;
    } else if (line === 'Actively recruiting' || line === 'Easy Apply') {
      currentJob.additionalInfo = (currentJob.additionalInfo || '') + ' ' + line.trim();
    }

    // If we've collected all necessary information, add the job to the list
    if (currentJob.title && currentJob.company && currentJob.applyLink && !jobs.find(job => job.applyLink === currentJob.applyLink)) {
      jobs.push(currentJob as Job);
      currentJob = {};
    }
  }

  debugLog(`Parsed ${jobs.length} valid jobs`, jobs);
  return jobs;
}

function debugLog(message: string, data?: any) {
  console.log(`DEBUG: ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
}
