/**
 * Price Change Requests Service for Admin Panel
 * Handles all price change requests-related API calls
 */

import { executeGraphQL } from '../config/graphqlClient';
import {
  PRICE_CHANGE_REQUESTS_QUERY,
  PRICE_CHANGE_REQUEST_QUERY,
  UPDATE_PRICE_CHANGE_MUTATION,
} from '../queries';
import {
  PriceChangeRequestsResponse,
  PriceChangeRequestResponse,
  UpdatePriceChangeResponse,
  PriceChangeRequest,
} from '../types';

/**
 * Get Price Change Requests
 */
export interface GetPriceChangeRequestsParams {
  limit?: number;
  offset?: number;
  where?: Record<string, any>;
  orderBy?: Record<string, any>;
  withDeleted?: boolean;
}

export const getPriceChangeRequests = async (
  params: GetPriceChangeRequestsParams
): Promise<PriceChangeRequestsResponse> => {
  const response = await executeGraphQL<PriceChangeRequestsResponse>({
    operationName: 'PriceChangeRequests',
    query: PRICE_CHANGE_REQUESTS_QUERY,
    variables: params,
  });

  return response.data;
};

/**
 * Get Price Change Request by ID
 */
export interface GetPriceChangeRequestParams {
  reqId: string;
  withDeleted?: boolean;
}

export const getPriceChangeRequest = async (
  params: GetPriceChangeRequestParams
): Promise<PriceChangeRequestResponse['priceChangeRequest']> => {
  const response = await executeGraphQL<PriceChangeRequestResponse>({
    operationName: 'PriceChangeRequest',
    query: PRICE_CHANGE_REQUEST_QUERY,
    variables: params,
  });

  return response.data.priceChangeRequest;
};

/**
 * Update Price Change Request
 */
export interface UpdatePriceChangeParams {
  reqId: string;
  approved: boolean;
}

export const updatePriceChange = async (
  params: UpdatePriceChangeParams
): Promise<UpdatePriceChangeResponse['updatePriceChange']> => {
  const response = await executeGraphQL<UpdatePriceChangeResponse>({
    operationName: 'UpdatePriceChange',
    query: UPDATE_PRICE_CHANGE_MUTATION,
    variables: params,
  });

  return response.data.updatePriceChange;
};

export default {
  getPriceChangeRequests,
  getPriceChangeRequest,
  updatePriceChange,
};

