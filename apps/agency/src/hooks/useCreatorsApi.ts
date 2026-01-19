/**
 * useCreatorsApi Hook
 * Provides access to creators data from ApiContext
 * All API calls are handled in ApiContext, hooks just provide the data
 */

import { useApiContext } from '../contexts/ApiContext';
import { useCallback } from 'react';
import {
  getCreators,
  getCreatorsWithUnlockContent,
  getCreator,
  getTopCreators,
  createAgencyCreator,
  revokeAgencyAccess,
  toggleAgencyBranding,
  toggleCreatorPayoutMethod,
  getCreatorDailyEarnings,
  getCreatorTotalEarningsForRange,
  getAgencyAccessToken,
  GetCreatorsParams,
  GetCreatorParams,
  TopCreatorsParams,
  CreateAgencyCreatorInput,
  RevokeAgencyAccessParams,
  ToggleAgencyBrandingParams,
  TogglePayoutMethodParams,
  CreatorEarningsParams,
  CreatorTotalEarningsParams,
  GetAccessTokenParams,
} from '../api/services/creatorsService';
import { TopCreator, CreatorEarningsPoint } from '../api/types';
import { useApiCall } from './useApiCall';

export const useCreatorsApi = () => {
  const {
    dashboardData,
    loadingStates,
    errors,
    refreshTotalEarnings,
  } = useApiContext();
  
  // These APIs are not in context yet, so use useApiCall for now
  const fetchCreators = useApiCall(getCreators);
  const fetchCreatorsWithUnlockContent = useApiCall(getCreatorsWithUnlockContent);
  const fetchCreator = useApiCall(getCreator);
  const fetchTopCreators = useApiCall(getTopCreators);
  const createCreator = useApiCall(createAgencyCreator);
  const revokeCreator = useApiCall(revokeAgencyAccess);
  const toggleBranding = useApiCall(toggleAgencyBranding);
  const togglePayout = useApiCall(toggleCreatorPayoutMethod);
  const fetchCreatorDailyEarnings = useApiCall<CreatorEarningsPoint[], [CreatorEarningsParams]>(
    getCreatorDailyEarnings,
    { throwOnError: false }
  );
  const fetchCreatorTotalEarnings = useApiCall<number, [CreatorTotalEarningsParams]>(
    getCreatorTotalEarningsForRange,
    { throwOnError: false }
  );
  const getAccessToken = useApiCall(getAgencyAccessToken);
  
  return {
    // Data from context
    totalEarnings: dashboardData.totalEarnings,
    
    // Loading states
    loading: loadingStates.totalEarnings ||
             fetchCreators.loading ||
             fetchCreatorsWithUnlockContent.loading ||
             fetchCreator.loading ||
             fetchTopCreators.loading,
    loadingStates: {
      totalEarnings: loadingStates.totalEarnings,
      creators: fetchCreators.loading,
      creatorsWithUnlockContent: fetchCreatorsWithUnlockContent.loading,
      creator: fetchCreator.loading,
      topCreators: fetchTopCreators.loading,
    },
    
    // Error states
    error: errors.totalEarnings ||
           fetchCreators.error ||
           fetchCreatorsWithUnlockContent.error ||
           fetchCreator.error ||
           fetchTopCreators.error,
    errors: {
      totalEarnings: errors.totalEarnings,
      creators: fetchCreators.error,
      creatorsWithUnlockContent: fetchCreatorsWithUnlockContent.error,
      creator: fetchCreator.error,
      topCreators: fetchTopCreators.error,
    },
    
    // Refresh functions
    refreshTotalEarnings,
    fetchCreators,
    fetchCreatorsWithUnlockContent,
    fetchCreator,
    fetchTopCreators,
    createCreator,
    revokeCreator,
    toggleBranding,
    togglePayout,
    fetchCreatorDailyEarnings,
    fetchCreatorTotalEarnings,
    getAccessToken,
  };
};

export type {
  GetCreatorsParams,
  GetCreatorParams,
  TopCreatorsParams,
  CreateAgencyCreatorInput,
  RevokeAgencyAccessParams,
  ToggleAgencyBrandingParams,
  TogglePayoutMethodParams,
  CreatorEarningsParams,
  CreatorTotalEarningsParams,
  GetAccessTokenParams,
};
