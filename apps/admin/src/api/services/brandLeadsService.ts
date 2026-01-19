/**
 * Brand Kit Leads Service for Admin Panel
 * Handles all brand kit leads-related API calls
 */

import { executeGraphQL } from '../config/graphqlClient';
import {
  GET_ALL_BRAND_LEADS_QUERY,
  GET_BRAND_LEAD_BY_ID_QUERY,
} from '../queries';
import {
  GetAllBrandLeadsResponse,
  GetBrandLeadByIdResponse,
  BrandLead,
} from '../types';

/**
 * Get All Brand Leads
 */
export interface GetBrandLeadsParams {
  limit?: number;
  offset?: number;
  orderBy?: Record<string, any>;
  where?: Record<string, any>;
}

export const getAllBrandLeads = async (
  params: GetBrandLeadsParams
): Promise<GetAllBrandLeadsResponse['getAllBrandLeads']> => {
  const response = await executeGraphQL<GetAllBrandLeadsResponse>({
    operationName: 'GetAllBrandLeads',
    query: GET_ALL_BRAND_LEADS_QUERY,
    variables: params,
  });

  return response.data.getAllBrandLeads;
};

/**
 * Get Brand Lead by ID
 */
export interface GetBrandLeadByIdParams {
  brandLeadId: string;
}

export const getBrandLeadById = async (
  params: GetBrandLeadByIdParams
): Promise<GetBrandLeadByIdResponse['getBrandLeadById']> => {
  const response = await executeGraphQL<GetBrandLeadByIdResponse>({
    operationName: 'GetBrandLeadById',
    query: GET_BRAND_LEAD_BY_ID_QUERY,
    variables: params,
  });

  return response.data.getBrandLeadById;
};

export default {
  getAllBrandLeads,
  getBrandLeadById,
};

