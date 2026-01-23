import React from 'react';
import { motion } from 'framer-motion';
import { Home, Mic, Calendar } from 'lucide-react';
import { EN } from '../../i18n/en';
import './SimplifiedNav.css';

interface SimplifiedNavProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isGuest?: boolean;
}

// Main navigation - 3 primary actions
const mainActions = [
  {
    id: 'home',
    label: EN.elderly.nav.home,
    icon: Home,
    color: 'green',
    description: EN.elderly.nav.homeDesc
  },
  {
    id: 'record',
    label: EN.elderly.nav.record,
    icon: Mic,
    color: 'red',
    description: EN.elderly.nav.recordDesc
  },
  {
    id: 'diary',
    label: EN.elderly.nav.listen,
    icon: Calendar,
    color: 'blue',
    description: EN.elderly.nav.listenDesc
  }
];

export const SimplifiedNav: React.FC<SimplifiedNavProps> = ({ 
  currentView, 
  onViewChange,
  isGuest = false 
}) => {
  // 色のマッピングを静的に定義（CSSクラス名を使用）
  const getButtonClass = (action: typeof mainActions[0], isActive: boolean) => {
    const colorClass = `nav-${action.color}-${isActive ? 'active' : 'inactive'}`;
    return colorClass;
  };

  return (
    <nav className="simplified-nav fixed bottom-0 left-0 right-0 bg-white border-t-2 sm:border-t-4 border-black z-40 safe-bottom">
      <div className="w-full px-2 sm:px-4">
        <div className="grid grid-cols-3 gap-1 sm:gap-2 py-2 sm:py-3">
          {mainActions.map((action) => {
            const isActive = currentView === action.id;
            const Icon = action.icon;
            
            return (
              <motion.button
                key={action.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => onViewChange(action.id)}
                className={`
                  relative flex flex-col items-center justify-center
                  py-2 sm:py-3 px-1 sm:px-2 rounded-lg sm:rounded-xl border-2 sm:border-3
                  ${getButtonClass(action, isActive)}
                  transition-all duration-200
                  min-h-[60px] sm:min-h-[80px]
                `}
              >
                {/* アイコン */}
                <Icon className={`
                  button-icon
                  ${isActive ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-7 h-7 sm:w-8 sm:h-8'}
                  mb-1 transition-all
                `} strokeWidth={isActive ? 3 : 2} />
                
                {/* ラベル */}
                <span className="button-label text-base sm:text-lg font-extrabold">
                  {action.label}
                </span>
                
                {/* 説明（小さく） */}
                <span className={`
                  button-description
                  text-[11px] sm:text-sm mt-0.5 font-semibold
                  ${isActive ? 'opacity-100' : 'opacity-80'}
                `}>
                  {action.description}
                </span>
                
                {/* アクティブインジケーター */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
        
        {/* Guest mode indicator */}
        {isGuest && (
          <div className="text-center pb-2">
            <span className="text-xs text-gray-600 font-medium">
              {EN.elderly.guestMode}
            </span>
          </div>
        )}
      </div>
    </nav>
  );
};