import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
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
  maxVisible = 3
}) => {
  const [showMore, setShowMore] = useState(false);

  const visibleChoices = showMore ? choices : choices.slice(0, maxVisible);
  const hasMore = choices.length > maxVisible;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      {title && (
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          {title}
        </h3>
      )}

      <div className="space-y-2">
        <AnimatePresence mode="wait">
          {visibleChoices.map((choice, index) => (
            <motion.button
              key={choice.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect(choice.id)}
              className={`
                w-full p-3 rounded-xl border transition-all
                flex items-center gap-3
                ${selected === choice.id
                  ? 'bg-brand-50 text-brand-700 border-brand-200'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }
              `}
            >
              {choice.icon && (
                <div className="text-xl">
                  {choice.icon}
                </div>
              )}

              <div className="flex-1 text-left">
                <div className="font-medium text-sm">
                  {choice.label}
                </div>
                {choice.description && (
                  <div className="text-xs text-gray-500 mt-0.5">
                    {choice.description}
                  </div>
                )}
              </div>

              {selected === choice.id && (
                <Check className="w-4 h-4 text-brand-600" />
              )}
            </motion.button>
          ))}
        </AnimatePresence>

        {hasMore && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowMore(!showMore)}
            className="
              w-full p-3 rounded-xl border border-gray-200
              bg-gray-50 text-gray-500 hover:bg-gray-100
              flex items-center justify-center gap-1.5
              font-medium text-sm transition-all
            "
          >
            {showMore ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>{EN.dialog.close}</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span>{EN.dialog.showMore} ({choices.length - maxVisible})</span>
              </>
            )}
          </motion.button>
        )}
      </div>
    </div>
  );
};
