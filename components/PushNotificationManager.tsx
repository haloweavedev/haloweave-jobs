'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

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
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    console.log('PushNotificationManager mounted');
    console.log('VAPID Public Key:', VAPID_PUBLIC_KEY);
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      console.log('Push notifications are supported');
      setIsSupported(true);
      registerServiceWorker();
    } else {
      console.log('Push notifications are not supported');
    }
    setNotificationPermission(Notification.permission);
}, []);

  async function registerServiceWorker() {
    try {
      console.log('Registering service worker');
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      
      console.log('Checking existing push subscription');
      const sub = await registration.pushManager.getSubscription();
      console.log('Existing subscription:', sub);
      setSubscription(sub);
    } catch (error) {
      console.error('Error registering service worker:', error);
    }
  }

  async function subscribeToPush() {
    try {
      console.log('Subscribing to push notifications');
      const registration = await navigator.serviceWorker.ready;
      console.log('Service Worker is ready');
      
      console.log('VAPID Public Key before conversion:', VAPID_PUBLIC_KEY);
      const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
      console.log('Application Server Key:', applicationServerKey);

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey,
      });
      console.log('Push Subscription:', JSON.stringify(sub));
      setSubscription(sub);
      
      // Here you would typically send the subscription to your server
      console.log('Sending subscription to server...');
      // Implement the API call to your server here
    } catch (error) {
      console.error('Error subscribing to push:', error);
    }
  }

  async function unsubscribeFromPush() {
    try {
      console.log('Unsubscribing from push notifications');
      await subscription?.unsubscribe();
      console.log('Unsubscribed successfully');
      setSubscription(null);
      
      // Here you would typically remove the subscription from your server
      console.log('Removing subscription from server...');
      // Implement the API call to your server here
    } catch (error) {
      console.error('Error unsubscribing from push:', error);
    }
  }

  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>;
  }

  async function showTestNotification() {
    console.log('showTestNotification function called');
    
    if (notificationPermission !== 'granted') {
      console.log('Notification permission not granted, requesting permission');
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      console.log('New notification permission status:', permission);
      if (permission !== 'granted') {
        console.log('Notification permission denied');
        return;
      }
    }
  
    console.log('Creating notification');
    try {
      const notification = new Notification('Haloweave Jobs Alert', {
        body: 'New job opportunity matching your preferences!',
        icon: '/web-app-manifest-192x192.png',
        badge: '/badge.png',
        data: {
          url: 'https://haloweave.com/', // Replace with your actual job URL
        },
        tag: 'job-alert',
      });
  
      console.log('Notification created successfully');
  
      notification.onclick = function() {
        console.log('Notification clicked');
        window.open(notification.data.url, '_blank');
      };
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>;
  }

  return (
    <div className="space-y-4">
      {subscription ? (
        <Button onClick={unsubscribeFromPush}>Unsubscribe from Push Notifications</Button>
      ) : (
        <Button onClick={subscribeToPush}>Subscribe to Push Notifications</Button>
      )}
      <Button onClick={showTestNotification}>Show Test Notification</Button>
    </div>
  );
}