/**
 * Settings Service
 * Handles all settings-related API calls
 */

import restClient from '../config/restClient';
import {
  PayoutMethod,
  EmailRecipient,
  StripeAccount,
  StripeDashboardLink,
  ApiResponse,
} from '../types';

const SETTINGS_ENDPOINTS = {
  PAYOUT_METHOD: '/agency/payout-method',
  RECIPIENT_EMAILS: '/agency/list-recipient-emails',
  STRIPE_ACCOUNT: '/payments/get-agency-stripe-account-details',
  STRIPE_DASHBOARD_LINK: '/payments/get-stripe-dashboard-agency-link',
  TOGGLE_PAYOUT_METHOD: '/agency/toggle-payout-method',
} as const;

/**
 * Get Payout Method
 */
export const getPayoutMethod = async (): Promise<PayoutMethod> => {
  const response = await restClient.get<ApiResponse<PayoutMethod>>(
    SETTINGS_ENDPOINTS.PAYOUT_METHOD
  );
  return response.data.data;
};

/**
 * Get Email Recipients
 */
export const getEmailRecipients = async (): Promise<EmailRecipient> => {
  const response = await restClient.get<ApiResponse<EmailRecipient>>(
    SETTINGS_ENDPOINTS.RECIPIENT_EMAILS
  );
  return response.data.data;
};

/**
 * Get Stripe Account Details
 */
export const getStripeAccountDetails = async (): Promise<StripeAccount> => {
  const response = await restClient.get<StripeAccount | ApiResponse<StripeAccount>>(
    SETTINGS_ENDPOINTS.STRIPE_ACCOUNT
  );

  const payload = response.data as StripeAccount | ApiResponse<StripeAccount>;

  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiResponse<StripeAccount>).data;
  }

  return payload as StripeAccount;
};

/**
 * Get Stripe Dashboard Link for Agency
 */
export const getStripeDashboardLink = async (): Promise<StripeDashboardLink> => {
  const response = await restClient.get<
    ApiResponse<StripeDashboardLink> | StripeDashboardLink
  >(SETTINGS_ENDPOINTS.STRIPE_DASHBOARD_LINK);

  const payload = response.data as StripeDashboardLink | ApiResponse<StripeDashboardLink>;

  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiResponse<StripeDashboardLink>).data;
  }

  return payload as StripeDashboardLink;
};

/**
 * Toggle Agency Payout Method
 */
export const toggleAgencyPayoutMethod = async (
  payload: PayoutMethod
): Promise<PayoutMethod> => {
  const response = await restClient.put<ApiResponse<PayoutMethod>>(
    SETTINGS_ENDPOINTS.TOGGLE_PAYOUT_METHOD,
    payload
  );
  return response.data.data;
};

export default {
  getPayoutMethod,
  getEmailRecipients,
  getStripeAccountDetails,
  getStripeDashboardLink,
  toggleAgencyPayoutMethod,
};

