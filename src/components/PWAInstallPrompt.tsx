import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';
import { Button } from './ui/Button';

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // iOS/iPadOSチェック
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone;
    
    // iOSでスタンドアロンモードでない場合
    if (isIOS && !isInStandaloneMode) {
      // インストール済みでなければプロンプトを表示
      const hasShownPrompt = localStorage.getItem('ios-pwa-prompt-shown');
      if (!hasShownPrompt) {
        setShowIOSPrompt(true);
        setShowPrompt(true);
      }
    }

    // Android/デスクトップのインストールプロンプト
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // インストール成功時
    window.addEventListener('appinstalled', () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA installed');
      }
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleIOSClose = () => {
    localStorage.setItem('ios-pwa-prompt-shown', 'true');
    setShowIOSPrompt(false);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      {showIOSPrompt ? (
        // iOS用のインストール手順
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-20 left-4 right-4 bg-white rounded-2xl shadow-2xl p-4 z-50 max-w-md mx-auto border-2 border-blue-500"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-6 h-6 text-blue-600" />
              <h3 className="font-bold text-lg">アプリとして使用</h3>
            </div>
            <button onClick={handleIOSClose} className="text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">
            ホーム画面に追加すると、プッシュ通知が使えるようになります
          </p>
          
          <div className="bg-blue-50 rounded-lg p-3 text-sm">
            <ol className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600">1.</span>
                <span>下部の共有ボタン 
                  <svg className="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m0 4.026A9.001 9.001 0 0012 21c4.474 0 8.268-3.12 9.032-7.326" />
                  </svg>
                  をタップ
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600">2.</span>
                <span>「ホーム画面に追加」を選択</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600">3.</span>
                <span>右上の「追加」をタップ</span>
              </li>
            </ol>
          </div>
        </motion.div>
      ) : (
        // Android/デスクトップ用
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-20 left-4 right-4 bg-white rounded-2xl shadow-2xl p-4 z-50 max-w-md mx-auto border-2 border-blue-500"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <Download className="w-6 h-6 text-blue-600" />
              <h3 className="font-bold text-lg">アプリをインストール</h3>
            </div>
            <button onClick={() => setShowPrompt(false)} className="text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            日記AIをホーム画面に追加して、アプリとして使用できます。プッシュ通知も受け取れるようになります。
          </p>
          
          <div className="flex gap-2">
            <Button onClick={handleInstallClick} size="md" className="flex-1">
              <Download className="w-4 h-4" />
              インストール
            </Button>
            <Button 
              onClick={() => setShowPrompt(false)} 
              variant="outline" 
              size="md"
              className="flex-1"
            >
              後で
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};