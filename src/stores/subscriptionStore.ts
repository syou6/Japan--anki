import { create } from 'zustand';
import { supabase } from '../lib/supabase';

type PlanType = 'free' | 'premium' | 'family';
type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'free';

interface SubscriptionStore {
  plan: PlanType;
  status: SubscriptionStatus;
  monthlyDiaryCount: number;
  loading: boolean;

  fetchSubscription: (userId: string) => Promise<void>;
  canCreateDiary: () => boolean;
  canUseAI: () => boolean;
  canUseAIFeedback: () => boolean;
  getMaxSharedMembers: () => number;
  incrementDiaryCount: () => void;
}

const PLAN_LIMITS = {
  free: { diariesPerMonth: 3, sharedMembers: 1 },
  premium: { diariesPerMonth: Infinity, sharedMembers: 5 },
  family: { diariesPerMonth: Infinity, sharedMembers: 10 },
} as const;

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  plan: 'free',
  status: 'free',
  monthlyDiaryCount: 0,
  loading: false,

  fetchSubscription: async (userId: string) => {
    set({ loading: true });
    try {
      // Fetch subscription status
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .in('status', ['active', 'trialing', 'past_due'])
        .single();

      let plan: PlanType = 'free';
      let status: SubscriptionStatus = 'free';

      if (subscription) {
        const planType = subscription.plan_type as string;
        if (planType === 'family') {
          plan = 'family';
        } else if (planType === 'premium') {
          plan = 'premium';
        }
        status = subscription.status === 'trialing' ? 'active' : (subscription.status as SubscriptionStatus);
      }

      // Count this month's diaries
      const now = new Date();
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const { count } = await supabase
        .from('diaries')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .is('deleted_at', null)
        .gte('created_at', firstOfMonth);

      set({
        plan,
        status,
        monthlyDiaryCount: count || 0,
        loading: false,
      });
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
      set({ plan: 'free', status: 'free', loading: false });
    }
  },

  canCreateDiary: () => {
    const { plan, monthlyDiaryCount } = get();
    const limit = PLAN_LIMITS[plan].diariesPerMonth;
    return monthlyDiaryCount < limit;
  },

  canUseAI: () => {
    const { plan, status } = get();
    return (plan === 'premium' || plan === 'family') && status === 'active';
  },

  canUseAIFeedback: () => {
    const { plan, status } = get();
    return (plan === 'premium' || plan === 'family') && status === 'active';
  },

  getMaxSharedMembers: () => {
    const { plan } = get();
    return PLAN_LIMITS[plan].sharedMembers;
  },

  incrementDiaryCount: () => {
    set((state) => ({ monthlyDiaryCount: state.monthlyDiaryCount + 1 }));
  },
}));
