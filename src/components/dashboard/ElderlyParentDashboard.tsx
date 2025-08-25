import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { useDiaryStore } from '../../stores/diaryStore';
import { useAuthStore } from '../../stores/authStore';
import { useGuestStore } from '../../stores/guestStore';
import { 
  Mic, 
  Calendar, 
  Heart,
  Sun,
  LogOut
} from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface ElderlyParentDashboardProps {
  onViewChange: (view: string) => void;
  isGuest?: boolean;
}

export const ElderlyParentDashboard: React.FC<ElderlyParentDashboardProps> = ({ onViewChange, isGuest = false }) => {
  const [todayRecorded, setTodayRecorded] = useState(false);
  const { entries, fetchEntries } = useDiaryStore();
  const { guestDiaries, setGuestMode } = useGuestStore();
  const { user } = useAuthStore();
  const authStore = useAuthStore();
  const today = new Date();
  
  const greeting = () => {
    const hour = today.getHours();
    if (hour < 12) return 'おはようございます';
    if (hour < 18) return 'こんにちは';
    return 'こんばんは';
  };

  useEffect(() => {
    if (!isGuest && user) {
      fetchEntries();
    }
  }, [user, fetchEntries, isGuest]);

  useEffect(() => {
    // Check if diary has been recorded today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    
    const diariesToCheck = isGuest ? guestDiaries : entries;
    
    // null/undefined チェックを追加
    if (!diariesToCheck) {
      setTodayRecorded(false);
      return;
    }
    
    const todayDiary = diariesToCheck.find(diary => {
      const diaryDate = new Date(diary.created_at);
      return diaryDate >= todayStart && diaryDate <= todayEnd;
    });
    
    setTodayRecorded(!!todayDiary);
  }, [entries, guestDiaries, isGuest]);

  const handleLogout = async () => {
    if (window.confirm('ログアウトしますか？')) {
      try {
        if (isGuest) {
          setGuestMode(false);
          sessionStorage.setItem('showAuthForm', 'true');
          window.location.reload();
        } else if (authStore.signOut) {
          await authStore.signOut();
        } else {
          // signOut関数が利用できない場合の代替処理
          window.location.href = '/';
        }
      } catch (error) {
        console.error('ログアウトエラー:', error);
        // エラーが発生しても強制的にログアウト
        window.location.href = '/';
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-40 space-y-6 min-h-screen">
      {/* Simple Greeting - High Contrast */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-navy-900 text-white rounded-2xl p-6 sm:p-8 border-4 border-navy-900"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3">
              {greeting()}
            </h1>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              {format(today, 'M月d日（E）', { locale: ja })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Sun className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-300" />
          </div>
        </div>
      </motion.div>
      
      {/* Logout Button - Big and Clear */}
      <motion.button
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={handleLogout}
        className="w-full bg-gray-200 hover:bg-gray-300 text-navy-900 rounded-2xl border-4 border-navy-900 p-6 transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        <div className="flex items-center justify-center gap-4">
          <LogOut className="w-10 h-10 sm:w-12 sm:h-12" />
          <span className="text-2xl sm:text-3xl font-black">
            ログアウト
          </span>
        </div>
      </motion.button>

      {/* Main Recording Button - Very Large and Prominent */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-2xl border-4 border-navy-900 p-8 sm:p-10 text-center"
      >
        {!todayRecorded ? (
          <>
            <div className="bg-red-500 w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-navy-900">
              <Mic className="w-16 h-16 sm:w-20 sm:h-20 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-900 mb-4">
              今日の日記を
            </h2>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-900 mb-6">
              録音しましょう
            </h2>
            <p className="text-2xl sm:text-3xl text-navy-700 mb-8 font-bold">
              マイクボタンを押して
            </p>
            <p className="text-2xl sm:text-3xl text-navy-700 mb-8 font-bold">
              お話しください
            </p>
            <Button
              onClick={() => onViewChange('record')}
              variant="primary"
              size="xl"
              className="w-full sm:w-3/4 mx-auto h-24 sm:h-28 text-2xl sm:text-3xl bg-red-500 hover:bg-red-600 border-4 border-navy-900"
            >
              <Mic className="w-10 h-10 sm:w-12 sm:h-12" />
              録音を始める
            </Button>
          </>
        ) : (
          <>
            <div className="bg-green-500 w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-navy-900">
              <span className="text-6xl sm:text-7xl">✓</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-900 mb-6">
              今日の日記は
            </h2>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-green-600 mb-8">
              録音済みです
            </h2>
            <p className="text-2xl sm:text-3xl text-navy-700 font-bold">
              お疲れさまでした！
            </p>
          </>
        )}
      </motion.div>

      {/* Simple Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* View Past Diaries */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => onViewChange('diary')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white rounded-2xl border-4 border-navy-900 p-6 sm:p-8 text-center hover:bg-blue-50 transition-colors"
        >
          <Calendar className="w-16 h-16 sm:w-20 sm:h-20 text-blue-600 mx-auto mb-4" />
          <h3 className="text-2xl sm:text-3xl font-black text-navy-900">
            過去の日記
          </h3>
        </motion.button>

        {/* Family Connection */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => onViewChange('family')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white rounded-2xl border-4 border-navy-900 p-6 sm:p-8 text-center hover:bg-pink-50 transition-colors"
        >
          <Heart className="w-16 h-16 sm:w-20 sm:h-20 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl sm:text-3xl font-black text-navy-900">
            家族の声
          </h3>
        </motion.button>
      </div>

      {/* Simple Tips - Large Text */}
      {!todayRecorded && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-yellow-50 rounded-2xl border-4 border-navy-900 p-6 sm:p-8"
        >
          <h3 className="text-2xl sm:text-3xl font-black text-navy-900 mb-4">
            💡 今日のヒント
          </h3>
          <ul className="space-y-3 text-xl sm:text-2xl text-navy-700 font-bold">
            <li>• 今日食べたものは？</li>
            <li>• 体調はいかがですか？</li>
            <li>• 楽しかったことは？</li>
          </ul>
        </motion.div>
      )}
    </div>
  );
};