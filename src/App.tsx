import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppPage } from './pages/AppPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppPage />} />
      <Route path="/app" element={<AppPage />} />
      <Route path="/app/*" element={<AppPage />} />
    </Routes>
  );
}

export default App;