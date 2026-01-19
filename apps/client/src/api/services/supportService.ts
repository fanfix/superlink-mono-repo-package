/**
 * Support Service
 * Handles support/contact related API calls
 */

import restClient from '../config/restClient';
import { createApiError } from '../types';

/**
 * Contact Support Input
 */
export interface ContactSupportInput {
  subject: string;
  message: string;
  email?: string;
  name?: string;
}

/**
 * Contact Support Response
 */
export interface ContactSupportResponse {
  success: boolean;
  message: string;
}

/**
 * Send Support Email
 * Sends a support email to the support team
 */
export const contactSupportApi = async (
  input: ContactSupportInput
): Promise<ContactSupportResponse> => {
  try {
    const response = await restClient.post<ContactSupportResponse>('/support/contact', input);
    return response.data;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Get Support Email
 * Returns the support email address
 */
export const getSupportEmail = (): string => {
  return 'hello@superlink.io';
};

export default {
  contactSupportApi,
  getSupportEmail,
};

