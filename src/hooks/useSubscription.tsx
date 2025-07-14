import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface SubscriptionData {
  isPremium: boolean;
  subscriptionStatus: 'trial' | 'active' | 'expired' | 'cancelled';
  trialEndDate: Date | null;
  trialDaysLeft: number;
  isTrialActive: boolean;
  hasAccess: boolean; // trial ativo ou premium
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    isPremium: false,
    subscriptionStatus: 'trial',
    trialEndDate: null,
    trialDaysLeft: 0,
    isTrialActive: false,
    hasAccess: false,
  });
  const [loading, setLoading] = useState(true);

  const fetchSubscriptionData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_premium, subscription_status, trial_end_date')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching subscription data:', error);
        return;
      }

      const now = new Date();
      const trialEndDate = data.trial_end_date ? new Date(data.trial_end_date) : null;
      const trialDaysLeft = trialEndDate 
        ? Math.max(0, Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
        : 0;
      
      const isTrialActive = trialEndDate ? trialEndDate > now : false;
      const isPremium = data.is_premium || false;
      const hasAccess = isPremium || isTrialActive;

      setSubscriptionData({
        isPremium,
        subscriptionStatus: (data.subscription_status as 'trial' | 'active' | 'expired' | 'cancelled') || 'trial',
        trialEndDate,
        trialDaysLeft,
        isTrialActive,
        hasAccess,
      });
    } catch (error) {
      console.error('Error in fetchSubscriptionData:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, [user]);

  const refreshSubscription = () => {
    fetchSubscriptionData();
  };

  return {
    ...subscriptionData,
    loading,
    refreshSubscription,
  };
};