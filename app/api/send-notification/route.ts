import { NextResponse } from 'next/server';
import { sendPushNotification } from '@/lib/pushNotification';

export async function POST(request: Request) {
  const body = await request.json();
  const { subscription, payload } = body;

  try {
    await sendPushNotification(subscription, payload);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending push notification:', error);
    return NextResponse.json({ success: false, error: 'Failed to send notification' }, { status: 500 });
  }
}