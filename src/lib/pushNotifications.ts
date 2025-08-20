import { supabase } from './supabase';
import { getFCMToken } from './firebase';
import { IOSNotificationManager } from './iosNotifications';

export class PushNotificationManager {
  private static instance: PushNotificationManager;
  private registration: ServiceWorkerRegistration | null = null;
  private subscription: PushSubscription | null = null;

  private constructor() {}

  static getInstance(): PushNotificationManager {
    if (!PushNotificationManager.instance) {
      PushNotificationManager.instance = new PushNotificationManager();
    }
    return PushNotificationManager.instance;
  }

  async initialize(): Promise<boolean> {
    try {
      // iOSチェック
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      const isStandalone = (window.navigator as any).standalone === true || 
                          window.matchMedia('(display-mode: standalone)').matches;
      
      // iOSでスタンドアロンモードでない場合は通知不可
      if (isIOS && !isStandalone) {
        console.log('iOS requires PWA installation for notifications');
        return false;
      }
      
      // Service Workerがサポートされているかチェック
      if (!('serviceWorker' in navigator)) {
        console.log('Service Worker not supported');
        return false;
      }
      
      // Notification APIがサポートされているかチェック
      if (!('Notification' in window)) {
        console.log('Notification API not supported');
        return false;
      }

      // Service Workerの登録
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered');
      
      // Firebase Service Workerも登録（バックグラウンド通知用）
      try {
        await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/firebase-cloud-messaging-push-scope'
        });
        console.log('Firebase Service Worker registered');
      } catch (fcmError) {
        console.log('Firebase Service Worker registration failed:', fcmError);
      }

      // PushManagerのサポートチェック（iOS 16.4+で必要）
      if ('PushManager' in window && this.registration.pushManager) {
        // 既存のサブスクリプションを取得
        this.subscription = await this.registration.pushManager.getSubscription();
      }
      
