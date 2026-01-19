/**
 * Profile Settings Service
 * Handles profile settings related API calls
 */

import restClient from '../config/restClient';
import {
  DecryptProfileRequest,
  DecryptProfileResponse,
  createApiError,
} from '../types';

/**
 * Decrypt Profile (email and phoneNumber)
 */
export const decryptProfileApi = async (
  request: DecryptProfileRequest
): Promise<DecryptProfileResponse> => {
  try {
    const response = await restClient.post<DecryptProfileResponse>('/decrypt', request);
    return response.data;
  } catch (error: any) {
    throw createApiError(error);
  }
};

export default {
  decryptProfileApi,
};

