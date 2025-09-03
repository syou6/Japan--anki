import React, { useEffect, useState } from 'react';
import { getCurrentUsageStats, resetUsage } from '../lib/api-limiter';
import { useGuestStore } from '../stores/guestStore';
import { AlertCircle, RefreshCw, Zap } from 'lucide-react';

export const ApiUsageMonitor: React.FC = () => {
  const [stats, setStats] = useState(getCurrentUsageStats());
  const [showDetails, setShowDetails] = useState(false);
  const { isGuestMode, aiUsageCount } = useGuestStore();

  useEffect(() => {
    // 定期的に使用状況を更新
    const interval = setInterval(() => {
      setStats(getCurrentUsageStats());
    }, 5000); // 5秒ごと

    return () => clearInterval(interval);
  }, []);

  const usagePercentage = (stats.dailyUsed / stats.dailyLimit) * 100;
  const isNearLimit = usagePercentage > 80;
  const isAtLimit = stats.remainingRequests === 0;

  // 常に表示する（コメントアウトすれば制限時のみ表示）
  // if (import.meta.env.PROD && !isNearLimit && !isAtLimit && !isGuestMode) {
  //   return null;
  // }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div 
        className={`bg-white rounded-lg shadow-lg p-4 ${
          isAtLimit ? 'border-2 border-red-500' : isNearLimit ? 'border-2 border-yellow-500' : 'border border-gray-200'
        }`}
        style={{ minWidth: '250px' }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            {isGuestMode ? (
              <>
                <Zap className="w-4 h-4 text-purple-500" />
                ゲストモード
              </>
            ) : (
              <>
                <AlertCircle className={`w-4 h-4 ${
                  isAtLimit ? 'text-red-500' : isNearLimit ? 'text-yellow-500' : 'text-blue-500'
                }`} />
                Gemini API 使用状況
              </>
            )}
          </h3>
          {!isGuestMode && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              {showDetails ? '簡易表示' : '詳細'}
            </button>
          )}
        </div>

        <div className="space-y-2">
          {/* ゲストモード専用表示 */}
          {isGuestMode ? (
            <>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>AI分析使用回数:</span>
                  <span className={`font-semibold ${aiUsageCount >= 1 ? 'text-red-500' : ''}`}>
                    {aiUsageCount} / 1 回
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>状態:</span>
                  <span className="font-semibold">
                    {aiUsageCount >= 1 ? 'AI分析使用済み' : 'AI分析可能'}
                  </span>
                </div>
              </div>
              {aiUsageCount >= 1 && (
                <div className="bg-purple-50 text-purple-700 text-xs p-2 rounded">
                  AI分析は1回まで利用可能です。<br />
                  続けるにはログインしてください。
                </div>
              )}
            </>
          ) : (
            <>
              {/* 通常モードのプログレスバー */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(100, usagePercentage)}%` }}
                />
              </div>

              {/* 基本情報 */}
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>本日の使用回数:</span>
                  <span className="font-semibold">
                    {stats.dailyUsed} / {stats.dailyLimit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>残り:</span>
                  <span className={`font-semibold ${isAtLimit ? 'text-red-500' : ''}`}>
                    {stats.remainingRequests} 回
                  </span>
                </div>
              </div>
            </>
          )}

          {/* 詳細情報 */}
          {showDetails && (
            <div className="border-t pt-2 mt-2 text-xs space-y-1">
              <div className="flex justify-between">
                <span>推定トークン数:</span>
                <span>{stats.tokensUsed.toLocaleString()} / {stats.tokensLimit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>推定コスト:</span>
                <span>¥{(stats.tokensUsed * 0.00001).toFixed(3)}</span>
              </div>
            </div>
          )}

          {/* 警告メッセージ */}
          {isAtLimit && (
            <div className="bg-red-50 text-red-700 text-xs p-2 rounded mt-2">
              本日の使用上限に達しました。明日またお試しください。
            </div>
          )}
          {!isAtLimit && isNearLimit && (
            <div className="bg-yellow-50 text-yellow-700 text-xs p-2 rounded mt-2">
              使用上限に近づいています。
            </div>
          )}

          {/* リセットボタン（開発用） */}
          {import.meta.env.DEV && (
            <button
              onClick={() => {
                resetUsage();
                setStats(getCurrentUsageStats());
              }}
              className="w-full mt-2 flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs py-1 px-2 rounded"
            >
              <RefreshCw className="w-3 h-3" />
              使用量リセット（開発用）
            </button>
          )}
        </div>
      </div>
    </div>
  );
};