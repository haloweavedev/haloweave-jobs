import { NextResponse } from 'next/server';
import { sendTargetedNotification } from '@/lib/pushNotification';

const API_SECRET = process.env.NOTIFICATION_API_SECRET;

export async function POST(request: Request) {
  try {
    const { title, company, location, url, secret } = await request.json();

    if (secret !== API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!title || !company || !location || !url) {
      return NextResponse.json({ error: 'All job details are required' }, { status: 400 });
    }

    await sendTargetedNotification({ title, company, location, url });

    return NextResponse.json({ success: true, message: 'Job notification sent successfully' });
  } catch (error) {
    console.error('Error in send-job-notification API route:', error);
    return NextResponse.json({ success: false, error: 'Failed to send job notification' }, { status: 500 });
  }
}