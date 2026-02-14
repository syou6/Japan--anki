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
    primary: 'bg-brand-600 hover:bg-brand-700 border-brand-600',
    danger: 'bg-red-500 hover:bg-red-600 border-red-500',
    success: 'bg-emerald-500 hover:bg-emerald-600 border-emerald-500'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl border border-gray-200 shadow-elevated max-w-lg w-full overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  aria-label={EN.dialog.cancel}
                >
                  <X className="w-5 h-5" />
                </button>

                <h2 className="text-base font-semibold text-gray-900 text-center flex-1">
                  {title}
                </h2>

                <div className="w-9" />
              </div>

              <div className="p-5">
                {children}
              </div>

              {showConfirm && onConfirm && (
                <div className="p-5 border-t border-gray-100 bg-gray-50">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={onClose}
                      disabled={isLoading}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      {cancelLabel}
                    </button>
                    <button
                      onClick={onConfirm}
                      disabled={isLoading}
                      className={`
                        px-5 py-2 rounded-xl border
                        ${confirmColors[confirmVariant]}
                        text-white font-medium text-sm
                        transition-all flex items-center gap-2
                        disabled:opacity-50 disabled:cursor-not-allowed
                        focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2
                      `}
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                          <span>{EN.dialog.processing}</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>{confirmLabel}</span>
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
