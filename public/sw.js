// Service Worker for push notifications
self.addEventListener('push', function(event) {
  const options = event.data ? event.data.json() : {};
  
  const notificationOptions = {
    body: options.body || '新しい通知があります',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [200, 100, 200],
    data: options.data || {},
    actions: options.actions || [],
    requireInteraction: options.requireInteraction || false,
    tag: options.tag || 'default',
    renotify: options.renotify || false
  };

  event.waitUntil(
    self.registration.showNotification(
      options.title || '日記AI',
      notificationOptions
    )
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(windowClients) {
        // 既に開いているウィンドウがあればフォーカス
        for (let client of windowClients) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // なければ新しいウィンドウを開く
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Service Worker のインストール
self.addEventListener('install', function(event) {
  self.skipWaiting();
});

// Service Worker のアクティベート
self.addEventListener('activate', function(event) {
  event.waitUntil(clients.claim());
});