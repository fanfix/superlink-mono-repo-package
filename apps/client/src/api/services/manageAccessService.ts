/**
 * Manage Access Service
 * Handles manage access/search related API calls
 */

import restClient from '../config/restClient';
import { ManageAccessSearchResponse, createApiError } from '../types';

/**
 * Search Agency/Users
 */
export const searchManageAccessApi = async (query: string): Promise<ManageAccessSearchResponse> => {
  try {
    const response = await restClient.get<ManageAccessSearchResponse>(`/agency/search`, {
      params: { q: query },
    });
    return response.data;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Agency Status (check if agency is invited/connected)
 */
export interface AgencyStatus {
  id: string;
  name: string;
  email?: string;
  imageURL?: string;
  accepted: boolean;
}

export const getAgencyStatusApi = async (bioId: string): Promise<AgencyStatus | null> => {
  try {
    const response = await restClient.post<AgencyStatus>(`/agency/status`, { bioId });
    return response.data;
  } catch (error: any) {
    // If no agency, return null
    if (error.response?.status === 404) {
      return null;
    }
    throw createApiError(error);
  }
};

/**
 * Invite Agency
 */
export interface InviteAgencyInput {
  email?: string;
  agencyId?: string;
  bioId: string;
}

export interface InviteAgencyResponse {
  id: string;
  message?: string;
}

export const inviteAgencyApi = async (input: InviteAgencyInput): Promise<InviteAgencyResponse> => {
  try {
    const response = await restClient.post<InviteAgencyResponse>(`/agency/invite`, input);
    return response.data;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Revoke Agency Access
 */
export interface RevokeAgencyAccessInput {
  bioId: string;
  agencyId: string;
}

export interface RevokeAgencyAccessResponse {
  success: boolean;
  message?: string;
}

export const revokeAgencyAccessApi = async (
  input: RevokeAgencyAccessInput
): Promise<RevokeAgencyAccessResponse> => {
  try {
    const response = await restClient.post<RevokeAgencyAccessResponse>(`/agency/revoke`, input);
    return response.data;
  } catch (error: any) {
    throw createApiError(error);
  }
};

export default {
  searchManageAccessApi,
  getAgencyStatusApi,
  inviteAgencyApi,
  revokeAgencyAccessApi,
};

