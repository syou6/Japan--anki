import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer style={{ 
      backgroundColor: '#f8fafc', 
      color: '#1f2937',
      padding: '4rem 0'
    }}>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center mb-6">
              <img src="/logo.png" alt="AI Voice Journal" className="h-12 w-12 mr-4" />
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: '#1f2937' 
              }}>
                AI Voice Journal
              </h3>
            </div>
            <p style={{ 
              color: '#6b7280', 
              marginBottom: '1.5rem',
              maxWidth: '28rem'
            }}>
              高齢者向けの音声日記アプリ。AIが感情を分析し、家族との絆を深める新しいコミュニケーション体験を提供します。
            </p>
          </div>
          
          <div>
            <h4 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              marginBottom: '1.5rem',
              color: '#1f2937'
            }}>
              サービス
            </h4>
            <ul style={{ color: '#6b7280' }}>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
                <svg style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', color: '#60a5fa' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                音声日記
              </li>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
                <svg style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', color: '#60a5fa' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                AI分析
              </li>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
                <svg style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', color: '#60a5fa' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                家族共有
              </li>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
                <svg style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', color: '#60a5fa' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                プッシュ通知
              </li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              marginBottom: '1.5rem',
              color: '#1f2937'
            }}>
              サポート
            </h4>
            <ul style={{ color: '#6b7280' }}>
              <li style={{ marginBottom: '0.75rem' }}>
                <a href="/privacy.html" style={{ 
                  color: '#6b7280', 
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <svg style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  プライバシーポリシー
                </a>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <a href="/terms.html" style={{ 
                  color: '#6b7280', 
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <svg style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  利用規約
                </a>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <a href="/legal.html" style={{ 
                  color: '#6b7280', 
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <svg style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  特定商取引法に基づく表記
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div style={{ 
          borderTop: '1px solid #e5e7eb', 
          marginTop: '3rem', 
          paddingTop: '2rem' 
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: '1rem'
          }}>
            <p style={{ 
              color: '#6b7280', 
              fontSize: '0.875rem',
              margin: 0
            }}>
              &copy; 2025 AI Voice Journal運営事務局. All rights reserved.
            </p>
            <div style={{ 
              color: '#6b7280', 
              fontSize: '0.875rem' 
            }}>
              Made with ❤️ for elderly care
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};