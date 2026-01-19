/**
 * Profile Settings API Hook
 * Custom hook for profile settings-related API calls
 */

import { useApiCall } from './useApiCall';
import { decryptProfileApi } from '../api/services/profileSettingsService';
import type {
  DecryptProfileRequest,
  DecryptProfileResponse,
} from '../api/types';

/**
 * Hook for decrypt profile API
 */
export const useDecryptProfile = () => {
  return useApiCall<DecryptProfileResponse, [DecryptProfileRequest]>(decryptProfileApi);
};

