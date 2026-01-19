/**
 * Subscriptions Service for Admin Panel
 * Handles all subscriptions-related API calls
 */

import { executeGraphQL } from '../config/graphqlClient';
import {
  GET_ALL_SUBSCRIPTIONS_QUERY,
  GET_AGENCY_SUBSCRIPTION_BY_ID_QUERY,
} from '../queries';
import {
  GetAllSubscriptionsResponse,
  GetAgencySubscriptionByIdResponse,
  Subscription,
} from '../types';

/**
 * Get All Subscriptions
 */
export interface GetSubscriptionsParams {
  limit?: number;
  offset?: number;
  where?: Record<string, any>;
  status?: string;
  orderBy?: Record<string, any>;
}

export const getAllSubscriptions = async (
  params: GetSubscriptionsParams
): Promise<GetAllSubscriptionsResponse['getAllSubscriptions']> => {
  const response = await executeGraphQL<GetAllSubscriptionsResponse>({
    operationName: 'GetAllSubscriptions',
    query: GET_ALL_SUBSCRIPTIONS_QUERY,
    variables: params,
  });

  return response.data.getAllSubscriptions;
};

/**
 * Get Agency Subscription by ID
 */
export interface GetSubscriptionByIdParams {
  subscriptionId: string;
}

export const getAgencySubscriptionById = async (
  params: GetSubscriptionByIdParams
): Promise<GetAgencySubscriptionByIdResponse['getAgencySubscriptionById']> => {
  const response = await executeGraphQL<GetAgencySubscriptionByIdResponse>({
    operationName: 'GetAgencySubscriptionById',
    query: GET_AGENCY_SUBSCRIPTION_BY_ID_QUERY,
    variables: params,
  });

  return response.data.getAgencySubscriptionById;
};

export default {
  getAllSubscriptions,
  getAgencySubscriptionById,
};

