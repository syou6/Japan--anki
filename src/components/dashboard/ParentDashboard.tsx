import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { useDiaryStore } from '../../stores/diaryStore';
import { useAuthStore } from '../../stores/authStore';
import { 
  Mic, 
  Calendar, 
  Heart, 
  Users,
  TrendingUp,
  MessageCircle,
  Sun,
  Cloud
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

interface ParentDashboardProps {
  onViewChange: (view: string) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ onViewChange }) => {
  const [recentComments, setRecentComments] = useState<any[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const { entries, fetchEntries } = useDiaryStore();
  const { user } = useAuthStore();
  const today = new Date();
  const greeting = () => {
    const hour = today.getHours();
    if (hour < 12) return 'おはようございます';
    if (hour < 18) return 'こんにちは';
    return 'こんばんは';
  };

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user, fetchEntries]);

  useEffect(() => {
    // ユーザーの日記に対するコメントを取得
    const userDiaries = entries.filter(entry => entry.user_id === user?.id);
    const allComments: any[] = [];
    
    userDiaries.forEach(diary => {
      if (diary.comments && diary.comments.length > 0) {
        diary.comments.forEach(comment => {
          allComments.push({
            ...comment,
            diaryTitle: diary.ai_summary || diary.content.substring(0, 30) + '...'
          });
        });
      }
    });
    
    // 最新順にソートして最新3件を取得
    const sortedComments = allComments
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 3);
    
    setRecentComments(sortedComments);
    setCommentCount(allComments.length);
  }, [entries, user]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-4 sm:p-6 md:p-8 text-white"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 break-keep">
              {greeting()}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl opacity-90 whitespace-nowrap">
              今日は{format(today, 'M月d日', { locale: ja })}<span className="hidden sm:inline">（{format(today, 'E', { locale: ja })}）</span>です
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Sun className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 opacity-80" />
            <div className="text-right">
              <div className="text-base sm:text-lg md:text-xl font-bold">晴れ</div>
              <div className="text-sm sm:text-base md:text-lg opacity-80">25°C</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Record Voice Diary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center"
        >
          <div className="bg-red-100 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Mic className="w-10 h-10 sm:w-12 sm:h-12 text-red-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            音声日記を録音
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-6">
            今日の出来事や<span className="sm:hidden">気持ちを</span><br className="sm:hidden" />
            <span className="hidden sm:inline">気持ちを</span>音声で記録しましょう
          </p>
          <Button
            onClick={() => onViewChange('record')}
            variant="primary"
            size="xl"
            className="w-full text-base sm:text-lg"
          >
            <Mic className="w-6 h-6 sm:w-8 sm:h-8" />
            録音を始める
          </Button>
        </motion.div>

        {/* View Diaries */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          delay={0.1}
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center"
        >
          <div className="bg-blue-100 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            過去の日記を見る
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-6">
            これまでの日記を<br className="sm:hidden" />
            カレンダーで振り返る
          </p>
          <Button
            onClick={() => onViewChange('diary')}
            variant="outline"
            size="xl"
            className="w-full text-base sm:text-lg"
          >
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8" />
            日記を見る
          </Button>
        </motion.div>
      </div>

      {/* Today's Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        delay={0.2}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          今日のまとめ
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">85</div>
            <div className="text-lg text-gray-700">健康スコア</div>
          </div>

          <div className="text-center p-6 bg-blue-50 rounded-xl">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">😊</div>
            <div className="text-lg text-gray-700">今日の気分</div>
          </div>

          <div className="text-center p-6 bg-purple-50 rounded-xl">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">{commentCount}</div>
            <div className="text-lg text-gray-700">家族からの<br />コメント</div>
          </div>
        </div>
      </motion.div>

      {/* Family Messages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        delay={0.3}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            家族からのメッセージ
          </h2>
          <Users className="w-6 h-6 text-gray-500" />
        </div>

        <div className="space-y-4">
          {recentComments.length > 0 ? (
            recentComments.map((comment, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              delay={0.4 + index * 0.1}
              className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-semibold">{comment.user?.name?.[0] || '👤'}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-gray-900 text-lg">
                    {comment.user?.name || 'ユーザー'}
                  </span>
                  <span className="text-gray-500">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ja })}
                  </span>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {comment.content}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  日記: {comment.diaryTitle}
                </p>
              </div>
            </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">まだ家族からのメッセージはありません</p>
              <p className="text-sm mt-2">日記を共有して、家族とつながりましょう</p>
            </div>
          )}
        </div>

        {recentComments.length > 0 && (
          <div className="mt-6 text-center">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => onViewChange('diary')}
            >
              <MessageCircle className="w-5 h-5" />
              すべての日記とコメントを見る
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};