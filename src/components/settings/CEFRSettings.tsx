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
          <h3 className="text-xl font-bold text-gray-900">Your Japanese Level</h3>
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

      {/* Check your Japanese Level - JLPT to CEFR Chart */}
      <div className="mt-6 border border-blue-200 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowLevelChart(!showLevelChart)}
          className="w-full px-4 py-3 bg-blue-50 flex items-center justify-between hover:bg-blue-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-800">Check your Japanese Level (JLPT → CEFR)</span>
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
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-3">JLPT Level → CEFR Level:</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-gray-100 rounded font-bold text-xs">N5</span>
                      <span>→ A1 (Beginner) — Hiragana, Katakana, basic greetings</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-blue-100 rounded font-bold text-xs">N4</span>
                      <span>→ A2 (Elementary) — Daily conversation, ~300 kanji</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-green-100 rounded font-bold text-xs">N3</span>
                      <span>→ B1 (Intermediate) — General topics, ~650 kanji</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-yellow-100 rounded font-bold text-xs">N2</span>
                      <span>→ B2 (Upper Intermediate) — Abstract topics, ~1000 kanji</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-orange-100 rounded font-bold text-xs">N1</span>
                      <span>→ C1 (Advanced) — Complex texts, ~2000 kanji</span>
                    </li>
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
