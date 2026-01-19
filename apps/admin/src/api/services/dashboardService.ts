/**
 * Dashboard Service for Admin Panel
 * Handles all dashboard-related API calls
 */

import { executeGraphQL } from '../config/graphqlClient';
import {
  INSIGHTS_QUERY,
} from '../queries';
import {
  InsightsResponse,
  Insights,
} from '../types';

/**
 * Get Insights
 */
export const getInsights = async (): Promise<Insights> => {
  const response = await executeGraphQL<InsightsResponse>({
    operationName: 'Insights',
    query: INSIGHTS_QUERY,
    variables: {},
  });

  return response.data.insights;
};

export default {
  getInsights,
};

