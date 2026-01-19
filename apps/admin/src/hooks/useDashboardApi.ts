/**
 * useDashboardApi Hook
 * Provides access to dashboard API functions
 */

import { useApiCall } from './useApiCall';
import {
  getInsights,
} from '../api/services/dashboardService';
import {
  Insights,
} from '../api/types';

export const useDashboardApi = () => {
  const fetchInsights = useApiCall<Insights, []>(getInsights);

  return {
    fetchInsights,
  };
};

