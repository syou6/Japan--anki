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
import { WelcomeGuide } from './components/onboarding/WelcomeGuide';
import { supabase } from './lib/supabase';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false); // メンテナンスモード無効
  const { user, loading, initialize } = useAuthStore();
  const { isGuestMode, cleanExpiredDiaries, setGuestMode } = useGuestStore();

  useEffect(() => {
    initialize();
    
    // ログイン画面表示フラグをチェック
    const shouldShowAuth = sessionStorage.getItem('showAuthForm');
    if (shouldShowAuth) {
      sessionStorage.removeItem('showAuthForm');
      setGuestMode(false);
      return;
    }
    
    // デフォルトでゲストモードを有効化（ユーザーがログインしていない場合）
    const checkAndEnableGuestMode = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user && !isGuestMode) {
        setGuestMode(true);
        setShowOnboarding(true); // ゲストモードでもオンボーディングを表示
      }
    };
    checkAndEnableGuestMode();
    
    // ゲストモードの期限切れ日記をクリーンアップ
    cleanExpiredDiaries();
    
    // 5分ごとに期限切れ日記をチェック
    const interval = setInterval(() => {
      cleanExpiredDiaries();
    }, 5 * 60 * 1000); // 5分
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user && !isGuestMode) {
      // Check if onboarding has been completed
      const onboardingCompleted = localStorage.getItem('onboardingCompleted');
      if (!onboardingCompleted) {
        setShowOnboarding(true);
      }
    }
  }, [user, isGuestMode]);

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

  // メンテナンス中の画面
  if (isMaintenanceMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <svg className="w-24 h-24 mx-auto text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">メンテナンス中</h1>
          <p className="text-gray-600 mb-6">
            現在、システムメンテナンスを実施しております。<br />
            ご不便をおかけしますが、しばらくお待ちください。
          </p>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              メンテナンス予定時間<br />
              <span className="font-semibold">完了までしばらくお待ちください</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

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
      
      <WelcomeGuide 
        show={showOnboarding} 
        onComplete={() => setShowOnboarding(false)} 
      />
      
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