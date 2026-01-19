/**
 * Insights Service
 * Handles all analytics/insights-related API calls
 */

import { executeGraphQL } from '../config/graphqlClient';
import restClient from '../config/restClient';
import {
  InsightsData,
  PageVisit,
  ContentAnalytics,
  AllInsightsResponse,
  GraphCalendarResponse,
  ClickAnalytics,
  RevenueInsightsResponse,
  createApiError,
} from '../types';
import {
  GET_INSIGHTS_QUERY,
  GET_PAGE_VISITS_QUERY,
  GET_CONTENT_ANALYTICS_QUERY,
} from '../queries';

/**
 * Get Overall Insights (GraphQL)
 */
export const getInsightsApi = async (
  bioId: string,
  startDate: string,
  endDate: string
): Promise<InsightsData> => {
  try {
    const response = await executeGraphQL<{ getInsights: InsightsData }>({
      operationName: 'GetInsights',
      query: GET_INSIGHTS_QUERY,
      variables: { bioId, startDate, endDate },
    });

    return response.data.getInsights;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Get Page Visits
 */
export const getPageVisitsApi = async (
  bioId: string,
  startDate: string,
  endDate: string
): Promise<PageVisit[]> => {
  try {
    const response = await executeGraphQL<{ getPageVisits: PageVisit[] }>({
      operationName: 'GetPageVisits',
      query: GET_PAGE_VISITS_QUERY,
      variables: { bioId, startDate, endDate },
    });

    return response.data.getPageVisits;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Get Content Analytics
 */
export const getContentAnalyticsApi = async (
  bioId: string,
  startDate: string,
  endDate: string
): Promise<ContentAnalytics[]> => {
  try {
    const response = await executeGraphQL<{ getContentAnalytics: ContentAnalytics[] }>({
      operationName: 'GetContentAnalytics',
      query: GET_CONTENT_ANALYTICS_QUERY,
      variables: { bioId, startDate, endDate },
    });

    return response.data.getContentAnalytics;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Get All Insights (Event Analytics)
 */
export const getAllInsightsApi = async (): Promise<AllInsightsResponse> => {
  try {
    const response = await restClient.get<AllInsightsResponse>('/insights/all');
    return response.data;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Get Graph Calendar Analytics
 */
export const getGraphCalendarApi = async (startDate: string): Promise<GraphCalendarResponse> => {
  try {
    const response = await restClient.get<GraphCalendarResponse>('/insights/graphs', {
      params: { startDate },
    });
    return response.data;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Get Clicks Insights
 * Returns click analytics for sections, social links, and buttons
 */
export const getClicksInsightsApi = async (startDate?: string): Promise<ClickAnalytics[]> => {
  try {
    const params = startDate ? { startDate } : {};
    const response = await restClient.get<ClickAnalytics[]>('/insights/clicks', {
      params,
    });
    return response.data;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Get Revenue Insights
 * Returns revenue analytics breakdown by type
 */
export const getRevenueInsightsApi = async (startDate?: string): Promise<RevenueInsightsResponse> => {
  try {
    const params = startDate ? { startDate } : {};
    const response = await restClient.get<RevenueInsightsResponse>('/insights/revenues', {
      params,
    });
    return response.data;
  } catch (error: any) {
    throw createApiError(error);
  }
};

export default {
  getInsightsApi,
  getPageVisitsApi,
  getContentAnalyticsApi,
  getAllInsightsApi,
  getGraphCalendarApi,
  getClicksInsightsApi,
  getRevenueInsightsApi,
};
