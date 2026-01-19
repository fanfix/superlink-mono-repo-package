/**
 * Insights API Hook
 * Custom hook for insights/analytics-related API calls
 */

import { useApiCall } from './useApiCall';
import {
  getInsightsApi,
  getPageVisitsApi,
  getContentAnalyticsApi,
  getAllInsightsApi,
  getGraphCalendarApi,
  getClicksInsightsApi,
  getRevenueInsightsApi,
} from '../api/services/insightsService';
import type {
  InsightsData,
  PageVisit,
  ContentAnalytics,
  AllInsightsResponse,
  GraphCalendarResponse,
  ClickAnalytics,
  RevenueInsightsResponse,
} from '../api/types';

/**
 * Hook for get overall insights API
 */
export const useGetInsights = () => {
  return useApiCall<InsightsData, [string, string, string]>(getInsightsApi);
};

/**
 * Hook for get page visits API
 */
export const useGetPageVisits = () => {
  return useApiCall<PageVisit[], [string, string, string]>(getPageVisitsApi);
};

/**
 * Hook for get content analytics API
 */
export const useGetContentAnalytics = () => {
  return useApiCall<ContentAnalytics[], [string, string, string]>(getContentAnalyticsApi);
};

/**
 * Hook for get all insights API (Event Analytics)
 */
export const useGetAllInsights = () => {
  return useApiCall<AllInsightsResponse, []>(getAllInsightsApi);
};

/**
 * Hook for get graph calendar API
 */
export const useGetGraphCalendar = () => {
  return useApiCall<GraphCalendarResponse, [string]>(getGraphCalendarApi);
};

/**
 * Hook for get clicks insights API
 */
export const useGetClicksInsights = () => {
  return useApiCall<ClickAnalytics[], [string?]>(getClicksInsightsApi);
};

/**
 * Hook for get revenue insights API
 */
export const useGetRevenueInsights = () => {
  return useApiCall<RevenueInsightsResponse, [string?]>(getRevenueInsightsApi);
};

