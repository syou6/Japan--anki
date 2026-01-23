import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Check } from 'lucide-react';
import type { CEFRLevel } from '../../types';
import { EN } from '../../i18n/en';

interface CEFRSettingsProps {
  currentLevel: CEFRLevel;
  onLevelChange: (level: CEFRLevel) => void;
}

const cefrLevels: { level: CEFRLevel; description: string; color: string }[] = [
  { level: 'A1', description: EN.cefr.A1, color: 'bg-gray-100 border-gray-300 text-gray-700' },
  { level: 'A2', description: EN.cefr.A2, color: 'bg-blue-100 border-blue-300 text-blue-700' },
  { level: 'B1', description: EN.cefr.B1, color: 'bg-green-100 border-green-300 text-green-700' },
  { level: 'B2', description: EN.cefr.B2, color: 'bg-yellow-100 border-yellow-300 text-yellow-700' },
  { level: 'C1', description: EN.cefr.C1, color: 'bg-orange-100 border-orange-300 text-orange-700' },
  { level: 'C2', description: EN.cefr.C2, color: 'bg-purple-100 border-purple-300 text-purple-700' }
];

export const CEFRSettings: React.FC<CEFRSettingsProps> = ({ currentLevel, onLevelChange }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Your English Level</h3>
          <p className="text-gray-600">Select your current CEFR level for personalized feedback</p>
        </div>
      </div>

      <div className="grid gap-3">
        {cefrLevels.map(({ level, description, color }) => {
          const isSelected = currentLevel === level;
          return (
            <motion.button
              key={level}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onLevelChange(level)}
              className={`relative flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-lg font-bold ${color}`}>
                  {level}
                </span>
                <span className="text-gray-700">{description}</span>
              </div>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> If you're preparing for TOEIC or Versant tests,
          B1 (Intermediate) is recommended for TOEIC 500 level learners.
        </p>
      </div>
    </div>
  );
};
