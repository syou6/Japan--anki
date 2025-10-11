import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const SubscriptionSuccess: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // URLパラメータからセッション情報を取得
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    if (sessionId) {
      // セッションIDをローカルストレージに保存（必要に応じて）
      localStorage.setItem('stripe_session_id', sessionId);
    }
  }, []);

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
          className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-8 h-8 text-green-600" />
        </motion.div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          サブスクリプション開始完了！
        </h1>
        
        <p className="text-gray-600 mb-8">
          ご登録ありがとうございます。プレミアム機能をご利用いただけます。
        </p>

        <div className="space-y-4">
          <Button
            onClick={() => navigate('/app')}
            variant="primary"
            className="w-full"
          >
            アプリを開始する
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <Button
            onClick={() => navigate('/subscription')}
            variant="outline"
            className="w-full"
          >
            サブスクリプション管理
          </Button>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 プレミアム機能が有効になりました。録音無制限、AI分析、家族共有などがご利用いただけます。
          </p>
        </div>
      </motion.div>
    </div>
  );
};
