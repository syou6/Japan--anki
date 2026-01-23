import React from 'react';
import { CEFRSettings } from './CEFRSettings';
import { NotificationSettings } from './NotificationSettings';
import { SubscriptionManager } from '../subscription/SubscriptionManager';
import { useAuthStore } from '../../stores/authStore';
import { EN } from '../../i18n/en';
import type { CEFRLevel } from '../../types';
import toast from 'react-hot-toast';

export const SettingsView: React.FC = () => {
  const { user, updateCefrLevel } = useAuthStore();

  const handleCefrChange = async (level: CEFRLevel) => {
    try {
      await updateCefrLevel(level);
      toast.success(`CEFR level updated to ${level}`);
    } catch (error) {
      toast.error('Failed to update CEFR level');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
        {EN.nav.settings}
      </h1>

      {/* CEFR Level Settings */}
      <CEFRSettings
        currentLevel={user?.cefr_level || 'B1'}
        onLevelChange={handleCefrChange}
      />

      {/* Notification Settings */}
      <NotificationSettings />

      {/* Subscription Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Subscription
        </h2>
        <SubscriptionManager />
      </div>
    </div>
  );
};
