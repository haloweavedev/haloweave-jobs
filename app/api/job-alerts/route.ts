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

    const parsedAlerts = latestJobAlerts.map((alert) => {
      const jobs = parseJobsFromEmail(alert.body);
      console.log(`Parsed jobs for alert dated ${alert.receivedDate}:`, jobs);
      return {
        date: alert.receivedDate.toLocaleDateString(),
        jobs,
      };
    });

    console.log('Final parsed alerts:', JSON.stringify(parsedAlerts, null, 2));

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
  const lines = emailBody
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  let currentJob: Partial<Job> = {};
  let isParsingJobs = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Start parsing when we find the line indicating new jobs
    if (!isParsingJobs && line.includes('match your preferences.')) {
      isParsingJobs = true;
      continue;
    }

    if (!isParsingJobs) continue;

    // Stop parsing when we reach the end of the job listings
    if (
      line === 'See all jobs' ||
      line.startsWith('------------------------------') ||
      line.startsWith('Get the new LinkedIn') ||
      line.startsWith('Also available on mobile')
    ) {
      // Add the last job if it has required fields
      if (currentJob.companyName && currentJob.jobTitle && currentJob.applyLink) {
        jobs.push(currentJob as Job);
      }
      break;
    }

    // Check for company image line
    if (line.startsWith('[image:')) {
      const companyName = line.replace('[image:', '').replace(']', '').trim();

      // Skip non-company images and unwanted entries
      const unwantedCompanyNames = [
        'Easy Apply',
        'The George Washington University',
        'LinkedIn',
        'Download on the App Store',
        'Get it on Google Play',
        'i18n_premium_icon_alt_text_redesign_flavor',
      ];

      if (unwantedCompanyNames.includes(companyName)) {
        continue;
      }

      // Save the previous job if it has required fields
      if (currentJob.companyName && currentJob.jobTitle && currentJob.applyLink) {
        jobs.push(currentJob as Job);
        currentJob = {};
      }

      currentJob.companyName = companyName;
      currentJob.companyLogoURL = ''; // Update this if you can extract the logo URL
      currentJob.ifEasyApply = false;
    }
    // Check for the job apply link
    else if (line.startsWith('<https://www.linkedin.com/comm/jobs/view/')) {
      currentJob.applyLink = line.slice(1, -1); // Remove the angle brackets
    }
    // Check for job title
    else if (
      !currentJob.jobTitle &&
      !line.startsWith('https://') &&
      !line.startsWith('Actively recruiting') &&
      !line.startsWith('Easy Apply') &&
      !line.startsWith('See all jobs')
    ) {
      // Skip lines that are not job titles
      const unwantedJobTitles = ['Fast growing', '1 school alum', '2 school alumni'];
      if (unwantedJobTitles.includes(line)) {
        continue;
      }
      currentJob.jobTitle = line;
    }
    // Check for location and job type
    else if (currentJob.companyName && (line.includes('(On-site)') || line.includes('(Hybrid)') || line.includes('(Remote)'))) {
      currentJob.location = line;
    }
    // Check for Easy Apply tag
    else if (line.toLowerCase().includes('easy apply')) {
      currentJob.ifEasyApply = true;
    }
  }

  // Add the last job if it has required fields
  if (currentJob.companyName && currentJob.jobTitle && currentJob.applyLink) {
    jobs.push(currentJob as Job);
  }

  console.log(`Parsed ${jobs.length} jobs`);
  if (jobs.length > 0) {
    console.log('First job:', JSON.stringify(jobs[0], null, 2));
  }

  return jobs;
}


export const config = {
  runtime: 'edge',
};