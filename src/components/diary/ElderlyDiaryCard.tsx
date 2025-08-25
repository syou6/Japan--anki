import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { StandardDialog } from '../ui/StandardDialog';
import { useAuthStore } from '../../stores/authStore';
import { useDiaryStore } from '../../stores/diaryStore';
import type { DiaryEntry } from '../../types';
import { 
  Play, 
  Pause, 
  Calendar,
  Volume2,
  Trash2,
  Heart,
  Share2
} from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface ElderlyDiaryCardProps {
  entry: DiaryEntry;
}

export const ElderlyDiaryCard: React.FC<ElderlyDiaryCardProps> = ({ entry }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  const { user } = useAuthStore();
  const { deleteEntry } = useDiaryStore();
  const isOwner = user?.id === entry.user_id;

  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
        setAudioElement(null);
      }
    };
  }, [audioElement]);

  const handlePlayPause = async () => {
    if (!entry.voice_url) return;

    if (isPlaying && audioElement) {
      audioElement.pause();
      setIsPlaying(false);
      return;
    }

    if (!audioElement) {
      setIsLoadingAudio(true);
      try {
        const audio = new Audio();
        audio.preload = 'none';
        audio.src = entry.voice_url;
        
        await new Promise((resolve, reject) => {
          audio.oncanplaythrough = resolve;
          audio.onerror = reject;
          audio.onended = () => {
            setIsPlaying(false);
          };
          audio.load();
        });
        
        setAudioElement(audio);
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('音声の再生に失敗しました:', error);
        toast.error('音声の再生に失敗しました');
      } finally {
        setIsLoadingAudio(false);
      }
    } else {
      audioElement.play();
      setIsPlaying(true);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteEntry(entry.id);
      toast.success('日記を削除しました');
      setShowDeleteConfirm(false);
    } catch (error) {
      toast.error('削除に失敗しました');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = async () => {
    const shareText = `${formatDate(entry.created_at)}の日記\n\n${entry.content || entry.ai_summary || ''}`;
    
    // Web Share APIが使える場合
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${formatDate(entry.created_at)}の日記`,
          text: shareText,
        });
        toast.success('共有しました');
      } catch (error) {
        // ユーザーがキャンセルした場合は何もしない
        if ((error as Error).name !== 'AbortError') {
          console.error('共有エラー:', error);
        }
      }
    } else {
      // Web Share APIが使えない場合はクリップボードにコピー
      try {
        await navigator.clipboard.writeText(shareText);
        toast.success('クリップボードにコピーしました');
      } catch (error) {
        toast.error('コピーに失敗しました');
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'M月d日（E）', { locale: ja });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'HH時mm分', { locale: ja });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border-4 border-navy-900 overflow-hidden shadow-2xl"
    >
      {/* Header with Date - Bigger and Simpler */}
      <div className="bg-gray-100 p-6 sm:p-8 border-b-4 border-gray-400">
        <div className="text-center">
          <h3 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-2 text-black">
            {formatDate(entry.created_at)}
          </h3>
          <p className="text-3xl sm:text-4xl font-bold text-black">
            {formatTime(entry.created_at)}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 sm:p-10">
        {/* Voice Player - Huge and Central */}
        {entry.voice_url && (
          <div className="mb-10">
            <button
              onClick={handlePlayPause}
              disabled={isLoadingAudio}
              className={`
                w-full py-10 sm:py-12 rounded-3xl flex flex-col items-center justify-center
                transition-all duration-200 border-4 border-navy-900
                ${isLoadingAudio ? 'bg-gray-400' : isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
              `}
            >
              {isLoadingAudio ? (
                <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-white">
                  読み込み中...
                </span>
              ) : isPlaying ? (
                <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-white">
                  ■ 停止する
                </span>
              ) : (
                <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-white">
                  ▶ 再生する
                </span>
              )}
            </button>
          </div>
        )}

        {/* Text Content - Huge Font */}
        {(entry.content || entry.ai_summary) && (
          <div className="bg-yellow-100 rounded-3xl border-4 border-navy-900 p-8 mb-8">
            <p className="text-3xl sm:text-4xl lg:text-5xl text-navy-900 leading-relaxed font-bold whitespace-pre-wrap">
              {entry.ai_summary || entry.content}
            </p>
          </div>
        )}

        {/* Delete Button - Simple and Clear */}
        {isOwner && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full py-8 bg-gray-200 hover:bg-gray-300 rounded-3xl border-4 border-navy-900 transition-colors"
            disabled={isDeleting}
          >
            <span className="text-2xl sm:text-3xl font-black text-navy-900">
              削除する
            </span>
          </button>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <StandardDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="日記を削除しますか？"
        confirmLabel="削除する"
        cancelLabel="やめる"
        confirmVariant="danger"
        isLoading={isDeleting}
      >
        <p className="text-2xl text-black font-bold">
          この日記を削除してもよろしいですか？
        </p>
      </StandardDialog>
    </motion.div>
  );
};

function getEmotionEmoji(emotion: string): string {
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
}