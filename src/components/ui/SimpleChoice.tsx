import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { EN } from '../../i18n/en';

interface Choice {
  id: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
  description?: string;
}

interface SimpleChoiceProps {
  choices: Choice[];
  onSelect: (id: string) => void;
  selected?: string;
  title?: string;
  maxVisible?: number;
}

export const SimpleChoice: React.FC<SimpleChoiceProps> = ({
  choices,
  onSelect,
  selected,
  title,
  maxVisible = 3 // 最大3つまで表示
}) => {
  const [showMore, setShowMore] = useState(false);
  
  // 表示する選択肢を制限
  const visibleChoices = showMore ? choices : choices.slice(0, maxVisible);
  const hasMore = choices.length > maxVisible;

  return (
    <div className="bg-white rounded-xl border-3 border-black p-6">
      {title && (
        <h3 className="text-xl font-bold text-black mb-4">
          {title}
        </h3>
      )}
      
      <div className="space-y-3">
        <AnimatePresence mode="wait">
          {visibleChoices.map((choice, index) => (
            <motion.button
              key={choice.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelect(choice.id)}
              className={`
                w-full p-4 rounded-xl border-3 transition-all
                flex items-center gap-4
                ${selected === choice.id
                  ? `${choice.color || 'bg-black'} text-white border-white`
                  : 'bg-white text-black border-black hover:bg-gray-50'
                }
              `}
            >
              {/* アイコン */}
              {choice.icon && (
                <div className={`
                  text-3xl
                  ${selected === choice.id ? 'opacity-100' : 'opacity-80'}
                `}>
                  {choice.icon}
                </div>
              )}
              
              {/* テキスト */}
              <div className="flex-1 text-left">
                <div className="font-bold text-lg">
                  {choice.label}
                </div>
                {choice.description && (
                  <div className={`
                    text-sm mt-1
                    ${selected === choice.id ? 'opacity-90' : 'opacity-70'}
                  `}>
                    {choice.description}
                  </div>
                )}
              </div>
              
              {/* 選択インジケーター */}
              {selected === choice.id && (
                <div className="text-2xl">
                  ✓
                </div>
              )}
            </motion.button>
          ))}
        </AnimatePresence>
        
        {/* Show more button */}
        {hasMore && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowMore(!showMore)}
            className="
              w-full p-4 rounded-xl border-3 border-gray-500
              bg-gray-100 text-gray-700 hover:bg-gray-200
              flex items-center justify-center gap-2
              font-bold text-lg transition-all
            "
          >
            {showMore ? (
              <>
                <ChevronUp className="w-5 h-5" />
                <span>{EN.dialog.close}</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-5 h-5" />
                <span>{EN.dialog.showMore} ({choices.length - maxVisible})</span>
              </>
            )}
          </motion.button>
        )}
      </div>
    </div>
  );
};