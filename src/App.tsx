import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/authStore';
import { AuthForm } from './components/auth/AuthForm';
import { Header } from './components/navigation/Header';
import { ParentDashboard } from './components/dashboard/ParentDashboard';
import { VoiceRecorder } from './components/recording/VoiceRecorder';
import { DiaryList } from './components/diary/DiaryList';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const { user, loading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  const renderView = () => {
    if (!user) return null;

    switch (currentView) {
      case 'home':
        return user.role === 'parent' ? (
          <ParentDashboard onViewChange={setCurrentView} />
        ) : (
          <DiaryList />
        );
      case 'record':
        return user.role === 'parent' ? <VoiceRecorder /> : <DiaryList />;
      case 'diary':
        return <DiaryList />;
      case 'family':
        return (
          <div className="max-w-4xl mx-auto p-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              家族管理機能
            </h1>
            <p className="text-xl text-gray-600">
              この機能は開発中です
            </p>
          </div>
        );
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

  if (!user) {
    return (
      <>
        <AuthForm />
        <Toaster position="top-center" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
    </div>
  );
}

export default App;