import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { useAuthStore } from '../../stores/authStore';
import { useDiaryStore } from '../../stores/diaryStore';
import { supabase } from '../../lib/supabase';
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
import toast from 'react-hot-toast';

interface DiaryCardProps {
  entry: DiaryEntry;
}

export const DiaryCard: React.FC<DiaryCardProps> = ({ entry }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { user } = useAuthStore();
  const { deleteEntry, fetchEntries } = useDiaryStore();
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

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteEntry(entry.id);
      toast.success('日記をゴミ箱に移動しました（30日間保管されます）');
      setShowDeleteConfirm(false);
    } catch (error) {
      toast.error('削除に失敗しました');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          diary_id: entry.id,
          user_id: user?.id,
          content: newComment.trim()
        });

      if (error) throw error;

      // 日記の投稿者に通知を送信（自分の日記でない場合）
      if (!isOwner) {
        try {
          // 現在のユーザー名を取得
          const { data: userData } = await supabase
            .from('users')
            .select('name')
            .eq('id', user?.id)
            .single();

          if (userData?.name) {
            // Edge Function経由でバックグラウンド通知を送信
            await supabase.functions.invoke('send-push-notification', {
              body: {
                userId: entry.user_id,
                title: '新しいコメントが投稿されました',
                body: `${userData.name}さんがあなたの日記にコメントしました`,
                type: 'new_comment',
                data: {
                  url: `https://journal-ai.cloud/diary#${entry.id}`
                }
              }
            });
          }
        } catch (notifyError) {
          console.error('Failed to send comment notification:', notifyError);
          // 通知エラーは無視して続行
        }
      }

      toast.success('コメントを投稿しました');
      setNewComment('');
      // 日記一覧を再取得してコメントを反映
      await fetchEntries();
    } catch (error) {
      toast.error('コメントの投稿に失敗しました');
    } finally {
      setIsSubmittingComment(false);
    }
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
      className="bg-white rounded-2xl border-3 border-navy-900 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center text-sm sm:text-base">
              {entry.user?.name?.[0] || '👤'}
            </div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                {entry.user?.name || 'ユーザー'}
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-sm sm:text-lg">
                    {format(new Date(entry.created_at), 'M/d HH:mm', { locale: ja })}
                  </span>
                </div>
                {entry.emotion && (
                  <div className="flex items-center gap-1">
                    <span className="text-lg sm:text-xl">{getEmotionEmoji(entry.emotion)}</span>
                    <span className="text-sm sm:text-lg hidden sm:inline">{entry.emotion}</span>
                  </div>
                )}
                {entry.health_score && (
                  <div className={`text-sm sm:text-lg font-medium ${getHealthColor(entry.health_score)}`}>
                    <span className="hidden sm:inline">健康度: </span>
                    <span>{entry.health_score}/100</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isOwner && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
            >
              <Trash2 className="w-5 h-5 text-red-500" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* AI Summary */}
        {entry.ai_summary && (
          <div className="mb-4 p-3 sm:p-4 bg-blue-50 rounded-xl">
            <div className="text-base sm:text-lg font-medium text-blue-900 mb-1 sm:mb-2">
              📋 AI要約
            </div>
            <p className="text-sm sm:text-lg text-blue-800">
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
        <div className="prose prose-sm sm:prose-lg max-w-none">
          <p className="text-sm sm:text-base text-gray-800 leading-relaxed whitespace-pre-wrap">
            {showFullContent || entry.content.length <= 150 
              ? entry.content 
              : `${entry.content.substring(0, 150)}...`}
          </p>
          {entry.content.length > 150 && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base transition-colors"
            >
              {showFullContent ? '▲ 閉じる' : '▼ もっと見る'}
            </button>
          )}
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
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100">
        <div className="flex items-center justify-around sm:justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* いいねボタン */}
            <button
              className="flex items-center gap-2 p-2 sm:px-4 sm:py-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Heart className="w-6 h-6 sm:w-5 sm:h-5 text-red-500" />
              <span className="hidden sm:inline text-lg">いいね</span>
            </button>
            
            {/* 応援ボタン */}
            <button
              className="flex items-center gap-2 p-2 sm:px-4 sm:py-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ThumbsUp className="w-6 h-6 sm:w-5 sm:h-5 text-blue-500" />
              <span className="hidden sm:inline text-lg">応援</span>
            </button>
            
            {/* コメントボタン */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 p-2 sm:px-4 sm:py-2 hover:bg-gray-50 rounded-lg transition-colors relative"
            >
              <MessageCircle className="w-6 h-6 sm:w-5 sm:h-5 text-gray-500" />
              {entry.comments && entry.comments.length > 0 && (
                <span className="absolute -top-1 -right-1 sm:static sm:absolute-none bg-blue-500 text-white text-xs sm:text-lg sm:bg-transparent sm:text-gray-700 rounded-full w-5 h-5 sm:w-auto sm:h-auto flex items-center justify-center sm:inline">
                  {entry.comments.length}
                </span>
              )}
              <span className="hidden sm:inline text-lg">
                コメント{entry.comments && entry.comments.length > 0 && ` ${entry.comments.length}`}
              </span>
            </button>
            
            {/* スマイルボタン */}
            <button
              className="flex items-center gap-2 p-2 sm:px-4 sm:py-2 hover:bg-gray-50 rounded-lg transition-colors sm:ml-auto"
            >
              <Smile className="w-6 h-6 sm:w-5 sm:h-5 text-orange-500" />
            </button>
          </div>
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
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={handleSubmitComment}
                  disabled={isSubmittingComment || !newComment.trim()}
                >
                  {isSubmittingComment ? '投稿中...' : 'コメントする'}
                </Button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {entry.comments && entry.comments.length > 0 ? (
                entry.comments.map(comment => (
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
                          <span className="text-gray-500 text-sm">
                            {format(new Date(comment.created_at), 'M月d日 HH:mm', { locale: ja })}
                          </span>
                        </div>
                        <p className="text-gray-800">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  まだコメントがありません
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="日記を削除しますか？"
        message="この日記はゴミ箱に移動され、30日間は復元可能です。他の日記は影響を受けません。"
        confirmText="ゴミ箱に移動"
        cancelText="キャンセル"
        type="warning"
        isLoading={isDeleting}
      />
    </motion.div>
  );
};