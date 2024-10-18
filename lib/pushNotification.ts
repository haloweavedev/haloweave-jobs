import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:haloweavejobs@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function sendPushNotification(subscription: webpush.PushSubscription, data: any) {
  const payload = JSON.stringify(data);

  try {
    await webpush.sendNotification(subscription, payload);
    console.log('Push notification sent successfully');
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
}

export { webpush };