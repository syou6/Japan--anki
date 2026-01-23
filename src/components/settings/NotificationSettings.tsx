import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff, Clock, MessageCircle, Book, TestTube, CreditCard } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { EN } from '../../i18n/en';
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
          toast.success(EN.notifications.success.off);
        } else {
          toast.error(EN.notifications.error.disable);
        }
      } else {
        const success = await subscribe(user.id);
        if (success) {
          toast.success(EN.notifications.success.on);
        } else {
          toast.error(EN.notifications.error.enable);
        }
      }
    } catch (error) {
      toast.error(EN.errors.generic);
    }
  };

  const handleSettingChange = async (key: string, value: boolean | string) => {
    if (!user) return;

    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);

    try {
      await updateSettings(user.id, { [key]: value });
      toast.success(EN.notifications.success.updated);
    } catch (error) {
      toast.error(EN.notifications.error.update);
    }
  };

  const handleTestNotification = async () => {
    try {
      await sendTestNotification();
      toast.success(EN.notifications.testSent);
    } catch (error: any) {
      toast.error(`Failed: ${error.message || EN.errors.generic}`);
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
      {/* Subscription Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-6 max-w-2xl mx-auto text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <CreditCard className="w-7 h-7" />
              {EN.notifications.premium}
            </h2>
            <p className="text-lg opacity-90">
              {EN.notifications.premiumDesc}
            </p>
          </div>
          <Button
            onClick={() => window.location.href = '/app?view=subscription'}
            variant="outline"
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100 border-white"
          >
            {EN.notifications.viewPlans}
          </Button>
        </div>
      </motion.div>

      {/* Notification Settings Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto"
      >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Bell className="w-7 h-7 text-blue-600" />
          {EN.notifications.title}
        </h2>
        <Button
          onClick={handleToggleNotifications}
          variant={isSubscribed ? 'primary' : 'outline'}
          size="md"
        >
          {isSubscribed ? (
            <>
              <Bell className="w-5 h-5" />
              {EN.notifications.on}
            </>
          ) : (
            <>
              <BellOff className="w-5 h-5" />
              {EN.notifications.off}
            </>
          )}
        </Button>
      </div>

      {isSubscribed && (
        <>
          <div className="space-y-4 mb-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">{EN.notifications.types}</h3>

              <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-800">{EN.notifications.newComment}</p>
                    <p className="text-sm text-gray-600">{EN.notifications.newCommentDesc}</p>
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
                    <p className="font-medium text-gray-800">{EN.notifications.familyDiary}</p>
                    <p className="text-sm text-gray-600">{EN.notifications.familyDiaryDesc}</p>
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
                    <p className="font-medium text-gray-800">{EN.notifications.dailyReminder}</p>
                    <p className="text-sm text-gray-600">{EN.notifications.dailyReminderDesc}</p>
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
                    {EN.notifications.reminderTime}
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
              {EN.notifications.testNotification}
            </Button>
          </div>
        </>
      )}

      {!isSubscribed && (
        <div className="text-center py-8">
          <BellOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />

          {isIOS && !isStandalone ? (
            <>
              <p className="text-gray-600 mb-4">
                {EN.notifications.iosInstruction}
              </p>

              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-4 text-left max-w-sm mx-auto">
                <p className="text-sm text-blue-900 font-bold mb-3">
                  {EN.notifications.howToAdd}
                </p>
                <ol className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="font-bold bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-xs">1</span>
                    <span>{EN.notifications.step1}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-xs">2</span>
                    <span>{EN.notifications.step2}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-xs">3</span>
                    <span>{EN.notifications.step3}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-xs">4</span>
                    <span>{EN.notifications.step4}</span>
                  </li>
                </ol>
              </div>

              <p className="text-xs text-gray-500">
                {EN.notifications.iosNote}
              </p>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-4">
                {EN.notifications.enablePrompt}
              </p>

              {/Android/i.test(navigator.userAgent) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-left">
                  <p className="text-sm text-yellow-800 font-semibold mb-2">
                    {EN.notifications.androidTip}
                  </p>
                  <p className="text-sm text-yellow-700">
                    {EN.notifications.androidInstructions}
                  </p>
                </div>
              )}

              <Button
                onClick={handleToggleNotifications}
                size="lg"
                disabled={!canUseNotifications}
              >
                <Bell className="w-5 h-5" />
                {EN.notifications.enableButton}
              </Button>
            </>
          )}
        </div>
      )}
      </motion.div>
    </div>
  );
};
