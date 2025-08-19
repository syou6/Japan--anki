import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { 
  Heart, 
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

  const isParent = user?.role === 'parent';

  const navigation = [
    { id: 'home', label: 'ホーム', icon: Home, show: true },
    { id: 'record', label: '録音', icon: Mic, show: isParent },
    { id: 'diary', label: '日記', icon: Calendar, show: true },
    { id: 'family', label: '家族', icon: Users, show: !isParent },
  ];

  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => onViewChange('home')}
          >
            <div className="bg-blue-600 p-2 rounded-full">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                家族の絆日記
              </h1>
              <p className="text-sm text-gray-500">
                {isParent ? '親モード' : '子どもモード'}
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
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <div className="text-lg font-medium text-gray-900">
                  {user?.name}さん
                </div>
                <div className="text-sm text-gray-500">
                  {isParent ? 'ご利用者' : '管理者'}
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">
                  {user?.name?.[0] || '👤'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Settings className="w-5 h-5" />
                <span className="hidden sm:inline">設定</span>
              </Button>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">ログアウト</span>
              </Button>
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