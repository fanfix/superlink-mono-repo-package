/**
 * Creators Service
 * Handles all creators-related API calls
 */

import restClient from '../config/restClient';
import { executeGraphQL } from '../config/graphqlClient';
import {
  GET_CREATORS_QUERY,
  GET_CREATORS_WITH_UNLOCK_CONTENT_QUERY,
  GET_CREATOR_QUERY,
  CREATE_AGENCY_CREATOR_MUTATION,
  REVOKE_AGENCY_ACCESS_MUTATION,
} from '../queries';
import {
  Creator,
  TopCreator,
  CreatorEarningsPoint,
  CreatorTotalEarningsResponse,
  ToggleResponse,
} from '../types';

/**
 * Get Creators
 */
export interface GetCreatorsParams {
  agencyId: string;
  query?: string;
  limit?: number;
  offset?: number;
  teamId?: string | null;
}

export interface GetCreatorsResponse {
  getCreators: Creator[];
  creatorsAggregate: number;
}

export interface GetCreatorsWithUnlockContentResponse {
  getCreatorsWithUnlockContent: Creator[];
  creatorsAggregate: number;
}

export const getCreators = async (params: GetCreatorsParams): Promise<GetCreatorsResponse> => {
  const response = await executeGraphQL<GetCreatorsResponse>({
    operationName: 'GetCreators',
    query: GET_CREATORS_QUERY,
    variables: params,
  });

  return response.data;
};

/**
 * Get Creators with Unlock Content (Superlocked)
 */
export const getCreatorsWithUnlockContent = async (
  params: GetCreatorsParams
): Promise<GetCreatorsWithUnlockContentResponse> => {
  const response = await executeGraphQL<GetCreatorsWithUnlockContentResponse>({
    operationName: 'getCreatorsWithUnlockContent',
    query: GET_CREATORS_WITH_UNLOCK_CONTENT_QUERY,
    variables: params,
  });

  return response.data;
};

/**
 * Get Agency Top Creators
 */
