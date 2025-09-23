import React from 'react';
import { Link } from 'react-router-dom';

export const Pricing: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 to-gray-100 relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6">
            料金プラン
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            シンプルで分かりやすい料金体系。高齢者の方にも安心してご利用いただけます
          </p>
        </div>
        
        <div className="max-w-lg mx-auto">
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 overflow-hidden">
            {/* 人気バッジ */}
            <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-bl-2xl text-sm font-semibold">
              おすすめ
            </div>
            
            {/* グラデーション背景 */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-50"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  ベーシックプラン
                </h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ¥500
                  </span>
                  <span className="text-xl text-gray-500 ml-2">/月</span>
                </div>
                <p className="text-gray-600">
                  すべての機能を無制限でご利用いただけます
                </p>
              </div>
              
              <div className="space-y-4 mb-8">
                {[
                  "無制限の音声日記記録",
                  "AI感情分析・健康状態チェック",
                  "家族との安全な共有機能",
                  "プッシュ通知・リマインダー",
                  "データの自動バックアップ",
                  "24時間サポート対応"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                <Link
                  to="/app?signup=true"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg block text-center"
                >
                  無料で始める
                </Link>
                <Link
                  to="/app?guest=true"
                  className="w-full bg-white text-gray-700 py-3 px-6 rounded-2xl font-semibold border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 block text-center"
                >
                  ゲストで体験
                </Link>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">7日間無料トライアル</span> いつでもキャンセル可能
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 信頼性の表示 */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-8">安心してご利用いただけるよう、以下の認証を取得しています</p>
          <div className="flex justify-center items-center space-x-8 text-gray-400">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              SSL暗号化
            </div>
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              GDPR準拠
            </div>
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              24時間サポート
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
