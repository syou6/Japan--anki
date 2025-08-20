import { supabase } from './supabase';

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
      // Service Workerがサポートされているかチェック
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.log('Push notifications are not supported');
        return false;
      }

      // Service Workerの登録
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered');

      // 既存のサブスクリプションを取得
      this.subscription = await this.registration.pushManager.getSubscription();
      
      return true;
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      return false;
    }
  }

  async requestPermission(): Promise<boolean> {
    try {
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
      if (!this.registration) {
        await this.initialize();
      }

      if (!this.registration) {
        throw new Error('Service Worker not registered');
      }

      // 通知の権限をチェック
      if (Notification.permission !== 'granted') {
        const granted = await this.requestPermission();
        if (!granted) {
          return false;
        }
      }

      // VAPIDキーを使用してサブスクライブ（本番環境では環境変数から取得）
      const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || 'BKd0G3pTR6YzEfKbVxrXKKT5WJkDXzXDVyaVZQpxcK1kMKh7PZQMZjvkzE_4kRWwOc5pVkYfIA6KGBXmJjpWtQQ';
      
      this.subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
      });

      // サブスクリプションをサーバーに保存
      await this.saveSubscription(userId, this.subscription);
      
      console.log('Push notification subscription successful');
      return true;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return false;
    }
  }

  async unsubscribe(userId: string): Promise<boolean> {
    try {
      if (this.subscription) {
        await this.subscription.unsubscribe();
        await this.removeSubscription(userId);
        this.subscription = null;
        console.log('Push notification unsubscribed');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  }

  isSubscribed(): boolean {
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
    if (!this.registration) {
      throw new Error('Service Worker not registered');
    }

    await this.registration.showNotification('テスト通知', {
      body: 'プッシュ通知が正常に動作しています！',
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      vibrate: [200, 100, 200]
    });
  }
}