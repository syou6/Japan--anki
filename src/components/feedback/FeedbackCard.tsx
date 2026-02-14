import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { Award, Target } from 'lucide-react';
import type { EnglishFeedback } from '../../types';

interface FeedbackCardProps {
  feedback: EnglishFeedback;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback }) => {
  const h2CountRef = useRef(0);

  const getCefrColor = (level: string) => {
    const colors: Record<string, string> = {
      'A1': 'bg-gray-100 text-gray-600',
      'A1+': 'bg-gray-100 text-gray-700',
      'A2': 'bg-sky-50 text-sky-700',
      'A2+': 'bg-sky-100 text-sky-800',
      'B1': 'bg-teal-50 text-teal-700',
      'B1+': 'bg-teal-100 text-teal-800',
      'B2': 'bg-amber-50 text-amber-700',
      'B2+': 'bg-amber-100 text-amber-800',
      'C1': 'bg-orange-50 text-orange-700',
      'C1+': 'bg-violet-50 text-violet-700'
    };
    return colors[level] || 'bg-gray-100 text-gray-600';
  };

  // Reset counter on each render
  h2CountRef.current = 0;

  const markdownComponents: Components = {
    h2: ({ children }) => {
      h2CountRef.current += 1;
      const isFirst = h2CountRef.current === 1;
      return (
        <h2
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: '#111827',
            marginTop: isFirst ? '0' : '1.5rem',
            marginBottom: '0.75rem',
            paddingTop: isFirst ? '0' : '1.25rem',
            borderTop: isFirst ? 'none' : '1px solid #f3f4f6',
          }}
        >
          {children}
        </h2>
      );
    },
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 space-y-4 shadow-card">
      {/* Header with Level */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-50">
            <Award className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">AI Feedback</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium ${getCefrColor(feedback.cefrLevel)}`}>
                {feedback.cefrLevel}
              </span>
              {feedback.targetLevel && (
                <>
                  <Target className="w-3 h-3 text-gray-300" />
                  <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium ${getCefrColor(feedback.targetLevel)}`}>
                    {feedback.targetLevel}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Markdown Content */}
      <div className="bg-gray-50 rounded-xl p-4 sm:p-5 prose prose-sm max-w-none
        prose-headings:text-gray-900
        prose-h3:text-sm prose-h3:font-semibold prose-h3:mt-3 prose-h3:mb-1.5
        prose-h4:text-sm prose-h4:font-medium prose-h4:mt-2 prose-h4:mb-1
        prose-p:text-gray-600 prose-p:leading-relaxed prose-p:my-2 prose-p:text-sm
        prose-ul:my-2 prose-li:my-0.5
        prose-strong:text-gray-800
        prose-code:bg-white prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-brand-700 prose-code:text-xs prose-code:border prose-code:border-gray-200
        prose-blockquote:border-l-2 prose-blockquote:border-brand-300 prose-blockquote:bg-brand-50 prose-blockquote:py-1 prose-blockquote:px-3 prose-blockquote:my-2
      ">
        <ReactMarkdown components={markdownComponents}>
          {feedback.markdownContent}
        </ReactMarkdown>
      </div>
    </div>
  );
};
