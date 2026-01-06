import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppPage } from './pages/AppPage';
import { LandingPage } from './pages/LandingPage';
import { SubscriptionSuccess } from './pages/SubscriptionSuccess';
import { SubscriptionCancel } from './pages/SubscriptionCancel';
import { useAuthStore } from './stores/authStore';

function App() {
  const { user, loading, initialize } = useAuthStore();
  const [showLanding, setShowLanding] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LPは一旦スキップ - 常にアプリを表示
  // useEffect(() => {
  //   const hasUsedApp = localStorage.getItem('hasUsedApp') === 'true';
  //   if (user || hasUsedApp) {
  //     setShowLanding(false);
  //   } else {
  //     setShowLanding(true);
  //   }
  // }, [user]);

  // ローディング中は何も表示しない
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={showLanding ? <LandingPage /> : <AppPage />} />
      <Route path="/app" element={<AppPage />} />
      <Route path="/app/*" element={<AppPage />} />
      <Route path="/subscription/success" element={<SubscriptionSuccess />} />
      <Route path="/subscription/cancel" element={<SubscriptionCancel />} />
    </Routes>
  );
}

export default App;