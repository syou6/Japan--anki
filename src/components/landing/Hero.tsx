import React from 'react';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
  return (
    <section className="gradient-bg text-white py-20 relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blob"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-white/10 rounded-full blob" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blob" style={{animationDelay: '4s'}}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              話すだけで<br />
              <span className="text-yellow-300">日記が完成</span>
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl">
              高齢者の方でも簡単に使える音声日記アプリ。<br />
              AIが感情や健康状態を分析し、家族と安心を共有できます。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                to="/app?signup=true" 
                className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-yellow-300 transition-colors text-lg"
              >
                無料で始める
              </Link>
              <Link 
                to="/app?guest=true" 
                className="bg-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/30 transition-colors text-lg border border-white/30"
              >
                ゲストで体験
              </Link>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center">
            <div className="phone-mockup floating">
              <div className="h-full bg-gradient-to-b from-purple-500 to-pink-500 flex flex-col items-center justify-center p-8 text-white">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-center mb-4">
                  今日の気分は<br />
                  いかがですか？
                </h3>
                <p className="text-center opacity-80 mb-6">
                  ボタンを押して<br />
                  お話しください
                </p>
                <button className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center hover:bg-white/40 transition-colors">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


