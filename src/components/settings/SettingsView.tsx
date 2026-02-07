import React, { useState } from 'react';
import { CEFRSettings } from './CEFRSettings';
import { NotificationSettings } from './NotificationSettings';
import { SubscriptionManager } from '../subscription/SubscriptionManager';
import { ApiUsageMonitor } from '../ApiUsageMonitor';
import { useAuthStore } from '../../stores/authStore';
import { EN } from '../../i18n/en';
import type { CEFRLevel } from '../../types';
import toast from 'react-hot-toast';
import { ChevronDown, ChevronUp, Activity } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { user, updateCefrLevel } = useAuthStore();
  const [showApiUsage, setShowApiUsage] = useState(false);

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

      {/* API Usage Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div
          onClick={() => setShowApiUsage(!showApiUsage)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">{EN.settings.apiUsage || 'API Usage'}</span>
          </div>
          {showApiUsage ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
        {showApiUsage && (
          <div className="px-6 pb-6">
            <ApiUsageMonitor />
          </div>
        )}
      </div>
    </div>
  );
};
