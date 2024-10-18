self.addEventListener('push', function(event) {
    console.log('Push event received:', event);
    
    const data = event.data.json();
    console.log('Push event data:', data);
    
    const options = {
      body: data.body,
      icon: '/web-app-manifest-192x192.png',
      badge: '/badge.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
      },
    };
    
    console.log('Showing notification with options:', options);
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
        .then(() => console.log('Notification shown successfully'))
        .catch((error) => console.error('Error showing notification:', error))
    );
  });
  
  self.addEventListener('notificationclick', function(event) {
    console.log('Notification clicked:', event);
    
    event.notification.close();
    console.log('Notification closed');
    
    event.waitUntil(
      clients.openWindow('http://localhost:3000')
        .then((windowClient) => console.log('Window opened:', windowClient))
        .catch((error) => console.error('Error opening window:', error))
    );
  });
  
  console.log('Service Worker loaded and registered event listeners');