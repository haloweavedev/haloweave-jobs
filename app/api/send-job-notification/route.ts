import { NextRequest, NextResponse } from 'next/server';
import { sendTargetedNotification } from '@/lib/pushNotification';

const API_SECRET = process.env.NOTIFICATION_API_SECRET;

export const runtime = 'nodejs'; // Explicitly set Node.js runtime

export async function POST(request: NextRequest) {
  try {
    console.log('Received request to send job notification');
    const { title, company, location, url, secret } = await request.json();
    console.log('Parsed request body', { title, company, location, url });

    if (secret !== API_SECRET) {
      console.log('Unauthorized: API secret mismatch');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!title || !company || !location || !url) {
      console.log('Bad request: Missing required fields');
      return NextResponse.json({ error: 'All job details are required' }, { status: 400 });
    }

    console.log('Calling sendTargetedNotification');
    await sendTargetedNotification({ title, company, location, url });

    console.log('Job notification sent successfully');
    return NextResponse.json({ success: true, message: 'Job notification sent successfully' });
  } catch (error) {
    console.error('Error in send-job-notification API route:', error);
    return NextResponse.json({ success: false, error: 'Failed to send job notification', details: error.message }, { status: 500 });
  }
}