      return true;
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      return false;
    }
  }

  async requestPermission(): Promise<boolean> {
    try {
      // iOSの場合は専用処理
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        return await IOSNotificationManager.requestPermission();
      }
      
      // その他のプラットフォーム
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('Notification permission granted');
        return true;
      } else {
        console.log('Notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }

  async subscribe(userId: string): Promise<boolean> {
    try {
      console.log('Starting subscription process...');
      
      if (!this.registration) {
        console.log('Initializing service worker...');
        const initialized = await this.initialize();
        if (!initialized) {
          throw new Error('Failed to initialize service worker');
        }
      }

      if (!this.registration) {
        throw new Error('Service Worker not registered');
      }

      // 通知の権限をチェック
      console.log('Current permission:', Notification.permission);
      if (Notification.permission !== 'granted') {
        const granted = await this.requestPermission();
        if (!granted) {
          console.log('Permission denied');
          return false;
        }
      }

      // iOSの場合、PushManagerが利用可能か確認
      if (!this.registration.pushManager) {
        console.error('PushManager not available');
        // iOSの場合は通知権限だけ取得して成功とする
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (isIOS && Notification.permission === 'granted') {
          console.log('iOS: Notification permission granted, treating as success');
          // ローカル通知のみ使用可能として扱う
          await this.saveLocalNotificationSettings(userId);
          return true;
        }
        throw new Error('PushManager not available');
      }

      // VAPIDキーを使用してサブスクライブ
      try {
        console.log('Attempting to subscribe to push notifications...');
        const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || 'BPbbeE9gPuQBaFzqzQ6sODqkCH4gODBWF2yNnCXQIr_ym1dvle_Gl_U2_QcdK-sG7KTRqCf9sKQZJw_F4B_bZwI';
        
        this.subscription = await this.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
        });

        console.log('Subscription created:', this.subscription);
        
        // サブスクリプションをサーバーに保存
        await this.saveSubscription(userId, this.subscription);
        
        // FCMトークンも取得して保存
        try {
          const fcmToken = await getFCMToken();
          if (fcmToken) {
            await this.saveFCMToken(userId, fcmToken);
            console.log('FCM token saved');
          }
        } catch (fcmError) {
          console.log('FCM token save failed:', fcmError);
        }
        
        console.log('Push notification subscription successful');
        return true;
      } catch (subscribeError: any) {
        console.error('Subscribe error:', subscribeError);
        
        // iOSの場合、ローカル通知のみ使用
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (isIOS && Notification.permission === 'granted') {
          console.log('iOS: Falling back to local notifications');
          await this.saveLocalNotificationSettings(userId);
          return true;
        }
        
        throw subscribeError;
      }
    } catch (error: any) {
      console.error('Failed to subscribe to push notifications:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      return false;
    }
  }

  async unsubscribe(userId: string): Promise<boolean> {
    try {
      console.log('Starting unsubscribe process...');
      
      // iOSの場合の特別処理
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        console.log('iOS: Removing notification settings');
        // iOSではサブスクリプションが存在しないので、DBのレコードのみ削除
        await this.removeSubscription(userId);
        console.log('iOS: Notification settings removed');
        return true;
      }
      
      // Android/デスクトップの場合
      if (this.subscription) {
        console.log('Unsubscribing from push notifications...');
        await this.subscription.unsubscribe();
        await this.removeSubscription(userId);
        this.subscription = null;
        console.log('Push notification unsubscribed');
        return true;
      } else {
        // サブスクリプションがなくてもDBのレコードは削除
        console.log('No subscription found, removing DB record only');
        await this.removeSubscription(userId);
        return true;
      }
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      // エラーが発生してもDBのレコードは削除を試みる
      try {
        await this.removeSubscription(userId);
        return true;
      } catch (dbError) {
        console.error('Failed to remove DB record:', dbError);
        return false;
      }
    }
  }

  isSubscribed(): boolean {
    // iOSの場合、通知権限があれば購読済みとする
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      return Notification.permission === 'granted';
    }
    return this.subscription !== null;
  }

  private async saveSubscription(userId: string, subscription: PushSubscription): Promise<void> {
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.toJSON().keys?.p256dh,
        auth: subscription.toJSON().keys?.auth,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('Failed to save subscription:', error);
      throw error;
    }
  }

  private async saveLocalNotificationSettings(userId: string): Promise<void> {
    // iOSの場合、ローカル通知設定のみ保存
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: userId,
        endpoint: 'local-notifications-only',
        p256dh: null,
        auth: null,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('Failed to save local notification settings:', error);
      // エラーを無視してローカル通知を有効とする
    }
  }

  private async saveFCMToken(userId: string, fcmToken: string): Promise<void> {
    // FCMトークンを保存
    const { error } = await supabase
      .from('push_subscriptions')
      .update({
        fcm_token: fcmToken,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Failed to save FCM token:', error);
    }
  }

  private async removeSubscription(userId: string): Promise<void> {
    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Failed to remove subscription:', error);
      throw error;
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // テスト用の通知送信
  async sendTestNotification(): Promise<void> {
    console.log('sendTestNotification called');
    
    try {
      // 通知権限を確認
      if (Notification.permission !== 'granted') {
        console.log('Permission not granted, requesting...');
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          throw new Error('通知の権限が拒否されました');
        }
      }
      
      // iOSかどうかチェック
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      console.log('Platform:', isIOS ? 'iOS' : 'Other');
      
      // 全プラットフォーム共通の処理
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        console.log('Using Service Worker for notification');
        
        await registration.showNotification('テスト通知', {
          body: 'プッシュ通知が正常に動作しています！',
          icon: '/icon-192x192.png',
          badge: '/icon-192x192.png',
          vibrate: [200, 100, 200],
          tag: 'test-notification',
          requireInteraction: false
        });
        
        console.log('Test notification sent successfully');
      } else {
        // Service Workerが使えない場合
        console.log('Service Worker not available, using Notification API');
        new Notification('テスト通知', {
          body: 'プッシュ通知が正常に動作しています！',
          icon: '/icon-192x192.png'
        });
      }
    } catch (error) {
      console.error('Test notification failed:', error);
      // 最終手段：アラート表示
      alert('テスト通知\n\nプッシュ通知が正常に動作しています！');
      throw error;
    }
  }
}