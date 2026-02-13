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
    <header className="bg-navy-500 border-b-4 border-navy-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-1.5 sm:gap-2 md:gap-3 cursor-pointer flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            onClick={() => onViewChange('home')}
          >
            <Logo size="sm" />
            <div>
              <h1 className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold whitespace-nowrap" style={{ color: '#FFF5E1' }}>
                {EN.app.name}
              </h1>
              <p className="text-[10px] sm:text-xs md:text-sm hidden sm:block" style={{ color: '#FFE4C4' }}>
                {EN.header.voiceJournal}
              </p>
            </div>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navigation.filter(item => item.show).map(item => (
              <Button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                variant={currentView === item.id ? 'primary' : 'ghost'}
                size="md"
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Button>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
            <div className="hidden lg:flex items-center gap-2 md:gap-3">
              <div className="text-right header-user-info">
                <div className="text-sm md:text-base lg:text-lg font-medium whitespace-nowrap">
                  {isGuestMode ? EN.user.guest : user?.name}
                </div>
                <div className="text-xs md:text-sm">
                  {isGuestMode ? EN.user.trialMode : isParent ? EN.user.user : EN.user.admin}
                </div>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-lg md:text-xl font-bold text-blue-600">
                  {isGuestMode ? 'G' : user?.name?.[0] || '👤'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              {/* 設定ボタンは一時的に非表示 */}
              {/* {!isGuestMode && (
                <button
                  className="bg-white border-2 border-gray-300 rounded-lg p-2 sm:px-3 hover:bg-gray-100 flex items-center gap-1"
                  onClick={() => onViewChange('settings')}
                >
                  <Settings className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#000000' }} />
                  <span className="hidden xl:inline text-black font-bold">設定</span>
                </button>
              )} */}
              {!isGuestMode && (
                <button
                  className="bg-white border-2 border-gray-300 rounded-lg p-2 sm:px-3 hover:bg-gray-100 flex items-center gap-1"
                  onClick={signOut}
                >
                  <LogOut className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#000000' }} />
                  <span className="hidden xl:inline text-black font-bold">{EN.header.logout}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t-2 border-gray-300 bg-white">
          <div className="flex justify-around py-2 px-1">
            {navigation.filter(item => item.show).map(item => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex flex-col items-center gap-0.5 py-1.5 px-1.5 sm:px-3 rounded-lg border-2 min-w-0 flex-1 ${
                  currentView === item.id
                    ? 'bg-blue-100 border-blue-500'
                    : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: currentView === item.id ? '#2563eb' : '#000000' }} />
                <span className="text-[10px] sm:text-sm font-bold truncate" style={{ color: currentView === item.id ? '#2563eb' : '#000000' }}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};