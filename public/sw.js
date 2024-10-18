self.addEventListener('push', function(event) {
    const data = event.data?.json() ?? {};
    const title = data.title || 'New Notification';
    const options = {
      body: data.body || 'You have a new notification from Haloweave Jobs',
      icon: '/web-app-manifest-192x192.png',
      badge: '/badge.png',
      data: {
        url: data.url || '/',
      },
    };
  
    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  });
  
  self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  });