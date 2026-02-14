import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId?: string;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: '無料プラン',
    price: 0,
    interval: 'month',
    features: [
      '日記3回/月',
      '基本的な文字起こし',
      '1名まで共有可能',
    ]
  },
  {
    id: 'premium',
    name: 'プレミアムプラン',
    price: 980,
    interval: 'month',
    stripePriceId: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID,
    features: [
      '日記無制限',
      'AI分析・フィードバック',
      '高精度AI文字起こし',
      '5名まで共有可能',
      '無制限保存',
      '優先サポート',
    ]
  },
  {
    id: 'family',
    name: 'ファミリープラン',
    price: 1980,
    interval: 'month',
    stripePriceId: import.meta.env.VITE_STRIPE_FAMILY_PRICE_ID,
    features: [
      'すべてのプレミアム機能',
      '10名まで共有可能',
      'グループ機能',
      'カスタムアルバム作成',
      '年間レポート機能',
    ]
  }
];

export class StripeService {
  static async createCheckoutSession(priceId: string, userId: string) {
    const response = await fetch('/api/stripe-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId,
        userId,
        successUrl: `${window.location.origin}/subscription/success`,
        cancelUrl: `${window.location.origin}/subscription/cancel`,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create checkout session');
    }

    const data = await response.json();

    if (data.url) {
      window.location.href = data.url;
      return data;
    }

    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe failed to load');

    const { error: stripeError } = await stripe.redirectToCheckout({
      sessionId: data.sessionId,
    });

    if (stripeError) throw stripeError;

    return data;
  }

  static async getSubscriptionStatus(userId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return data || { status: 'free', plan_id: 'free' };
  }

  static async getCustomerPortalUrl(userId: string): Promise<string> {
    const response = await fetch('/api/stripe-portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        returnUrl: window.location.origin,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create portal session');
    }

    const data = await response.json();
    return data.url;
  }

  static async getPaymentHistory(userId: string) {
    const { data, error } = await supabase
      .from('payment_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}

export default StripeService;
