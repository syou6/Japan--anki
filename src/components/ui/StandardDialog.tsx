import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { EN } from '../../i18n/en';

interface StandardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  children: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  showConfirm?: boolean;
  confirmVariant?: 'primary' | 'danger' | 'success';
  isLoading?: boolean;
}

export const StandardDialog: React.FC<StandardDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmLabel = EN.dialog.confirm,
  cancelLabel = EN.dialog.cancel,
  showConfirm = true,
  confirmVariant = 'primary',
  isLoading = false
}) => {
  const confirmColors = {
    primary: 'bg-black hover:bg-gray-800 border-black',
    danger: 'bg-red-600 hover:bg-red-700 border-red-600',
    success: 'bg-green-600 hover:bg-green-700 border-green-600'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* オーバーレイ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
          />
          
          {/* ダイアログ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl border-4 border-black max-w-lg w-full overflow-hidden">
              {/* ヘッダー - キャンセルは常に左上 */}
              <div className="flex items-center justify-between p-6 border-b-3 border-black bg-gray-50">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="
                    p-3 rounded-xl border-3 border-gray-600
                    bg-white text-gray-700 hover:bg-gray-100
                    transition-all flex items-center gap-2
                    disabled:opacity-50 disabled:cursor-not-allowed
                    font-bold
                  "
                  aria-label={EN.dialog.cancel}
                >
                  <X className="w-6 h-6" />
                  <span className="hidden sm:inline">{cancelLabel}</span>
                </button>
                
                <h2 className="text-2xl font-bold text-black text-center flex-1">
                  {title}
                </h2>
                
                {/* 右側のスペーサー（バランスのため） */}
                <div className="w-[100px]" />
              </div>
              
              {/* コンテンツ */}
              <div className="p-6">
                {children}
              </div>
              
              {/* フッター - 決定は常に右下 */}
              {showConfirm && onConfirm && (
                <div className="p-6 border-t-3 border-black bg-gray-50">
                  <div className="flex justify-end">
                    <button
                      onClick={onConfirm}
                      disabled={isLoading}
                      className={`
                        px-8 py-4 rounded-xl border-3
                        ${confirmColors[confirmVariant]}
                        text-white font-bold text-xl
                        transition-all flex items-center gap-3
                        disabled:opacity-50 disabled:cursor-not-allowed
                        focus:ring-4 focus:ring-offset-2 focus:ring-black
                      `}
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                          />
                          <span>{EN.dialog.processing}</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-6 h-6" />
                          <span>{confirmLabel}</span>
                          <span className="text-2xl ml-2">→</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};