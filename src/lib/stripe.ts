import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

// Stripe公開キー（環境変数から取得）
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
      '月10回まで録音',
      '基本的な文字起こし',
      '1名まで共有可能',
      '30日間保存'
    ]
  },
  {
    id: 'premium',
    name: 'プレミアムプラン',
    price: 980,
    interval: 'month',
    stripePriceId: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID,
    features: [
      '録音無制限',
      '高精度AI文字起こし',
      'AI要約・感情分析',
      '家族5名まで共有',
      '無制限保存',
      '音声ファイル保存',
      '優先サポート'
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
      '家族10名まで共有',
      '家族グループ機能',
      'カスタムアルバム作成',
      '年間レポート機能'
    ]
  }
];

export class StripeService {
  /**
   * Stripeのチェックアウトセッションを作成
   */
  static async createCheckoutSession(priceId: string, userId: string) {
    try {
      // Supabase Edge FunctionでStripe Checkout Sessionを作成
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          priceId,
          userId,
          successUrl: `${window.location.origin}/subscription/success`,
          cancelUrl: `${window.location.origin}/subscription/cancel`
        }
      });

      if (error) throw error;

      // Stripeのチェックアウトページにリダイレクト
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId
      });

      if (stripeError) throw stripeError;

      return data;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  /**
   * 現在のサブスクリプション状態を取得
   */
  static async getSubscriptionStatus(userId: string) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return data || { status: 'free', plan_id: 'free' };
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      return { status: 'free', plan_id: 'free' };
    }
  }

  /**
   * サブスクリプションをキャンセル
   */
  static async cancelSubscription(subscriptionId: string) {
    try {
      const { data, error } = await supabase.functions.invoke('cancel-subscription', {
        body: { subscriptionId }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  /**
   * 支払い履歴を取得
   */
  static async getPaymentHistory(userId: string) {
    try {
      const { data, error } = await supabase
        .from('payment_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching payment history:', error);
      return [];
    }
  }

  /**
   * カスタマーポータルURLを取得（Stripeの管理画面へ）
   */
  static async getCustomerPortalUrl(userId: string) {
    try {
      const { data, error } = await supabase.functions.invoke('create-portal-session', {
        body: { userId, returnUrl: window.location.origin }
      });

      if (error) throw error;
      return data.url;
    } catch (error) {
      console.error('Error creating portal session:', error);
      throw error;
    }
  }
}

export default StripeService;