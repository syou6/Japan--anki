// Firebase Service Worker for background notifications
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Firebase設定（環境変数から取得できないため直接記述）
firebase.initializeApp({
  apiKey: "AIzaSyBDB0gVI82wwhp7Khd5T5jgxyqGD96XPJM",
  authDomain: "ai-voce-40094.firebaseapp.com",
  projectId: "ai-voce-40094",
  storageBucket: "ai-voce-40094.firebasestorage.app",
  messagingSenderId: "881606027600",
  appId: "1:881606027600:web:576b1f5b0a974a6191a455"
});

const messaging = firebase.messaging();

// バックグラウンドでメッセージを受信
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  
  const notificationTitle = payload.notification?.title || '日記AI';
  const notificationOptions = {
    body: payload.notification?.body || '新しい通知があります',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    data: payload.data || {},
    vibrate: [200, 100, 200],
    requireInteraction: false
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 通知クリック処理
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.openWindow(urlToOpen)
  );
});