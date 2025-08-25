import React from 'react';
import { motion } from 'framer-motion';
import { Home, Mic, Calendar, Users } from 'lucide-react';
import { colors, buttonStyles } from '../../styles/colorPalette';
import './ElderlyNav.css';

interface ElderlyNavProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isGuest?: boolean;
}

// シンプルで分かりやすい4つの機能
const mainActions = [
  {
    id: 'home',
    label: 'ホーム',
    icon: Home,
    feature: 'home' as const,
    description: 'トップ'
  },
  {
    id: 'record',
    label: '録音',
    icon: Mic,
    feature: 'record' as const,
    description: '話す'
  },
  {
    id: 'diary',
    label: '再生',
    icon: Calendar,
    feature: 'play' as const,
    description: '聞く'
  },
  {
    id: 'family',
    label: '家族',
    icon: Users,
    feature: 'home' as const,
    description: '共有'
  }
];

export const ElderlyNav: React.FC<ElderlyNavProps> = ({ 
  currentView, 
  onViewChange,
  isGuest = false 
}) => {
  return (
    <nav className="elderly-nav">
      <div className="nav-container">
        {mainActions.map((action) => {
          const isActive = currentView === action.id;
          const Icon = action.icon;
          
          return (
            <motion.button
              key={action.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewChange(action.id)}
              className="nav-button"
              style={{
                backgroundColor: isActive ? buttonStyles[action.feature].active.backgroundColor : buttonStyles[action.feature].inactive.backgroundColor,
                borderColor: isActive ? buttonStyles[action.feature].active.borderColor : buttonStyles[action.feature].inactive.borderColor,
                color: isActive ? colors.text.onDark : colors.text.primary,
                boxShadow: isActive ? `0 8px 20px ${buttonStyles[action.feature].active.backgroundColor}40` : `0 4px 12px rgba(0,0,0,0.1)`,
                transform: isActive ? 'translateY(-4px)' : 'translateY(0)',
                borderWidth: isActive ? '5px' : '4px',
                borderStyle: 'solid',
              }}
            >
              {/* 大きなアイコン */}
              <div className="icon-wrapper">
                <Icon 
                  size={isActive ? 44 : 40} 
                  strokeWidth={isActive ? 3.5 : 3}
                  style={{ color: isActive ? 'white' : '#000000' }}
                />
              </div>
              
              {/* 大きな文字 */}
              <div className="label-wrapper" style={{ color: isActive ? '#ffffff' : '#000000' }}>
                <span 
                  data-active={isActive}
                  className="elderly-nav-label-main"
                  style={{ 
                    color: isActive ? '#ffffff' : '#000000',
                    fontSize: '20px',
                    fontWeight: '900',
                    display: 'block',
                    lineHeight: '1.2',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {action.label}
                </span>
                <span 
                  data-active={isActive}
                  className="elderly-nav-label-sub"
                  style={{ 
                    color: isActive ? '#ffffff' : '#333333',
                    fontSize: '14px',
                    fontWeight: '700',
                    display: 'block',
                    opacity: isActive ? 1 : 0.8,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {action.description}
                </span>
              </div>
              
              {/* アクティブ表示 */}
              {isActive && (
                <motion.div
                  className="active-indicator"
                  layoutId="activeIndicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  選択中
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
      
      {/* ゲストモード表示 */}
      {isGuest && (
        <div className="guest-indicator">
          <span>お試し中</span>
        </div>
      )}
    </nav>
  );
};