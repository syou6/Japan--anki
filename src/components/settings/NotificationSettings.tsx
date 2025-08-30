import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff, Clock, MessageCircle, Book, TestTube, CreditCard } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { useNotificationStore } from '../../stores/notificationStore';
import toast from 'react-hot-toast';

export const NotificationSettings: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    isSubscribed, 
    settings, 
    loading,
    initialize,
    subscribe, 
    unsubscribe, 
    updateSettings,
    sendTestNotification 
  } = useNotificationStore();

  const [localSettings, setLocalSettings] = useState({
    new_comment: true,
    family_diary: true,
    daily_reminder: false,
    reminder_time: '20:00'
  });
  
  // iOS/PWAチェック
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  const isStandalone = (window.navigator as any).standalone === true || 
                       window.matchMedia('(display-mode: standalone)').matches;
  const canUseNotifications = !isIOS || isStandalone;

  useEffect(() => {
    if (user) {
      initialize(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (settings) {
      setLocalSettings({
        new_comment: settings.new_comment,
        family_diary: settings.family_diary,
        daily_reminder: settings.daily_reminder,
        reminder_time: settings.reminder_time.substring(0, 5)
      });
    }
  }, [settings]);

  const handleToggleNotifications = async () => {
    if (!user) return;

    try {
      if (isSubscribed) {
        const success = await unsubscribe(user.id);
        if (success) {
          toast.success('通知をオフにしました');
        } else {
          toast.error('通知の解除に失敗しました');
        }
      } else {
        const success = await subscribe(user.id);
        if (success) {
          toast.success('通知をオンにしました');
        } else {
          toast.error('通知の有効化に失敗しました');
        }
      }
    } catch (error) {
      toast.error('エラーが発生しました');
    }
  };

  const handleSettingChange = async (key: string, value: boolean | string) => {
    if (!user) return;

    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);

    try {
      await updateSettings(user.id, { [key]: value });
      toast.success('設定を更新しました');
    } catch (error) {
      toast.error('設定の更新に失敗しました');
    }
  };

  const handleTestNotification = async () => {
    try {
      // デバッグ情報を収集
      const debugInfo = {
        permission: Notification.permission,
        serviceWorker: 'serviceWorker' in navigator,
        pushManager: 'PushManager' in window,
        isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
        isPWA: window.matchMedia('(display-mode: standalone)').matches,
        time: new Date().toLocaleTimeString()
      };
      
      // デバッグ情報を画面に表示
      toast.info(`Debug: ${JSON.stringify(debugInfo, null, 2)}`, {
        duration: 10000
      });
      
      await sendTestNotification();
      toast.success('テスト通知を送信しました');
    } catch (error: any) {
      toast.error(`失敗: ${error.message || 'テスト通知の送信に失敗しました'}`, {
        duration: 10000
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* サブスクリプションカード */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-6 max-w-2xl mx-auto text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <CreditCard className="w-7 h-7" />
              プレミアムプラン
            </h2>
            <p className="text-lg opacity-90">
              月額¥500で全機能をご利用いただけます
            </p>
          </div>
          <Button
            onClick={() => window.location.href = '/app?view=subscription'}
            variant="outline"
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100 border-white"
          >
            プランを見る
          </Button>
        </div>
      </motion.div>

      {/* 通知設定カード */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto"
      >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Bell className="w-7 h-7 text-blue-600" />
          通知設定
        </h2>
        <Button
          onClick={handleToggleNotifications}
          variant={isSubscribed ? 'primary' : 'outline'}
          size="md"
        >
          {isSubscribed ? (
            <>
              <Bell className="w-5 h-5" />
              通知オン
            </>
          ) : (
            <>
              <BellOff className="w-5 h-5" />
              通知オフ
            </>
          )}
        </Button>
      </div>

      {isSubscribed && (
        <>
          <div className="space-y-4 mb-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">通知タイプ</h3>
              
              <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-800">新しいコメント</p>
                    <p className="text-sm text-gray-600">日記にコメントが付いたとき通知</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.new_comment}
                  onChange={(e) => handleSettingChange('new_comment', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div className="flex items-center gap-3">
                  <Book className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-800">家族の日記</p>
                    <p className="text-sm text-gray-600">家族が日記を投稿したとき通知</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.family_diary}
                  onChange={(e) => handleSettingChange('family_diary', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-gray-800">日記リマインダー</p>
                    <p className="text-sm text-gray-600">毎日決まった時間に日記を書くよう通知</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.daily_reminder}
                  onChange={(e) => handleSettingChange('daily_reminder', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>

              {localSettings.daily_reminder && (
                <div className="ml-14 mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    リマインダー時刻
                  </label>
                  <input
                    type="time"
                    value={localSettings.reminder_time}
                    onChange={(e) => handleSettingChange('reminder_time', e.target.value + ':00')}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleTestNotification}
              variant="outline"
              size="md"
            >
              <TestTube className="w-5 h-5" />
              テスト通知を送信
            </Button>
          </div>
        </>
      )}

      {!isSubscribed && (
        <div className="text-center py-8">
          <BellOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          
          {/* iOSでPWAでない場合 */}
          {isIOS && !isStandalone ? (
            <>
              <p className="text-gray-600 mb-4">
                iPhoneでプッシュ通知を使用するには<br />
                ホーム画面にアプリを追加してください
              </p>
              
              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-4 text-left max-w-sm mx-auto">
                <p className="text-sm text-blue-900 font-bold mb-3">
                  📱 アプリの追加方法
                </p>
                <ol className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="font-bold bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-xs">1</span>
                    <span>Safari下部の共有ボタン
                      <svg className="inline w-5 h-5 ml-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0" />
                      </svg>
                      をタップ
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-xs">2</span>
                    <span>「ホーム画面に追加」を選択</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-xs">3</span>
                    <span>右上の「追加」をタップ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-xs">4</span>
                    <span>ホーム画面から「日記AI」を開く</span>
                  </li>
                </ol>
              </div>
              
              <p className="text-xs text-gray-500">
                ※iOS 16.4以降が必要です
              </p>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-4">
                プッシュ通知を有効にすると、<br />
                家族の日記やコメントをリアルタイムで受け取れます
              </p>
              
              {/* Android向けの説明 */}
              {/Android/i.test(navigator.userAgent) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-left">
                  <p className="text-sm text-yellow-800 font-semibold mb-2">
                    📱 スマートフォンでご利用の方へ
                  </p>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Chrome/Edgeブラウザをご利用ください</li>
                    <li>• メニュー → ホーム画面に追加</li>
                    <li>• アプリとして使うと便利です</li>
                  </ul>
                </div>
              )}
              
              <Button
                onClick={handleToggleNotifications}
                size="lg"
                disabled={!canUseNotifications}
              >
                <Bell className="w-5 h-5" />
                通知を有効にする
              </Button>
            </>
          )}
        </div>
      )}
      </motion.div>
    </div>
  );
};