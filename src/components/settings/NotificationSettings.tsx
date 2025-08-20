import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff, Clock, MessageCircle, Book, TestTube } from 'lucide-react';
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
      await sendTestNotification();
      toast.success('テスト通知を送信しました');
    } catch (error) {
      toast.error('テスト通知の送信に失敗しました');
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
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
          <p className="text-gray-600 mb-4">
            プッシュ通知を有効にすると、<br />
            家族の日記やコメントをリアルタイムで受け取れます
          </p>
          <Button
            onClick={handleToggleNotifications}
            size="lg"
          >
            <Bell className="w-5 h-5" />
            通知を有効にする
          </Button>
        </div>
      )}
    </motion.div>
  );
};