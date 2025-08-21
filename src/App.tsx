import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { useAuthStore } from './stores/authStore';
import { useGuestStore } from './stores/guestStore';
import { AuthForm } from './components/auth/AuthForm';
import { Header } from './components/navigation/Header';
import { ParentDashboard } from './components/dashboard/ParentDashboard';
import { VoiceRecorder } from './components/recording/VoiceRecorder';
import { DiaryList } from './components/diary/DiaryList';
import { FamilyManager } from './components/family/FamilyManager';
import { NotificationSettings } from './components/settings/NotificationSettings';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { GuestBanner } from './components/guest/GuestBanner';
import { GuestDiaryList } from './components/guest/GuestDiaryList';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const { user, loading, initialize } = useAuthStore();
  const { isGuestMode, cleanExpiredDiaries } = useGuestStore();

  useEffect(() => {
    console.log('App初期化開始');
    initialize().catch(err => {
      console.error('App初期化エラー:', err);
    });
    
    // ゲストモードの期限切れ日記をクリーンアップ
    try {
      cleanExpiredDiaries();
    } catch (err) {
      console.error('ゲスト日記クリーンアップエラー:', err);
    }
    
    // 5分ごとに期限切れ日記をチェック
    const interval = setInterval(() => {
      try {
        cleanExpiredDiaries();
      } catch (err) {
        console.error('定期クリーンアップエラー:', err);
      }
    }, 5 * 60 * 1000); // 5分
    
    return () => clearInterval(interval);
  }, []);

  const renderView = () => {
    // ゲストモードの場合
    if (isGuestMode) {
      switch (currentView) {
        case 'home':
          return <ParentDashboard onViewChange={setCurrentView} isGuest={true} />;
        case 'record':
          return <VoiceRecorder onViewChange={setCurrentView} isGuest={true} />;
        case 'diary':
          return <DiaryList isGuest={true} />;
        case 'family':
          // ゲストは家族機能使えない
          toast.error('ゲストモードでは家族機能は利用できません');
          return <DiaryList isGuest={true} />;
        case 'settings':
          // ゲストは設定使えない
          toast.error('ゲストモードでは設定は利用できません');
          return <DiaryList isGuest={true} />;
        default:
          return <DiaryList isGuest={true} />;
      }
    }

    // 通常ユーザーの場合
    if (!user) return null;

    switch (currentView) {
      case 'home':
        return user.role === 'parent' ? (
          <ParentDashboard onViewChange={setCurrentView} />
        ) : (
          <DiaryList />
        );
      case 'record':
        return user.role === 'parent' ? <VoiceRecorder onViewChange={setCurrentView} /> : <DiaryList />;
      case 'diary':
        return <DiaryList />;
      case 'family':
        return <FamilyManager />;
      case 'settings':
        return <NotificationSettings />;
      default:
        return <DiaryList />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user && !isGuestMode) {
    return (
      <>
        <AuthForm />
        <Toaster position="top-center" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isGuestMode && <GuestBanner />}
      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            fontSize: '18px',
            padding: '16px',
          },
        }}
      />
      
      <PWAInstallPrompt />
    </div>
  );
}

export default App;