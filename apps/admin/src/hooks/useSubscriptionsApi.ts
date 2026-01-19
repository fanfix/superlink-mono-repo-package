/**
 * useSubscriptionsApi Hook
 * Provides access to subscriptions API functions
 */

import { useApiCall } from './useApiCall';
import {
  getAllSubscriptions,
  getAgencySubscriptionById,
  GetSubscriptionsParams,
  GetSubscriptionByIdParams,
} from '../api/services/subscriptionsService';
import {
  GetAllSubscriptionsResponse,
  GetAgencySubscriptionByIdResponse,
} from '../api/types';

export const useSubscriptionsApi = () => {
  const fetchSubscriptions = useApiCall<GetAllSubscriptionsResponse['getAllSubscriptions'], [GetSubscriptionsParams]>(getAllSubscriptions);
  const fetchSubscription = useApiCall<GetAgencySubscriptionByIdResponse['getAgencySubscriptionById'], [GetSubscriptionByIdParams]>(getAgencySubscriptionById);

  return {
    fetchSubscriptions,
    fetchSubscription,
  };
};

export type {
  GetSubscriptionsParams,
  GetSubscriptionByIdParams,
};

