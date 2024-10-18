import webpush from 'web-push';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

export async function sendTargetedNotification(jobData: {
    title: string;
    company: string;
    location: string;
    url: string;
  }) {
    try {
      const subscriptions = await prisma.pushSubscription.findMany({
        include: {
          jobPreferences: true,
        },
      });
  
      for (const subscription of subscriptions) {
        const matchesPreferences = subscription.jobPreferences.some(pref => 
          (!pref.jobTitle || jobData.title.toLowerCase().includes(pref.jobTitle.toLowerCase())) &&
          (!pref.company || jobData.company.toLowerCase().includes(pref.company.toLowerCase())) &&
          (!pref.location || jobData.location.toLowerCase().includes(pref.location.toLowerCase()))
        );
  
        if (matchesPreferences) {
          const pushSubscription = {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          };
  
          await sendPushNotification(pushSubscription, {
            title: 'New Job Match!',
            body: `${jobData.title} at ${jobData.company} in ${jobData.location}`,
            url: jobData.url,
          });
        }
      }
  
      console.log('Targeted notifications sent successfully');
    } catch (error) {
      console.error('Error sending targeted notifications:', error);
    }
  }

export { webpush };