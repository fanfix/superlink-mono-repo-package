/**
 * Manage Access API Hook
 * Custom hook for manage access/search-related API calls
 */

import { useApiCall } from './useApiCall';
import { searchManageAccessApi } from '../api/services/manageAccessService';
import type { ManageAccessSearchResponse } from '../api/types';

/**
 * Hook for search manage access API
 */
export const useSearchManageAccess = () => {
  return useApiCall<ManageAccessSearchResponse, [string]>(searchManageAccessApi);
};

