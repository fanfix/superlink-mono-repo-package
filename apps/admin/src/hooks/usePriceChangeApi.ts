/**
 * usePriceChangeApi Hook
 * Provides access to price change requests API functions
 */

import { useApiCall } from './useApiCall';
import {
  getPriceChangeRequests,
  getPriceChangeRequest,
  updatePriceChange,
  GetPriceChangeRequestsParams,
  GetPriceChangeRequestParams,
  UpdatePriceChangeParams,
} from '../api/services/priceChangeService';
import {
  PriceChangeRequestsResponse,
  PriceChangeRequestResponse,
  UpdatePriceChangeResponse,
} from '../api/types';

export const usePriceChangeApi = () => {
  const fetchRequests = useApiCall<PriceChangeRequestsResponse, [GetPriceChangeRequestsParams]>(getPriceChangeRequests);
  const fetchRequest = useApiCall<PriceChangeRequestResponse['priceChangeRequest'], [GetPriceChangeRequestParams]>(getPriceChangeRequest);
  const update = useApiCall<UpdatePriceChangeResponse['updatePriceChange'], [UpdatePriceChangeParams]>(updatePriceChange);

  return {
    fetchRequests,
    fetchRequest,
    update,
  };
};

export type {
  GetPriceChangeRequestsParams,
  GetPriceChangeRequestParams,
  UpdatePriceChangeParams,
};

