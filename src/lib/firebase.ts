import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Firebaseの設定（Firebase Consoleから取得）
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBWFv8xCvQrqT7qLrXGxbRCH3u5lWEuQY8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "nikki-ai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "nikki-ai",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "nikki-ai.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef123456"
};

// Firebaseアプリを初期化
const app = initializeApp(firebaseConfig);

// メッセージングインスタンスを取得
let messaging: any = null;

if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  messaging = getMessaging(app);
}

// FCMトークンを取得
export async function getFCMToken(): Promise<string | null> {
  if (!messaging) {
    console.log('Firebase Messaging is not supported');
    return null;
  }

  try {
    // 現在のトークンを取得
    const currentToken = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_VAPID_PUBLIC_KEY || 'BPbbeE9gPuQBaFzqzQ6sODqkCH4gODBWF2yNnCXQIr_ym1dvle_Gl_U2_QcdK-sG7KTRqCf9sKQZJw_F4B_bZwI'
    });

    if (currentToken) {
      console.log('FCM Token:', currentToken);
      return currentToken;
    } else {
      console.log('No registration token available.');
      return null;
    }
  } catch (error) {
    console.error('An error occurred while retrieving token:', error);
    return null;
  }
}

// フォアグラウンドでメッセージを受信
export function onForegroundMessage(callback: (payload: any) => void) {
  if (!messaging) return;
  
  return onMessage(messaging, (payload) => {
    console.log('Message received:', payload);
    callback(payload);
  });
}

export { messaging };