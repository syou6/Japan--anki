import { supabase } from './supabase';

export class ReminderScheduler {
  private static instance: ReminderScheduler;
  private timers: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {}

  static getInstance(): ReminderScheduler {
    if (!ReminderScheduler.instance) {
      ReminderScheduler.instance = new ReminderScheduler();
    }
    return ReminderScheduler.instance;
  }

  async setupDailyReminder(userId: string, time: string) {
    try {
      // 既存のタイマーをクリア
      this.clearReminder(userId);

      // 通知設定を確認
      const { data: settings } = await supabase
        .from('notification_settings')
        .select('daily_reminder, reminder_time')
        .eq('user_id', userId)
        .single();

      if (!settings?.daily_reminder) {
        console.log('Daily reminder is disabled');
        return;
      }

      // 時刻をパース（HH:MM:SS形式）
      const [hours, minutes] = (settings.reminder_time || time).split(':').map(Number);
      
      // 次の通知時刻を計算
      const now = new Date();
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0, 0);

      // 今日の時刻を過ぎていたら明日に設定
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const timeUntilReminder = scheduledTime.getTime() - now.getTime();

      console.log(`Scheduling reminder for ${scheduledTime.toLocaleString()}`);

      // タイマーを設定
      const timer = setTimeout(() => {
        this.sendReminder(userId);
        // 24時間後に再度設定
        this.setupDailyReminder(userId, time);
      }, timeUntilReminder);

      this.timers.set(userId, timer);

    } catch (error) {
      console.error('Failed to setup daily reminder:', error);
    }
  }

  private async sendReminder(userId: string) {
    try {
      console.log(`Sending daily reminder to user ${userId}`);

      // Service Worker経由で通知を送信
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SHOW_NOTIFICATION',
          title: '日記を書く時間です',
          body: '今日の出来事を記録しましょう',
          data: {
            url: '/record'
          }
        });
      }

      // ローカル通知（PWAの場合）
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('日記を書く時間です', {
          body: '今日の出来事を記録しましょう',
          icon: '/icon-192x192.png',
          badge: '/icon-192x192.png',
          vibrate: [200, 100, 200],
          data: {
            url: '/record'
          }
        });
      }

    } catch (error) {
      console.error('Failed to send reminder:', error);
    }
  }

  clearReminder(userId: string) {
    const timer = this.timers.get(userId);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(userId);
    }
  }

  clearAllReminders() {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
  }
}