import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Trash2, Clock, AlertCircle } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useGuestStore } from '../../stores/guestStore';
import toast from 'react-hot-toast';

interface GuestDiaryCardProps {
  diary: any;
}

export const GuestDiaryCard: React.FC<GuestDiaryCardProps> = ({ diary }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const { deleteGuestDiary } = useGuestStore();

  const handlePlayPause = () => {
    if (!diary.voice_data) return;

    if (!audioElement) {
      const audio = new Audio(diary.voice_data);
      audio.onended = () => setIsPlaying(false);
      setAudioElement(audio);
      audio.play();
      setIsPlaying(true);
    } else {
      if (isPlaying) {
        audioElement.pause();
        setIsPlaying(false);
      } else {
        audioElement.play();
        setIsPlaying(true);
      }
    }
  };

  const handleDelete = () => {
    if (window.confirm('この日記を削除してもよろしいですか？')) {
      deleteGuestDiary(diary.id);
      toast.success('日記を削除しました');
    }
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case '喜び': return 'text-yellow-600 bg-yellow-50';
      case '悲しみ': return 'text-blue-600 bg-blue-50';
      case '怒り': return 'text-red-600 bg-red-50';
      case '不安': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // 残り時間を計算
  const expiresAt = new Date(diary.expires_at);
  const now = new Date();
  const remainingMinutes = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 60000));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
    >
      {/* 有効期限警告 */}
      {remainingMinutes <= 5 && remainingMinutes > 0 && (
        <div className="bg-orange-50 border-b border-orange-200 px-4 py-2 rounded-t-xl">
          <div className="flex items-center gap-2 text-orange-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">
              この日記はあと{remainingMinutes}分で削除されます
            </span>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEmotionColor(diary.emotion)}`}>
                {diary.emotion}
              </span>
              <span className={`text-sm font-medium ${getHealthScoreColor(diary.health_score)}`}>
                健康スコア: {diary.health_score}
              </span>
              <div className="flex items-center gap-1 text-gray-500">
                <Clock className="w-4 h-4" />
                <span className="text-xs">
                  {remainingMinutes > 0 ? `残り${remainingMinutes}分` : '期限切れ'}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              {format(new Date(diary.created_at), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
            </p>
          </div>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          {diary.title}
        </h3>

        <p className="text-gray-700 whitespace-pre-wrap mb-4">
          {diary.content}
        </p>

        {diary.ai_summary && (
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-blue-900 mb-1">AI要約</p>
            <p className="text-sm text-blue-800">{diary.ai_summary}</p>
          </div>
        )}

        {diary.voice_data && (
          <button
            onClick={handlePlayPause}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5 text-gray-700" />
                <span className="text-gray-700">停止</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 text-gray-700" />
                <span className="text-gray-700">音声を再生</span>
              </>
            )}
          </button>
        )}

        {/* ゲストモード表示 */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            ゲストモード - この日記は30分後に自動削除されます
          </p>
        </div>
      </div>
    </motion.div>
  );
};