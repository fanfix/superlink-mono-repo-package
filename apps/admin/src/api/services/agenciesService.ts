/**
 * Agencies Service for Admin Panel
 * Handles all agencies-related API calls
 */

import { executeGraphQL } from '../config/graphqlClient';
import {
  GET_ALL_AGENCIES_QUERY,
  GET_AGENCY_BY_ID_QUERY,
  CREATE_SUBSCRIPTION_PLAN_MUTATION,
  UPDATE_SUBSCRIPTION_PLAN_MUTATION,
} from '../queries';
import {
  GetAllAgenciesResponse,
  GetAgencyByIdResponse,
  CreateSubscriptionPlanDto,
  CreateSubscriptionPlanResponse,
  UpdateSubscriptionPlanDto,
  UpdateSubscriptionPlanResponse,
  Agency,
} from '../types';

/**
 * Get All Agencies
 */
export interface GetAgenciesParams {
  limit?: number;
  offset?: number;
  withDeleted?: boolean;
  where?: Record<string, any>;
  orderBy?: Record<string, any>;
}

export const getAllAgencies = async (
  params: GetAgenciesParams
): Promise<GetAllAgenciesResponse['getAllAgencies']> => {
  const response = await executeGraphQL<GetAllAgenciesResponse>({
    operationName: 'GetAllAgencies',
    query: GET_ALL_AGENCIES_QUERY,
    variables: params,
  });

  return response.data.getAllAgencies;
};

/**
 * Get Agency by ID
 */
export interface GetAgencyByIdParams {
  agencyId: string;
}

export const getAgencyById = async (
  params: GetAgencyByIdParams
): Promise<GetAgencyByIdResponse['getAgencyById']> => {
  const response = await executeGraphQL<GetAgencyByIdResponse>({
    operationName: 'getAgencyById',
    query: GET_AGENCY_BY_ID_QUERY,
    variables: params,
  });

  return response.data.getAgencyById;
};

/**
 * Create Subscription Plan
 */
export interface CreateSubscriptionPlanParams {
  createSubscriptionPlanDto: CreateSubscriptionPlanDto;
}

export const createSubscriptionPlan = async (
  params: CreateSubscriptionPlanParams
): Promise<CreateSubscriptionPlanResponse['createSubscriptionPlan']> => {
  const response = await executeGraphQL<CreateSubscriptionPlanResponse>({
    operationName: 'CreateSubscriptionPlan',
    query: CREATE_SUBSCRIPTION_PLAN_MUTATION,
    variables: params,
  });

  return response.data.createSubscriptionPlan;
};

/**
 * Update Subscription Plan
 */
export interface UpdateSubscriptionPlanParams {
  updatePlanDto: UpdateSubscriptionPlanDto;
}

export const updateSubscriptionPlan = async (
  params: UpdateSubscriptionPlanParams
): Promise<UpdateSubscriptionPlanResponse['updateSubscriptionPlan']> => {
  const response = await executeGraphQL<UpdateSubscriptionPlanResponse>({
    operationName: 'UpdateSubscriptionPlan',
    query: UPDATE_SUBSCRIPTION_PLAN_MUTATION,
    variables: params,
  });

  return response.data.updateSubscriptionPlan;
};

export default {
  getAllAgencies,
  getAgencyById,
  createSubscriptionPlan,
  updateSubscriptionPlan,
};

