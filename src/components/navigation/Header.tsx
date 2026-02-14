import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';
import { useAuthStore } from '../../stores/authStore';
import { useGuestStore } from '../../stores/guestStore';
import { EN } from '../../i18n/en';
import {
  LogOut,
  Settings,
  Calendar,
  Home,
  Mic,
  Users,
  BookOpen
} from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const { user, signOut } = useAuthStore();
  const { isGuestMode } = useGuestStore();

  const isParent = user?.role === 'parent';

  const navigation = [
    { id: 'home', label: EN.nav.home, icon: Home, show: true },
    { id: 'record', label: EN.nav.record, icon: Mic, show: isParent || isGuestMode },
    { id: 'diary', label: EN.nav.diary, icon: Calendar, show: true },
    { id: 'practice', label: EN.nav.practice, icon: BookOpen, show: true },
    { id: 'settings', label: EN.nav.settings, icon: Settings, show: !isGuestMode },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2 sm:gap-3 cursor-pointer flex-shrink-0"
            whileHover={{ scale: 1.02 }}
            onClick={() => onViewChange('home')}
          >
            <Logo size="sm" />
            <div>
              <h1 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 whitespace-nowrap">
                {EN.app.name}
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                {EN.header.voiceJournal}
              </p>
            </div>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.filter(item => item.show).map(item => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === item.id
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="hidden lg:flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {isGuestMode ? EN.user.guest : user?.name}
                </div>
                <div className="text-xs text-gray-500">
                  {isGuestMode ? EN.user.trialMode : isParent ? EN.user.user : EN.user.admin}
                </div>
              </div>
              <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-brand-700">
                  {isGuestMode ? 'G' : user?.name?.[0] || '?'}
                </span>
              </div>
            </div>

            {!isGuestMode && (
              <button
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={signOut}
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-100">
          <div className="flex justify-around py-1.5 px-1">
            {navigation.filter(item => item.show).map(item => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-lg min-w-0 flex-1 transition-colors ${
                  currentView === item.id
                    ? 'text-brand-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] sm:text-xs font-medium truncate">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
