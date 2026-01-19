/**
 * Dashboard Service
 * Handles all dashboard-related API calls
 */

import { executeGraphQL } from '../config/graphqlClient';
import {
  DAILY_AGENCY_VISITS_QUERY,
  GET_PROFILE_VISITS_QUERY,
  GET_RECENT_ACTIVITIES_QUERY,
  GET_ANALYTICS_QUERY,
} from '../queries';
import {
  DailyAgencyVisit,
  ProfileVisit,
  RecentActivity,
  Analytics,
  GraphQLDataResponse,
} from '../types';

/**
 * Get Daily Agency Visits
 */
export interface DailyAgencyVisitsParams {
  agencyId: string;
  startDate: string;
  endDate: string;
}

export const getDailyAgencyVisits = async (
  params: DailyAgencyVisitsParams
): Promise<DailyAgencyVisit[]> => {
  const response = await executeGraphQL<{
    dailyAgencyVisits: DailyAgencyVisit[];
  }>({
    operationName: 'DailyAgencyVisits',
    query: DAILY_AGENCY_VISITS_QUERY,
    variables: params,
  });

  return response.data.dailyAgencyVisits;
};

/**
 * Get Profile Visits
 */
export interface ProfileVisitsParams {
  startDate: string;
  endDate: string;
}

export const getProfileVisits = async (
  params: ProfileVisitsParams
): Promise<ProfileVisit[]> => {
  const response = await executeGraphQL<{
    getProfileVisits: ProfileVisit[];
  }>({
    operationName: 'GetProfileVisits',
    query: GET_PROFILE_VISITS_QUERY,
    variables: params,
  });

  return response.data.getProfileVisits;
};

/**
 * Get Recent Activities
 */
export interface RecentActivitiesParams {
  agencyId: string;
  offset?: number;
  limit?: number;
}

export const getRecentActivities = async (
  params: RecentActivitiesParams
): Promise<RecentActivity[]> => {
  try {
    console.log('getRecentActivities: Calling API with params:', params);
    
    // getRecentActivities returns JSON! type, so we get the JSON directly
    const response = await executeGraphQL<{
      getRecentActivities: {
        data: RecentActivity[];
        meta: {
          total: number;
          offset: number;
          limit: number;
          hasMore: boolean;
        };
      };
    }>({
      operationName: 'GetRecentActivities',
      query: GET_RECENT_ACTIVITIES_QUERY,
      variables: params,
    });

    console.log('getRecentActivities: API response:', {
      response,
      hasData: !!response.data,
      hasGetRecentActivities: !!response.data?.getRecentActivities,
      responseDataType: typeof response.data,
      getRecentActivitiesType: typeof response.data?.getRecentActivities,
    });

    // GraphQL response structure: { data: { getRecentActivities: { data: [...], meta: {...} } } }
    // executeGraphQL returns response.data, so we get: { getRecentActivities: { data: [...], meta: {...} } }
    // Since getRecentActivities returns JSON!, we get the JSON object directly
    const getRecentActivitiesResponse = response.data?.getRecentActivities;
    
    if (getRecentActivitiesResponse && typeof getRecentActivitiesResponse === 'object') {
      // Check if it has the nested structure with data and meta
      if ('data' in getRecentActivitiesResponse && Array.isArray(getRecentActivitiesResponse.data)) {
        const activities = getRecentActivitiesResponse.data;
        console.log('getRecentActivities: ✅ Returning activities from data.data:', activities.length);
        return activities;
      }
      
      // Check if it's directly an array
      if (Array.isArray(getRecentActivitiesResponse)) {
        console.log('getRecentActivities: ✅ getRecentActivities is array, returning:', getRecentActivitiesResponse.length);
        return getRecentActivitiesResponse as RecentActivity[];
      }
    }
    
    // Fallback: If response.data is the actual data (not wrapped)
    if (Array.isArray(response.data)) {
      console.log('getRecentActivities: ✅ Response.data is array, returning:', response.data.length);
      return response.data as RecentActivity[];
    }

    console.error('getRecentActivities: ❌ Unexpected response structure', {
      response,
      responseDataType: typeof response,
      hasData: !!response.data,
      dataType: typeof response.data,
      responseKeys: response.data ? Object.keys(response.data) : [],
      getRecentActivities: response.data?.getRecentActivities,
      getRecentActivitiesType: typeof response.data?.getRecentActivities,
      getRecentActivitiesKeys: response.data?.getRecentActivities && typeof response.data.getRecentActivities === 'object' 
        ? Object.keys(response.data.getRecentActivities) 
        : [],
    });

    return [];
  } catch (error: any) {
    console.error('getRecentActivities: ❌ Error fetching recent activities', {
      error,
      errorMessage: error?.message,
      errorResponse: error?.response?.data,
      params,
    });
    throw error;
  }
};

/**
 * Get Analytics
 */
export interface AnalyticsParams {
  agencyId: string;
  creators: string[];
}

export const getAnalytics = async (params: AnalyticsParams): Promise<Analytics> => {
  const response = await executeGraphQL<{
    getAnalytics: Analytics;
  }>({
    operationName: 'GetAnalytics',
    query: GET_ANALYTICS_QUERY,
    variables: params,
  });

  return response.data.getAnalytics;
};

export default {
  getDailyAgencyVisits,
  getProfileVisits,
  getRecentActivities,
  getAnalytics,
};

