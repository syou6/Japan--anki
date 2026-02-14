import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ElderlyDiaryCard } from './ElderlyDiaryCard';
import { useDiaryStore } from '../../stores/diaryStore';
import { useGuestStore } from '../../stores/guestStore';
import { useAuthStore } from '../../stores/authStore';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { EN } from '../../i18n/en';

interface ElderlyDiaryListProps {
  isGuest?: boolean;
}

export const ElderlyDiaryList: React.FC<ElderlyDiaryListProps> = ({ isGuest = false }) => {
  const { entries, fetchEntries } = useDiaryStore();
  const { diaries: guestDiaries } = useGuestStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!isGuest && user) {
      fetchEntries();
    }
  }, [user, fetchEntries, isGuest]);

  const diariesToShow = isGuest ? guestDiaries : entries;
  
  // Sort diaries by date (newest first)
  const sortedDiaries = [...diariesToShow].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-44 space-y-8">
      {/* Header - Huge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-600 text-white rounded-2xl p-6 sm:p-8"
      >
        <h1 className="text-2xl sm:text-3xl font-semibold text-center">
          {EN.elderly.diaryList}
        </h1>
      </motion.div>

      {/* Diary List - Simple and Large */}
      <div className="space-y-8">
        {sortedDiaries.length > 0 ? (
          sortedDiaries.map(entry => (
            <ElderlyDiaryCard key={entry.id} entry={entry} />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-card"
          >
            <Calendar className="w-32 h-32 mx-auto mb-8 text-gray-400" />
            <p className="text-xl sm:text-2xl font-semibold text-gray-900">
              {EN.elderly.noDiaries}
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-gray-600 mt-6">
              {EN.elderly.pleaseRecord}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};