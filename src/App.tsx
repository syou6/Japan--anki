import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppPage } from './pages/AppPage';
import { SubscriptionSuccess } from './pages/SubscriptionSuccess';
import { SubscriptionCancel } from './pages/SubscriptionCancel';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppPage />} />
      <Route path="/app" element={<AppPage />} />
      <Route path="/app/*" element={<AppPage />} />
      <Route path="/subscription/success" element={<SubscriptionSuccess />} />
      <Route path="/subscription/cancel" element={<SubscriptionCancel />} />
    </Routes>
  );
}

export default App;