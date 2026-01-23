import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, Crown, Users } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { pricingPlans, StripeService } from '../../lib/stripe';
import { EN } from '../../i18n/en';
import toast from 'react-hot-toast';

interface PricingCardsProps {
  currentPlan?: string;
}

export const PricingCards: React.FC<PricingCardsProps> = ({ currentPlan = 'free' }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const { user } = useAuthStore();

  const handleSubscribe = async (planId: string, priceId?: string) => {
    if (!user) {
      toast.error(EN.pricing.loginRequired);
      return;
    }

    if (!priceId) {
      toast.error(EN.pricing.notAvailable);
      return;
    }

    setLoading(planId);
    try {
      await StripeService.createCheckoutSession(priceId, user.id);
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error(EN.pricing.error);
    } finally {
      setLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) return;

    try {
      const portalUrl = await StripeService.getCustomerPortalUrl(user.id);
      window.location.href = portalUrl;
    } catch (error) {
      console.error('Portal error:', error);
      toast.error(EN.pricing.error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {pricingPlans.map((plan, index) => {
        const isCurrentPlan = plan.id === currentPlan;
        const isPremium = plan.id === 'premium';
        const isFamily = plan.id === 'family';

        return (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              relative bg-white rounded-2xl shadow-lg overflow-hidden
              ${isPremium ? 'ring-2 ring-purple-600 transform scale-105' : ''}
              hover:shadow-xl transition-all duration-300
            `}
          >
            {isPremium && (
              <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                {EN.pricing.popular}
              </div>
            )}

            <div className="p-8">
              <div className="flex justify-center mb-4">
                {plan.id === 'free' && (
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🎁</span>
                  </div>
                )}
                {isPremium && (
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                )}
                {isFamily && (
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>

              <h3 className="text-2xl font-bold text-center mb-2 text-gray-800">
                {plan.name}
              </h3>

              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  ${plan.price}
                </span>
                <span className="text-gray-600 ml-2">/{plan.interval === 'month' ? 'mo' : 'yr'}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                {isCurrentPlan ? (
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    disabled
                  >
                    {EN.pricing.currentPlan}
                  </Button>
                ) : plan.id === 'free' ? (
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    disabled
                  >
                    {EN.pricing.freePlan}
                  </Button>
                ) : (
                  <Button
                    variant={isPremium ? 'primary' : 'secondary'}
                    size="lg"
                    className="w-full"
                    onClick={() => handleSubscribe(plan.id, plan.stripePriceId)}
                    disabled={loading === plan.id}
                  >
                    {loading === plan.id ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {EN.pricing.processing}
                      </>
                    ) : (
                      <>{EN.pricing.startNow}</>
                    )}
                  </Button>
                )}
              </div>

              {isCurrentPlan && plan.id !== 'free' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3"
                  onClick={handleManageSubscription}
                >
                  {EN.pricing.managePlan}
                </Button>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
