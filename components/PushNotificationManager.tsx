'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const checkSupport = async () => {
      const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      setIsIOS(iOS);

      if ('serviceWorker' in navigator && 'PushManager' in window) {
        setIsSupported(true);
        await registerServiceWorker();
      }

      // Check if the app is installed (works for iOS PWA)
      setIsInstalled(window.matchMedia('(display-mode: standalone)').matches);
    };

    checkSupport();
  }, []);

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
    } catch (error) {
      console.error('Error registering service worker:', error);
    }
  }

  async function subscribeToPush() {
    try {
      // Fetch the user ID first
      const userResponse = await fetch('/api/get-user-id');
      if (!userResponse.ok) {
        throw new Error('Failed to get user ID');
      }
      const { userId } = await userResponse.json();

      const registration = await navigator.serviceWorker.ready;
      
      let sub;
      if (isIOS) {
        sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: VAPID_PUBLIC_KEY
        });
      } else {
        sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });
      }

      console.log('Push Subscription:', JSON.stringify(sub));
      setSubscription(sub);

      // Send subscription to server with job preferences
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: sub,
          userId,
          jobPreferences: [{ jobTitle, company, location }],
        }),
      });
    } catch (error) {
      console.error('Error subscribing to push:', error);
    }
  }

  async function unsubscribeFromPush() {
    try {
      await subscription?.unsubscribe();
      setSubscription(null);

      // Remove subscription from server
      await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ endpoint: subscription?.endpoint }),
      });
    } catch (error) {
      console.error('Error unsubscribing from push:', error);
    }
  }

  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>;
  }

  if (isIOS && !isInstalled) {
    return (
      <div>
        <p>To enable push notifications on iOS, please add this website to your home screen.</p>
        <ol>
          <li>Tap the share button in Safari</li>
          <li>Scroll down and tap &quot;Add to Home Screen&quot;</li>
          <li>Tap &quot;Add&quot; in the top right corner</li>
          <li>Open the app from your home screen</li>
        </ol>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!subscription && (
        <>
          <Input
            placeholder="Job Title (optional)"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          <Input
            placeholder="Company (optional)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <Input
            placeholder="Location (optional)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </>
      )}
      {subscription ? (
        <Button onClick={unsubscribeFromPush}>Unsubscribe from Push Notifications</Button>
      ) : (
        <Button onClick={subscribeToPush}>Subscribe to Push Notifications</Button>
      )}
    </div>
  );
}