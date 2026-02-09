import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Award, Target } from 'lucide-react';
import type { EnglishFeedback } from '../../types';

interface FeedbackCardProps {
  feedback: EnglishFeedback;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback }) => {
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
      {/* Header with Level */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-indigo-100">
            <Award className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">AI Feedback</h3>
            <div className="flex items-center gap-2">
              <span className={`inline-block px-2 py-0.5 rounded-full text-sm font-medium ${getCefrColor(feedback.cefrLevel)}`}>
                {feedback.cefrLevel}
              </span>
              {feedback.targetLevel && (
                <>
                  <Target className="w-3 h-3 text-gray-400" />
                  <span className={`inline-block px-2 py-0.5 rounded-full text-sm font-medium ${getCefrColor(feedback.targetLevel)}`}>
                    → {feedback.targetLevel}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Markdown Content */}
      <div className="bg-white rounded-xl p-4 sm:p-6 prose prose-sm sm:prose max-w-none
        prose-headings:text-gray-900 prose-headings:font-bold
        prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-4 prose-h2:pt-6 prose-h2:border-t-2 prose-h2:border-gray-200
        prose-h3:text-base prose-h3:mt-4 prose-h3:mb-2
        prose-h4:text-sm prose-h4:mt-3 prose-h4:mb-1
        prose-p:text-gray-700 prose-p:leading-relaxed prose-p:my-3
        prose-ul:my-3 prose-li:my-1
        prose-strong:text-gray-900
        prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-indigo-600 prose-code:text-sm
        prose-blockquote:border-l-4 prose-blockquote:border-indigo-300 prose-blockquote:bg-indigo-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:my-3
        [&>h2:first-child]:mt-0 [&>h2:first-child]:pt-0 [&>h2:first-child]:border-t-0
      ">
        <ReactMarkdown>{feedback.markdownContent}</ReactMarkdown>
      </div>
    </div>
  );
};
