import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  BookOpen,
  Volume2,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Award,
  TrendingUp
} from 'lucide-react';
import type { EnglishFeedback } from '../../types';

interface FeedbackCardProps {
  feedback: EnglishFeedback;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('grammar');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getCefrColor = (level: string) => {
    const colors: Record<string, string> = {
      'A1': 'bg-gray-100 text-gray-700',
      'A2': 'bg-blue-100 text-blue-700',
      'B1': 'bg-green-100 text-green-700',
      'B2': 'bg-yellow-100 text-yellow-700',
      'C1': 'bg-orange-100 text-orange-700',
      'C2': 'bg-purple-100 text-purple-700'
    };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 sm:p-6 space-y-4">
      {/* Header with Score */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${getScoreColor(feedback.overallScore)}`}>
            <span className="text-xl font-bold">{feedback.overallScore}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">AI Feedback</h3>
            <span className={`inline-block px-2 py-0.5 rounded-full text-sm font-medium ${getCefrColor(feedback.cefrLevel)}`}>
              CEFR {feedback.cefrLevel}
            </span>
          </div>
        </div>
        <Award className="w-8 h-8 text-indigo-400" />
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl p-4">
        <p className="text-gray-700">{feedback.summary}</p>
      </div>

      {/* Grammar Corrections */}
      {feedback.grammarCorrections.length > 0 && (
        <div className="bg-white rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('grammar')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-gray-900">Grammar Corrections</span>
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                {feedback.grammarCorrections.length}
              </span>
            </div>
            {expandedSection === 'grammar' ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <AnimatePresence>
            {expandedSection === 'grammar' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-gray-100"
              >
                <div className="p-4 space-y-3">
                  {feedback.grammarCorrections.map((correction, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-start gap-2 mb-2">
                        <span className="line-through text-red-500">{correction.original}</span>
                        <TrendingUp className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                        <span className="text-green-600 font-medium">{correction.corrected}</span>
                      </div>
                      <p className="text-sm text-gray-600">{correction.explanation}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Vocabulary Suggestions */}
      {feedback.vocabularySuggestions.length > 0 && (
        <div className="bg-white rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('vocabulary')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold text-gray-900">Vocabulary Tips</span>
              <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">
                {feedback.vocabularySuggestions.length}
              </span>
            </div>
            {expandedSection === 'vocabulary' ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <AnimatePresence>
            {expandedSection === 'vocabulary' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-gray-100"
              >
                <div className="p-4 space-y-3">
                  {feedback.vocabularySuggestions.map((suggestion, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gray-600">{suggestion.original}</span>
                        <span className="text-gray-400">→</span>
                        <span className="text-indigo-600 font-medium">{suggestion.suggestion}</span>
                      </div>
                      <p className="text-sm text-gray-500 italic">"{suggestion.example}"</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Pronunciation Tips */}
      {feedback.pronunciationTips.length > 0 && (
        <div className="bg-white rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('pronunciation')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-green-500" />
              <span className="font-semibold text-gray-900">Pronunciation Tips</span>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                {feedback.pronunciationTips.length}
              </span>
            </div>
            {expandedSection === 'pronunciation' ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <AnimatePresence>
            {expandedSection === 'pronunciation' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-gray-100"
              >
                <div className="p-4 space-y-3">
                  {feedback.pronunciationTips.map((tip, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{tip.word}</span>
                        <span className="text-indigo-500 font-mono text-sm">[{tip.phonetic}]</span>
                      </div>
                      <p className="text-sm text-gray-600">{tip.tip}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Reading Materials */}
      {feedback.readingMaterials.length > 0 && (
        <div className="bg-white rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('reading')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-purple-500" />
              <span className="font-semibold text-gray-900">Recommended Reading</span>
              <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">
                {feedback.readingMaterials.length}
              </span>
            </div>
            {expandedSection === 'reading' ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <AnimatePresence>
            {expandedSection === 'reading' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-gray-100"
              >
                <div className="p-4 space-y-3">
                  {feedback.readingMaterials.map((material, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <h4 className="font-medium text-gray-900 mb-1">{material.title}</h4>
                      <p className="text-sm text-gray-600">{material.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Encouragement */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-4 text-white">
        <p className="text-center font-medium">{feedback.encouragement}</p>
      </div>
    </div>
  );
};
