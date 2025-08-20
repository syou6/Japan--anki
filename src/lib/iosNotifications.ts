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
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (!isIOS) return;

    try {
      // PWAかチェック
      const isStandalone = (window.navigator as any).standalone === true ||
                          window.matchMedia('(display-mode: standalone)').matches;
      
      if (!isStandalone) {
        console.log('iOS: Not in PWA mode, cannot show notification');
        return;
      }

      // Service Worker経由で通知
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.showNotification(title, {
          body,
          icon: '/icon-192x192.png',
          badge: '/icon-192x192.png',
          data: data || {},
          vibrate: [200, 100, 200],
          tag: `ios-${Date.now()}`,
          requireInteraction: false
        });
      } else {
        // フォールバック：通常のNotification API
        if (Notification.permission === 'granted') {
          new Notification(title, {
            body,
            icon: '/icon-192x192.png',
          });
        }
      }
    } catch (error) {
      console.error('iOS local notification failed:', error);
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