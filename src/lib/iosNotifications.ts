// iOS専用の通知処理
export class IOSNotificationManager {
  static async requestPermission(): Promise<boolean> {
    // iOSチェック
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (!isIOS) return false;

    try {
      // iOS 16.4+でPWAの場合のみ通知可能
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
          console.log('iOS: Notification permission granted');
          
          // Service Workerを登録（iOS用）
          if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration) {
              // テスト通知を表示
              await registration.showNotification('通知設定完了', {
                body: '日記AIの通知が有効になりました',
                icon: '/icon-192x192.png',
                badge: '/icon-192x192.png',
                tag: 'setup-complete',
                requireInteraction: false
              });
            }
          }
          
          return true;
        }
      }
    } catch (error) {
      console.error('iOS notification setup failed:', error);
    }
    
    return false;
  }

  static async showLocalNotification(title: string, body: string, data?: any) {
    try {
      console.log('Attempting to show notification:', { title, body });
      
      // 通知権限の確認
      if (Notification.permission !== 'granted') {
        console.log('Notification permission not granted');
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.log('User denied notification permission');
          return;
        }
      }

      // Service Workerを使用
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        console.log('Service Worker ready, showing notification');
        
        await registration.showNotification(title, {
          body,
          icon: '/icon-192x192.png',
          badge: '/icon-192x192.png',
          data: data || {},
          vibrate: [200, 100, 200],
          tag: `notification-${Date.now()}`,
          requireInteraction: false,
          silent: false
        });
        
        console.log('Notification shown successfully');
      } else {
        // フォールバック：通常のNotification API
        console.log('Using fallback Notification API');
        new Notification(title, {
          body,
          icon: '/icon-192x192.png',
        });
      }
    } catch (error) {
      console.error('Failed to show notification:', error);
      
      // 最終フォールバック：アラート
      alert(`${title}\n\n${body}`);
    }
  }

  // リアルタイムポーリング（iOS向け）
  static startPolling(userId: string, interval: number = 30000) {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (!isIOS) return;

    // 30秒ごとに新しい通知をチェック
    setInterval(async () => {
      try {
        const response = await fetch('/api/check-notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });
        
        if (response.ok) {
          const notifications = await response.json();
          for (const notif of notifications) {
            await this.showLocalNotification(notif.title, notif.body, notif.data);
          }
        }
      } catch (error) {
        console.error('Polling failed:', error);
      }
    }, interval);
  }
}