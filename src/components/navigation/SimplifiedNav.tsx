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
  const getButtonClass = (action: typeof mainActions[0], isActive: boolean) => {
    return `nav-${action.color}-${isActive ? 'active' : 'inactive'}`;
  };

  return (
    <nav className="simplified-nav fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200 z-40 safe-bottom">
      <div className="w-full px-2 sm:px-4">
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 py-2 sm:py-3">
          {mainActions.map((action) => {
            const isActive = currentView === action.id;
            const Icon = action.icon;

            return (
              <motion.button
                key={action.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => onViewChange(action.id)}
                className={`
                  relative flex flex-col items-center justify-center
                  py-2 sm:py-3 px-1 sm:px-2 rounded-xl
                  ${getButtonClass(action, isActive)}
                  transition-all duration-200
                  min-h-[56px] sm:min-h-[64px]
                `}
              >
                <Icon className={`
                  button-icon
                  ${isActive ? 'w-6 h-6 sm:w-7 sm:h-7' : 'w-5 h-5 sm:w-6 sm:h-6'}
                  mb-1 transition-all
                `} strokeWidth={isActive ? 2.5 : 1.5} />

                <span className="button-label text-sm sm:text-base font-semibold">
                  {action.label}
                </span>

                <span className={`
                  button-description
                  text-[10px] sm:text-xs mt-0.5
                  ${isActive ? 'opacity-90' : 'opacity-60'}
                `}>
                  {action.description}
                </span>
              </motion.button>
            );
          })}
        </div>

        {isGuest && (
          <div className="text-center pb-2">
            <span className="text-xs text-gray-400">
              {EN.elderly.guestMode}
            </span>
          </div>
        )}
      </div>
    </nav>
  );
};
