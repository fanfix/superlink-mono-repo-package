/**
 * Support API Hook
 * Custom hook for support-related API calls
 */

import { useApiCall } from './useApiCall';
import { contactSupportApi, getSupportEmail } from '../api/services/supportService';
import type { ContactSupportInput, ContactSupportResponse } from '../api/types';

/**
 * Hook for contact support API
 */
export const useContactSupport = () => {
  return useApiCall<ContactSupportResponse, [ContactSupportInput]>(contactSupportApi);
};

/**
 * Hook to get support email
 */
export const useSupportEmail = () => {
  return getSupportEmail();
};

