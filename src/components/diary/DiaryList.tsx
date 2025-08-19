import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDiaryStore } from '../../stores/diaryStore';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../ui/Button';
import { DiaryCard } from './DiaryCard';
import { Calendar, List, Plus } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale';

type ViewMode = 'list' | 'calendar';

export const DiaryList: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showRecorder, setShowRecorder] = useState(false);

  const { entries, loading, fetchEntries } = useDiaryStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchEntries();
  }, []);

  const getEntriesForDate = (date: Date) => {
    return entries.filter(entry => 
      isSameDay(new Date(entry.created_at), date)
    );
  };

  const renderCalendarView = () => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900">
            {format(selectedDate, 'yyyy年M月', { locale: ja })}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
              className="px-4 py-2 text-lg text-gray-600 hover:text-gray-900"
            >
              ← 前月
            </button>
            <button
              onClick={() => setSelectedDate(new Date())}
              className="px-4 py-2 text-lg text-blue-600 hover:text-blue-800 font-medium"
            >
              今月
            </button>
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
              className="px-4 py-2 text-lg text-gray-600 hover:text-gray-900"
            >
              次月 →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['月', '火', '水', '木', '金', '土', '日'].map(day => (
            <div key={day} className="p-3 text-center text-lg font-medium text-gray-500">
              {day}
            </div>
          ))}
          
          {days.map(day => {
            const dayEntries = getEntriesForDate(day);
            const isToday = isSameDay(day, new Date());
            
            return (
              <motion.div
                key={day.toISOString()}
                whileHover={{ scale: 1.02 }}
                className={`p-2 border rounded-lg cursor-pointer transition-colors ${
                  isToday 
                    ? 'bg-blue-100 border-blue-300' 
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedDate(day)}
              >
                <div className="text-lg font-medium text-gray-900">
                  {format(day, 'd')}
                </div>
                {dayEntries.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {dayEntries.slice(0, 2).map(entry => (
                      <div
                        key={entry.id}
                        className="text-xs bg-blue-500 text-white rounded px-1 py-0.5 truncate"
                      >
                        {entry.ai_summary || entry.content.slice(0, 10)}...
                      </div>
                    ))}
                    {dayEntries.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayEntries.length - 2}件
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Selected Date Entries */}
        <div className="mt-8">
          <h4 className="text-xl font-bold text-gray-900 mb-4">
            {format(selectedDate, 'M月d日（E）', { locale: ja })}の日記
          </h4>
          <div className="space-y-4">
            {getEntriesForDate(selectedDate).map(entry => (
              <DiaryCard key={entry.id} entry={entry} />
            ))}
            {getEntriesForDate(selectedDate).length === 0 && (
              <div className="text-center py-8 text-gray-500 text-lg">
                この日の日記はありません
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">
          {user?.role === 'parent' ? 'あなたの日記' : `${user?.name}さんの日記`}
        </h1>

        <div className="flex gap-3">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 text-lg font-medium rounded-lg transition-colors flex items-center gap-2 ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-5 h-5" />
              リスト
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 text-lg font-medium rounded-lg transition-colors flex items-center gap-2 ${
                viewMode === 'calendar'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-5 h-5" />
              カレンダー
            </button>
          </div>

          {user?.role === 'parent' && (
            <Button onClick={() => setShowRecorder(true)} variant="primary">
              <Plus className="w-5 h-5" />
              新しい日記
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {viewMode === 'calendar' ? (
        renderCalendarView()
      ) : (
        <div className="space-y-6">
          {entries.length > 0 ? (
            entries.map(entry => (
              <DiaryCard key={entry.id} entry={entry} />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 bg-gray-50 rounded-2xl"
            >
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                まだ日記がありません
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                最初の日記を録音してみましょう
              </p>
              {user?.role === 'parent' && (
                <Button onClick={() => setShowRecorder(true)} size="lg">
                  <Plus className="w-6 h-6" />
                  録音を始める
                </Button>
              )}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};