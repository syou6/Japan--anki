import React from 'react';
import { motion } from 'framer-motion';
import { Home, Mic, Calendar } from 'lucide-react';
import './SimplifiedNav.css';

interface SimplifiedNavProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isGuest?: boolean;
}

// 最大3つの主要機能のみ表示
const mainActions = [
  {
    id: 'home',
    label: 'ホーム',
    icon: Home,
    color: 'green',
    description: 'メイン画面'
  },
  {
    id: 'record',
    label: '録音する',
    icon: Mic,
    color: 'red',
    description: '日記を録音'
  },
  {
    id: 'diary',
    label: '聞く',
    icon: Calendar,
    color: 'blue',
    description: '日記を聞く'
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
        
        {/* ゲストモード表示 */}
        {isGuest && (
          <div className="text-center pb-2">
            <span className="text-xs text-gray-600 font-medium">
              ゲストモード（お試し中）
            </span>
          </div>
        )}
      </div>
    </nav>
  );
};