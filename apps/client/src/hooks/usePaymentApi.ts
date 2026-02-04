/**
 * Payment API Hook
 * Custom hook for payment-related API calls
 */

import { useApiCall } from './useApiCall';
import { getStripeConnectApi } from '../api/services/paymentService';

/**
 * Hook for get stripe connect API
 */
export const useGetStripeConnect = () => {
  return useApiCall<Awaited<ReturnType<typeof getStripeConnectApi>>, []>(getStripeConnectApi);
};

