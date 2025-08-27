import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Shield, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { PricingCards } from './PricingCards';
import { useAuthStore } from '../../stores/authStore';
import { StripeService } from '../../lib/stripe';
import { useNavigate } from 'react-router-dom';

export const SubscriptionPage: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState('free');
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!user) return;
      
      try {
        const status = await StripeService.getSubscriptionStatus(user.id);
        setCurrentPlan(status.plan_id || 'free');
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* ヘッダー */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              プランを選択
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              あなたに最適なプランをお選びください
            </p>
          </motion.div>
        </div>

        {/* 特典バナー */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 mb-12 text-white"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">
                🎉 期間限定キャンペーン
              </h2>
              <p className="text-lg">
                今なら30日間無料でプレミアムプランをお試しいただけます！
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>安全な決済</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <span>即時アップグレード</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 料金カード */}
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <PricingCards currentPlan={currentPlan} />
        )}

        {/* FAQ セクション */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            よくある質問
          </h2>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-bold text-lg mb-2">いつでも解約できますか？</h3>
              <p className="text-gray-600">
                はい、いつでも解約可能です。解約後も次の請求日まではサービスをご利用いただけます。
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-bold text-lg mb-2">支払い方法は何が使えますか？</h3>
              <p className="text-gray-600">
                クレジットカード（Visa、Mastercard、American Express、JCB）をご利用いただけます。
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-bold text-lg mb-2">プランの変更はできますか？</h3>
              <p className="text-gray-600">
                はい、いつでもプランのアップグレード・ダウングレードが可能です。日割り計算で調整されます。
              </p>
            </div>
          </div>
        </motion.div>

        {/* セキュリティ情報 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="flex items-center justify-center gap-8 text-gray-600">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              <span>安全な決済</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span>SSL暗号化</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Powered by</span>
              <span className="font-bold text-purple-600">Stripe</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};