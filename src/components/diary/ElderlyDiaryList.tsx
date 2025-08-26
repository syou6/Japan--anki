import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ElderlyDiaryCard } from './ElderlyDiaryCard';
import { useDiaryStore } from '../../stores/diaryStore';
import { useGuestStore } from '../../stores/guestStore';
import { useAuthStore } from '../../stores/authStore';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale';

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
        className="bg-navy-900 text-white rounded-3xl p-8 sm:p-10 border-4 border-navy-900"
      >
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-center">
          日記一覧
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
            className="bg-white rounded-3xl border-4 border-navy-900 p-16 text-center"
          >
            <Calendar className="w-32 h-32 mx-auto mb-8 text-gray-400" />
            <p className="text-4xl sm:text-5xl font-black text-navy-900">
              日記がありません
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-gray-600 mt-6">
              録音してください
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};