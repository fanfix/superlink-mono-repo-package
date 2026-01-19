/**
 * useReferralApi Hook
 * Provides access to referral-specific data and actions from ApiContext
 */

import { useMemo } from 'react';
import { useApiContext } from '../contexts/ApiContext';

export const useReferralApi = () => {
  const {
    referralData,
    loadingStates,
    errors,
    refreshReferralLink,
    refreshReferralRevenue,
    refreshReferralEarnings,
    refreshReferralDashboard,
  } = useApiContext();

  const isLoading = useMemo(
    () =>
      loadingStates.referralLink ||
      loadingStates.referralRevenue ||
      loadingStates.referralEarnings,
    [loadingStates.referralLink, loadingStates.referralRevenue, loadingStates.referralEarnings]
  );

  return {
    referralLink: referralData.link,
    referralCode: referralData.code,
    referralRevenue: referralData.revenue,
    referralStats: referralData.stats,
    referrals: referralData.referrals,
    isLoading,
    loadingStates: {
      link: loadingStates.referralLink,
      revenue: loadingStates.referralRevenue,
      earnings: loadingStates.referralEarnings,
    },
    errors: {
      link: errors.referralLink,
      revenue: errors.referralRevenue,
      earnings: errors.referralEarnings,
    },
    refreshReferralLink,
    refreshReferralRevenue,
    refreshReferralEarnings,
    refreshReferralDashboard,
  };
};

export default useReferralApi;

