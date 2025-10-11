import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const SubscriptionCancel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <XCircle className="w-8 h-8 text-orange-600" />
        </motion.div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          サブスクリプションがキャンセルされました
        </h1>
        
        <p className="text-gray-600 mb-8">
          サブスクリプションの開始をキャンセルしました。いつでも再度お申し込みいただけます。
        </p>

        <div className="space-y-4">
          <Button
            onClick={() => navigate('/app')}
            variant="primary"
            className="w-full"
          >
            アプリに戻る
            <ArrowLeft className="w-4 h-4 ml-2" />
          </Button>
          
          <Button
            onClick={() => navigate('/subscription')}
            variant="outline"
            className="w-full"
          >
            プランを見直す
            <RefreshCw className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            💡 無料プランでも基本的な機能をご利用いただけます。録音回数に制限がありますが、日記の記録は可能です。
          </p>
        </div>
      </motion.div>
    </div>
  );
};
