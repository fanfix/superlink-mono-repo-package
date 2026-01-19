/**
 * useBrandLeadsApi Hook
 * Provides access to brand kit leads API functions
 */

import { useApiCall } from './useApiCall';
import {
  getAllBrandLeads,
  getBrandLeadById,
  GetBrandLeadsParams,
  GetBrandLeadByIdParams,
} from '../api/services/brandLeadsService';
import {
  GetAllBrandLeadsResponse,
  GetBrandLeadByIdResponse,
} from '../api/types';

export const useBrandLeadsApi = () => {
  const fetchLeads = useApiCall<GetAllBrandLeadsResponse['getAllBrandLeads'], [GetBrandLeadsParams]>(getAllBrandLeads);
  const fetchLead = useApiCall<GetBrandLeadByIdResponse['getBrandLeadById'], [GetBrandLeadByIdParams]>(getBrandLeadById);

  return {
    fetchLeads,
    fetchLead,
  };
};

export type {
  GetBrandLeadsParams,
  GetBrandLeadByIdParams,
};

