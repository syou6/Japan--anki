import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';
import { useAuthStore } from '../../stores/authStore';
import { useGuestStore } from '../../stores/guestStore';
import { 
  LogOut, 
  Settings, 
  Calendar,
  Home,
  Mic,
  Users
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
    { id: 'home', label: 'ホーム', icon: Home, show: true },
    { id: 'record', label: '録音', icon: Mic, show: isParent || isGuestMode },
    { id: 'diary', label: '日記', icon: Calendar, show: true },
    { id: 'family', label: '共有', icon: Users, show: !isGuestMode },
  ];

  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
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
              <h1 className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-gray-900 whitespace-nowrap">
                日記AI
              </h1>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 hidden sm:block">
                Voice Journal
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
              <div className="text-right">
                <div className="text-sm md:text-base lg:text-lg font-medium text-gray-900 whitespace-nowrap">
                  {isGuestMode ? 'ゲスト' : `${user?.name}さん`}
                </div>
                <div className="text-xs md:text-sm text-gray-500">
                  {isGuestMode ? 'お試し利用' : isParent ? 'ご利用者' : '管理者'}
                </div>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-lg md:text-xl font-bold text-blue-600">
                  {isGuestMode ? 'G' : user?.name?.[0] || '👤'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              {!isGuestMode && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2 sm:px-3"
                  onClick={() => onViewChange('settings')}
                >
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden xl:inline">設定</span>
                </Button>
              )}
              {!isGuestMode && (
                <Button variant="outline" size="sm" onClick={signOut} className="p-2 sm:px-3">
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden xl:inline">ログアウト</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <div className="flex justify-around py-2">
            {navigation.filter(item => item.show).map(item => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                  currentView === item.id
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};