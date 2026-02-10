import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Check, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import type { CEFRLevel } from '../../types';
import { EN } from '../../i18n/en';

interface CEFRSettingsProps {
  currentLevel: CEFRLevel;
  onLevelChange: (level: CEFRLevel) => void;
}

const cefrLevels: { level: CEFRLevel; description: string; color: string }[] = [
  { level: 'A1', description: EN.cefr['A1'], color: 'bg-gray-100 border-gray-300 text-gray-700' },
  { level: 'A1+', description: EN.cefr['A1+'], color: 'bg-gray-200 border-gray-400 text-gray-800' },
  { level: 'A2', description: EN.cefr['A2'], color: 'bg-blue-100 border-blue-300 text-blue-700' },
  { level: 'A2+', description: EN.cefr['A2+'], color: 'bg-blue-200 border-blue-400 text-blue-800' },
  { level: 'B1', description: EN.cefr['B1'], color: 'bg-green-100 border-green-300 text-green-700' },
  { level: 'B1+', description: EN.cefr['B1+'], color: 'bg-green-200 border-green-400 text-green-800' },
  { level: 'B2', description: EN.cefr['B2'], color: 'bg-yellow-100 border-yellow-300 text-yellow-700' },
  { level: 'B2+', description: EN.cefr['B2+'], color: 'bg-yellow-200 border-yellow-400 text-yellow-800' },
  { level: 'C1', description: EN.cefr['C1'], color: 'bg-orange-100 border-orange-300 text-orange-700' },
  { level: 'C1+', description: EN.cefr['C1+'], color: 'bg-purple-100 border-purple-300 text-purple-700' }
];

export const CEFRSettings: React.FC<CEFRSettingsProps> = ({ currentLevel, onLevelChange }) => {
  const [showLevelChart, setShowLevelChart] = useState(false);

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

      <div className="grid gap-2">
        {cefrLevels.map(({ level, description, color }) => {
          const isSelected = currentLevel === level;
          return (
            <motion.button
              key={level}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onLevelChange(level)}
              className={`relative flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded-lg font-bold text-sm ${color}`}>
                  {level}
                </span>
                <span className="text-gray-700 text-sm">{description}</span>
              </div>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Check your English Level - Versant Score Chart */}
      <div className="mt-6 border border-blue-200 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowLevelChart(!showLevelChart)}
          className="w-full px-4 py-3 bg-blue-50 flex items-center justify-between hover:bg-blue-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-800">Check your English Level (Versant Score)</span>
          </div>
          {showLevelChart ? (
            <ChevronUp className="w-5 h-5 text-blue-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-blue-600" />
          )}
        </button>
        <AnimatePresence>
          {showLevelChart && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-blue-200"
            >
              <div className="p-4 bg-white">
                <img
                  src="https://www.pearson.com/content/dam/one-dot-com/one-dot-com/english/PublishingImages/Versant/versant-score-cefr-chart.png"
                  alt="Versant Score to CEFR Level Chart"
                  className="w-full rounded-lg border border-gray-200"
                  onError={(e) => {
                    // Fallback to text if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden mt-4 text-sm text-gray-600">
                  <p className="font-medium mb-2">Versant Score → CEFR Level:</p>
                  <ul className="space-y-1">
                    <li>26-35 → A1 (Beginner)</li>
                    <li>36-42 → A1+ / A2</li>
                    <li>43-50 → A2+ / B1</li>
                    <li>51-57 → B1+ / B2</li>
                    <li>58-68 → B2+ / C1</li>
                    <li>69-80 → C1+ (Proficient)</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
