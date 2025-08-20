import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Firebaseの設定（Firebase Consoleから取得）
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBDB0gVI82wwhp7Khd5T5jgxyqGD96XPJM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ai-voce-40094.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ai-voce-40094",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ai-voce-40094.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "881606027600",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:881606027600:web:576b1f5b0a974a6191a455"
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
  console.log('getFCMToken called');
  console.log('messaging instance:', messaging);
  console.log('Firebase config:', firebaseConfig);
  
  if (!messaging) {
    console.log('Firebase Messaging is not supported or not initialized');
    return null;
  }

  try {
    console.log('Requesting FCM token...');
    console.log('VAPID key:', import.meta.env.VITE_VAPID_PUBLIC_KEY || 'BPbbeE9gPuQBaFzqzQ6sODqkCH4gODBWF2yNnCXQIr_ym1dvle_Gl_U2_QcdK-sG7KTRqCf9sKQZJw_F4B_bZwI');
    
    // 現在のトークンを取得
    const currentToken = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_VAPID_PUBLIC_KEY || 'BPbbeE9gPuQBaFzqzQ6sODqkCH4gODBWF2yNnCXQIr_ym1dvle_Gl_U2_QcdK-sG7KTRqCf9sKQZJw_F4B_bZwI'
    });

    if (currentToken) {
      console.log('FCM Token successfully retrieved:', currentToken);
      return currentToken;
    } else {
      console.log('No registration token available.');
      return null;
    }
  } catch (error: any) {
    console.error('An error occurred while retrieving token:', error);
    console.error('Error details:', error.message, error.code);
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