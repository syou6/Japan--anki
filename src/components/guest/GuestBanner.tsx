import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, LogIn, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { useGuestStore } from '../../stores/guestStore';
export const GuestBanner: React.FC = () => {
  const { getRemainingTries, isGuestMode, setGuestMode } = useGuestStore();
  const remaining = getRemainingTries();

  if (!isGuestMode) return null;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-4 shadow-lg"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6" />
          <div>
            <p className="font-bold text-lg">ゲストモードで利用中</p>
            <p className="text-sm opacity-90">
              あと{remaining}回お試しできます
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right mr-2">
            <p className="text-xs opacity-90">すべての機能を使うには</p>
            <p className="text-sm font-semibold flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              無料アカウント作成
            </p>
          </div>
          <Button
            onClick={() => {
              setGuestMode(false);
              window.location.reload();
            }}
            variant="secondary"
            size="md"
            className="bg-white text-orange-600 hover:bg-gray-100"
          >
            <LogIn className="w-4 h-4" />
            ログイン / 新規登録
          </Button>
        </div>
      </div>
    </motion.div>
  );
};