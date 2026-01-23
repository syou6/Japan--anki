import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Shield, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { PricingCards } from './PricingCards';
import { useAuthStore } from '../../stores/authStore';
import { StripeService } from '../../lib/stripe';
import { useNavigate } from 'react-router-dom';
import { EN } from '../../i18n/en';

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
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {EN.subscriptionPage.back}
          </Button>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {EN.subscriptionPage.selectPlan}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {EN.subscriptionPage.chooseDescription}
            </p>
          </motion.div>
        </div>

        {/* Promo Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 mb-12 text-white"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">
                {EN.subscriptionPage.campaign}
              </h2>
              <p className="text-lg">
                {EN.subscriptionPage.campaignDesc}
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>{EN.subscriptionPage.securePayment}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <span>{EN.subscriptionPage.instantUpgrade}</span>
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

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            {EN.subscriptionPage.faq}
          </h2>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-bold text-lg mb-2">{EN.subscriptionPage.faqCancelQ}</h3>
              <p className="text-gray-600">
                {EN.subscriptionPage.faqCancelA}
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-bold text-lg mb-2">{EN.subscriptionPage.faqPaymentQ}</h3>
              <p className="text-gray-600">
                {EN.subscriptionPage.faqPaymentA}
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-bold text-lg mb-2">{EN.subscriptionPage.faqChangeQ}</h3>
              <p className="text-gray-600">
                {EN.subscriptionPage.faqChangeA}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Security Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="flex items-center justify-center gap-8 text-gray-600">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              <span>{EN.subscriptionPage.securePayment}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span>{EN.subscriptionPage.sslEncrypted}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{EN.subscriptionPage.poweredBy}</span>
              <span className="font-bold text-purple-600">Stripe</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};