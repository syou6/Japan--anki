import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../stores/authStore';
import type { DiaryEntry } from '../../types';
import { 
  Play, 
  Pause, 
  MessageCircle, 
  Heart, 
  ThumbsUp, 
  Smile,
  Calendar,
  Volume2,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface DiaryCardProps {
  entry: DiaryEntry;
}

export const DiaryCard: React.FC<DiaryCardProps> = ({ entry }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [newComment, setNewComment] = useState('');

  const { user } = useAuthStore();
  const isOwner = user?.id === entry.user_id;

  useEffect(() => {
    if (entry.voice_url) {
      const audio = new Audio(entry.voice_url);
      audio.onended = () => setIsPlaying(false);
      setAudioElement(audio);

      return () => {
        audio.pause();
        setAudioElement(null);
      };
    }
  }, [entry.voice_url]);

  const handlePlayPause = () => {
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  const getEmotionEmoji = (emotion: string) => {
    const emotionMap: { [key: string]: string } = {
      '喜び': '😊',
      '楽しい': '😄',
      '悲しみ': '😢',
      '不安': '😰',
      '平穏': '😌',
      '怒り': '😤',
      '満足': '😇',
      '感謝': '🙏',
      '愛情': '❤️'
    };
    return emotionMap[emotion] || '😌';
  };

  const getHealthColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              {entry.user?.name?.[0] || '👤'}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {entry.user?.name || 'ユーザー'}
              </h3>
              <div className="flex items-center gap-3 text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-lg">
                    {format(new Date(entry.created_at), 'M月d日（E）HH:mm', { locale: ja })}
                  </span>
                </div>
                {entry.emotion && (
                  <div className="flex items-center gap-1">
                    <span className="text-xl">{getEmotionEmoji(entry.emotion)}</span>
                    <span className="text-lg">{entry.emotion}</span>
                  </div>
                )}
                {entry.health_score && (
                  <div className={`text-lg font-medium ${getHealthColor(entry.health_score)}`}>
                    健康度: {entry.health_score}/100
                  </div>
                )}
              </div>
            </div>
          </div>

          {isOwner && (
            <Button variant="ghost" size="sm">
              <Trash2 className="w-5 h-5 text-red-500" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* AI Summary */}
        {entry.ai_summary && (
          <div className="mb-4 p-4 bg-blue-50 rounded-xl">
            <div className="text-lg font-medium text-blue-900 mb-2">
              📋 AI要約
            </div>
            <p className="text-lg text-blue-800">
              {entry.ai_summary}
            </p>
          </div>
        )}

        {/* Voice Player */}
        {entry.voice_url && (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  onClick={handlePlayPause}
                  variant="outline"
                  size="sm"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-5 h-5" />
                      停止
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      再生
                    </>
                  )}
                </Button>
                <div className="flex items-center gap-2 text-gray-600">
                  <Volume2 className="w-4 h-4" />
                  <span className="text-lg">音声日記</span>
                </div>
              </div>
              {entry.duration && (
                <div className="text-lg text-gray-500">
                  {Math.floor(entry.duration / 60)}:{(entry.duration % 60).toString().padStart(2, '0')}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Text Content */}
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {entry.content}
          </p>
        </div>

        {/* Tags */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-lg">いいね</span>
            </Button>
            <Button variant="ghost" size="sm">
              <ThumbsUp className="w-5 h-5 text-blue-500" />
              <span className="text-lg">応援</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="w-5 h-5 text-gray-500" />
              <span className="text-lg">
                コメント {entry.comments?.length || 0}
              </span>
            </Button>
          </div>

          <Button variant="ghost" size="sm">
            <Smile className="w-5 h-5 text-orange-500" />
          </Button>
        </div>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-100 p-6 bg-gray-50"
          >
            <h4 className="text-xl font-bold text-gray-900 mb-4">
              コメント
            </h4>

            {/* Comment Form */}
            <div className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="温かいコメントを残しましょう..."
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
              <div className="mt-3 flex justify-end">
                <Button variant="primary" size="sm">
                  コメントする
                </Button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {entry.comments?.map(comment => (
                <div key={comment.id} className="bg-white rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {comment.user?.name?.[0] || '👤'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">
                          {comment.user?.name || 'ユーザー'}
                        </span>
                        <span className="text-gray-500">
                          {format(new Date(comment.created_at), 'M月d日 HH:mm', { locale: ja })}
                        </span>
                      </div>
                      <p className="text-gray-800">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-500">
                  まだコメントがありません
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};