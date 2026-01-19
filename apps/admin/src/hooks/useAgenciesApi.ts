/**
 * useAgenciesApi Hook
 * Provides access to agencies API functions
 */

import { useApiCall } from './useApiCall';
import {
  getAllAgencies,
  getAgencyById,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  GetAgenciesParams,
  GetAgencyByIdParams,
  CreateSubscriptionPlanParams,
  UpdateSubscriptionPlanParams,
} from '../api/services/agenciesService';
import {
  GetAllAgenciesResponse,
  GetAgencyByIdResponse,
  CreateSubscriptionPlanResponse,
  UpdateSubscriptionPlanResponse,
} from '../api/types';

export const useAgenciesApi = () => {
  const fetchAgencies = useApiCall<GetAllAgenciesResponse['getAllAgencies'], [GetAgenciesParams]>(getAllAgencies);
  const fetchAgency = useApiCall<GetAgencyByIdResponse['getAgencyById'], [GetAgencyByIdParams]>(getAgencyById);
  const createPlan = useApiCall<CreateSubscriptionPlanResponse['createSubscriptionPlan'], [CreateSubscriptionPlanParams]>(createSubscriptionPlan);
  const updatePlan = useApiCall<UpdateSubscriptionPlanResponse['updateSubscriptionPlan'], [UpdateSubscriptionPlanParams]>(updateSubscriptionPlan);

  return {
    fetchAgencies,
    fetchAgency,
    createSubscriptionPlan: createPlan,
    updateSubscriptionPlan: updatePlan,
  };
};

export type {
  GetAgenciesParams,
  GetAgencyByIdParams,
  CreateSubscriptionPlanParams,
  UpdateSubscriptionPlanParams,
};

