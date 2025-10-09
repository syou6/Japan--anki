import React from 'react';

function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ color: '#4F46E5', marginBottom: '1rem' }}>
          AI Voice Journal
        </h1>
        <p style={{ color: '#6B7280', marginBottom: '1rem' }}>
          アプリが正常に読み込まれました！
        </p>
        <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
          現在時刻: {new Date().toLocaleString('ja-JP')}
        </p>
        <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
          環境: {import.meta.env.MODE}
        </p>
      </div>
    </div>
  );
}

export default App;