export interface TopCreatorsParams {
  agencyId: string;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export const getTopCreators = async (params: TopCreatorsParams): Promise<TopCreator[]> => {
  const { agencyId, limit = 50, startDate, endDate } = params;
  
  const queryParams = new URLSearchParams();
  if (limit) queryParams.append('limit', limit.toString());
  if (startDate) queryParams.append('startDate', startDate);
  if (endDate) queryParams.append('endDate', endDate);

  const response = await restClient.get<TopCreator[]>(
    `/agency/earnings/top-creators/${agencyId}?${queryParams.toString()}`
  );

  return response.data;
};

/**
 * Get Creator by ID
 */
export interface GetCreatorParams {
  bioId: string;
  teamId?: string | null;
}

export interface GetCreatorResponse {
  getCreator: Creator;
}

/**
 * Get Agency Access Token for Creator
 */
export interface GetAccessTokenParams {
  bioId: string;
}

export interface GetAccessTokenResponse {
  accessToken?: string;
  [key: string]: any;
}

export const getAgencyAccessToken = async (params: GetAccessTokenParams): Promise<GetAccessTokenResponse> => {
  const response = await restClient.post<GetAccessTokenResponse>(
    '/agency/access-token',
    { bioId: params.bioId }
  );

  return response.data;
};

/**
 * Get Agency Access Token for Account Claim (with userId)
 */
export interface GetAccountClaimTokenParams {
  userId: string;
}

export const getAccountClaimToken = async (params: GetAccountClaimTokenParams): Promise<GetAccessTokenResponse> => {
  const response = await restClient.post<GetAccessTokenResponse>(
    '/agency/access-token',
    { userId: params.userId }
  );

  return response.data;
};

/**
 * Get Stripe Connect URL
 */
export interface GetStripeConnectUrlResponse {
  url?: string;
  connectUrl?: string;
  [key: string]: any;
}

export const getStripeConnectUrl = async (): Promise<GetStripeConnectUrlResponse> => {
  const response = await restClient.get<GetStripeConnectUrlResponse>(
    '/payments/stripe-connect'
  );

  return response.data;
};

export const getCreator = async (params: GetCreatorParams): Promise<GetCreatorResponse> => {
  // Call GetCreator API first
  const response = await executeGraphQL<GetCreatorResponse>({
    operationName: 'GetCreator',
    query: GET_CREATOR_QUERY,
    variables: params,
  });

  return response.data;
};

/**
 * Get Agency Total Earnings
 */
export const getTotalEarnings = async (agencyId: string): Promise<number> => {
  const response = await restClient.get<{ totalEarnings: number }>(
    `/agency/total-earnings/${agencyId}`
  );

  return response.data.totalEarnings;
};

/**
 * Create Agency Creator
 */
export interface CreateAgencyCreatorInput {
  pageName: string;
  username?: string;
  email?: string;
  agencyId?: string;
  introMessage?: string;
  phoneNumber?: string;
  bio?: string;
}

export interface CreateAgencyCreatorResponse {
  createAgencyCreator: {
    id: string;
    __typename?: string;
  };
}

export const createAgencyCreator = async (
  input: CreateAgencyCreatorInput
): Promise<CreateAgencyCreatorResponse['createAgencyCreator']> => {
  const response = await executeGraphQL<CreateAgencyCreatorResponse>({
    operationName: 'CreateAgencyCreator',
    query: CREATE_AGENCY_CREATOR_MUTATION,
    variables: { input },
  });

  if (!response.data?.createAgencyCreator) {
    throw new Error('Failed to create agency creator');
  }

  return response.data.createAgencyCreator;
};

/**
 * Revoke Agency Access (remove creator from agency)
 */
export interface RevokeAgencyAccessParams {
  agencyId: string;
  bioId: string;
}

export interface RevokeAgencyAccessResponse {
  revokeAgencyAccess: {
    id: string;
    __typename?: string;
  };
}

export const revokeAgencyAccess = async (
  params: RevokeAgencyAccessParams
): Promise<RevokeAgencyAccessResponse['revokeAgencyAccess']> => {
  const response = await executeGraphQL<RevokeAgencyAccessResponse>({
    operationName: 'RevokeAgencyAccess',
    query: REVOKE_AGENCY_ACCESS_MUTATION,
    variables: params,
  });

  if (!response.data?.revokeAgencyAccess) {
    throw new Error('Failed to revoke agency access');
  }

  return response.data.revokeAgencyAccess;
};

/**
 * Toggle Agency Branding
 */
export interface ToggleAgencyBrandingParams {
  bioId: string;
}

export const toggleAgencyBranding = async (
  params: ToggleAgencyBrandingParams
): Promise<ToggleResponse> => {
  const response = await restClient.put<ToggleResponse>(
    '/agency/toggle-agency-branding',
    { bioId: params.bioId }
  );

  return response.data;
};

/**
 * Toggle Creator Payout Method
 */
export interface TogglePayoutMethodParams {
  bioId: string;
}

export const toggleCreatorPayoutMethod = async (
  params: TogglePayoutMethodParams
): Promise<ToggleResponse> => {
  const response = await restClient.put<ToggleResponse>(
    '/agency/toggle-bio-payout-method',
    { bioId: params.bioId }
  );

  return response.data;
};

/**
 * Get Creator Daily Earnings
 */
export interface CreatorEarningsParams {
  bioId: string;
  startDate: string;
  endDate: string;
}

export const getCreatorDailyEarnings = async (
  params: CreatorEarningsParams
): Promise<CreatorEarningsPoint[]> => {
  const { bioId, startDate, endDate } = params;
  const response = await restClient.get<CreatorEarningsPoint[]>(
    `/agency/earnings/user/${bioId}/daily`,
    {
      params: {
        startDate,
        endDate,
      },
    }
  );

  return response.data;
};

/**
 * Get Creator Total Earnings (optionally for a date range)
 */
export interface CreatorTotalEarningsParams {
  bioId: string;
  startDate?: string;
  endDate?: string;
}

export const getCreatorTotalEarningsForRange = async (
  params: CreatorTotalEarningsParams
): Promise<number> => {
  const { bioId, startDate, endDate } = params;

  const queryParams = new URLSearchParams();
  if (startDate) queryParams.append('startDate', startDate);
  if (endDate) queryParams.append('endDate', endDate);

  const suffix = queryParams.toString() ? `?${queryParams.toString()}` : '';

  const response = await restClient.get<CreatorTotalEarningsResponse | { totalEarnings: number }>(
    `/agency/earnings/user/${bioId}/total${suffix}`
  );

  // Some endpoints might return { totalEarnings } or { total }
  const data: any = response.data;
  if (typeof data === 'number') {
    return data;
  }

  if (typeof data?.totalEarnings === 'number') {
    return data.totalEarnings;
  }

  if (typeof data?.total === 'number') {
    return data.total;
  }

  throw new Error('Unexpected response for total earnings');
};

export default {
  getCreators,
  getCreatorsWithUnlockContent,
  getCreator,
  getAgencyAccessToken,
  getTopCreators,
  getTotalEarnings,
  createAgencyCreator,
  revokeAgencyAccess,
  toggleAgencyBranding,
  toggleCreatorPayoutMethod,
  getCreatorDailyEarnings,
  getCreatorTotalEarningsForRange,
};

