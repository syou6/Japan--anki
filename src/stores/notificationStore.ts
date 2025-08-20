import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { PushNotificationManager } from '../lib/pushNotifications';
import type { User } from '../types';

interface NotificationSettings {
  new_comment: boolean;
  family_diary: boolean;
  daily_reminder: boolean;
  reminder_time: string;
}

interface NotificationStore {
  isSubscribed: boolean;
  settings: NotificationSettings | null;
  loading: boolean;
  pushManager: PushNotificationManager;
  
  initialize: (userId: string) => Promise<void>;
  subscribe: (userId: string) => Promise<boolean>;
  unsubscribe: (userId: string) => Promise<boolean>;
  updateSettings: (userId: string, settings: Partial<NotificationSettings>) => Promise<void>;
  sendTestNotification: () => Promise<void>;
  notifyNewComment: (toUserId: string, fromUser: string, diaryTitle: string) => Promise<void>;
  notifyNewDiary: (familyUserIds: string[], authorName: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  isSubscribed: false,
  settings: null,
  loading: true,
  pushManager: PushNotificationManager.getInstance(),

  initialize: async (userId: string) => {
    try {
      set({ loading: true });
      
      // Push通知マネージャーを初期化
      await get().pushManager.initialize();
      
      // 通知設定を取得
      const { data: settings } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!settings) {
        // 設定がなければ作成
        const { data: newSettings } = await supabase
          .from('notification_settings')
          .insert({
            user_id: userId,
            new_comment: true,
            family_diary: true,
            daily_reminder: false,
            reminder_time: '20:00:00'
          })
          .select()
          .single();
        
        set({ settings: newSettings });
      } else {
        set({ settings });
      }

      // サブスクリプション状態を確認
      // DBからも確認する
      const { data: subscription } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      const hasSubscription = !!subscription;
      const isSubscribed = hasSubscription || get().pushManager.isSubscribed();
      
      set({ isSubscribed, loading: false });
      
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
      set({ loading: false });
    }
  },

  subscribe: async (userId: string) => {
    try {
      const success = await get().pushManager.subscribe(userId);
      if (success) {
        set({ isSubscribed: true });
        
        // iOSの場合、ローカル通知として成功メッセージを表示
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (isIOS && Notification.permission === 'granted') {
          // テスト通知を表示
          new Notification('日記AI', {
            body: '通知が有効になりました！',
            icon: '/icon-192x192.png',
            badge: '/icon-192x192.png'
          });
        }
      }
      return success;
    } catch (error) {
      console.error('Failed to subscribe:', error);
      return false;
    }
  },

  unsubscribe: async (userId: string) => {
    try {
      const success = await get().pushManager.unsubscribe(userId);
      if (success) {
        set({ isSubscribed: false });
      }
      return success;
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
      return false;
    }
  },

  updateSettings: async (userId: string, settings: Partial<NotificationSettings>) => {
    try {
      const { data, error } = await supabase
        .from('notification_settings')
        .update({
          ...settings,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (!error && data) {
        set({ settings: data });
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  },

  sendTestNotification: async () => {
    try {
      await get().pushManager.sendTestNotification();
    } catch (error) {
      console.error('Failed to send test notification:', error);
      throw error;
    }
  },

  notifyNewComment: async (toUserId: string, fromUser: string, diaryTitle: string) => {
    try {
      // 通知設定を確認
      const { data: settings } = await supabase
        .from('notification_settings')
        .select('new_comment')
        .eq('user_id', toUserId)
        .single();

      if (!settings?.new_comment) return;

      // プッシュ通知を送信（サーバーサイドで実装する必要があります）
      // ここではローカル通知として実装
      const { data: subscription } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', toUserId)
        .single();

      if (subscription) {
        // 実際の送信はサーバーサイドで行う必要があります
        console.log(`Sending notification to ${toUserId}: ${fromUser}さんがコメントしました`);
      }
    } catch (error) {
      console.error('Failed to notify new comment:', error);
    }
  },

  notifyNewDiary: async (familyUserIds: string[], authorName: string) => {
    try {
      // 家族全員の通知設定を確認
      const { data: settings } = await supabase
        .from('notification_settings')
        .select('user_id, family_diary')
        .in('user_id', familyUserIds)
        .eq('family_diary', true);

      if (!settings || settings.length === 0) return;

      // 通知を送信（サーバーサイドで実装する必要があります）
      for (const setting of settings) {
        const { data: subscription } = await supabase
          .from('push_subscriptions')
          .select('*')
          .eq('user_id', setting.user_id)
          .single();

        if (subscription) {
          console.log(`Sending notification to ${setting.user_id}: ${authorName}さんが日記を投稿しました`);
        }
      }
    } catch (error) {
      console.error('Failed to notify new diary:', error);
    }
  }
}));