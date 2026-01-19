/**
 * Referral Service
 * Handles agency referral-related REST API calls
 */

import restClient from '../config/restClient';
import {
  ReferralLink,
  ReferralRevenue,
  ReferralEarnings,
  createApiError,
} from '../types';

const REFERRAL_ENDPOINTS = {
  LINK: '/agency/referral-link',
  REVENUE: (code: string) => `/agency/referral-revenue/daily/${code}`,
  EARNINGS: (code: string) => `/agency/referred/${code}`,
} as const;

const extractResponseData = <T>(payload: T | { data?: T } | null | undefined): T => {
  if (!payload) {
    throw new Error('Invalid referral API response');
  }

  if (typeof payload === 'object' && 'data' in (payload as Record<string, unknown>)) {
    const nested = (payload as { data?: T }).data;
    if (nested !== undefined) {
      return nested;
    }
  }

  return payload as T;
};

/**
 * Fetch referral link for the current agency
 */
export const getReferralLink = async (): Promise<ReferralLink> => {
  try {
    const response = await restClient.get<ReferralLink | { data: ReferralLink }>(
      REFERRAL_ENDPOINTS.LINK
    );
    return extractResponseData(response.data);
  } catch (error) {
    throw createApiError(error);
  }
};

export interface ReferralRevenueParams {
  code: string;
  startDate: string;
  endDate: string;
}

/**
 * Fetch referral revenue within a date range
 */
export const getReferralRevenue = async ({
  code,
  startDate,
  endDate,
}: ReferralRevenueParams): Promise<ReferralRevenue> => {
  try {
    const response = await restClient.get<ReferralRevenue | { data: ReferralRevenue }>(
      REFERRAL_ENDPOINTS.REVENUE(code),
      {
        params: {
          startDate,
          endDate,
        },
      }
    );

    return extractResponseData(response.data);
  } catch (error) {
    throw createApiError(error);
  }
};

export interface ReferralEarningsParams {
  code: string;
  startDate: string;
  endDate: string;
}

/**
 * Fetch referral earnings and referral list within a date range
 */
export const getReferralEarnings = async ({
  code,
  startDate,
  endDate,
}: ReferralEarningsParams): Promise<ReferralEarnings> => {
  try {
    const response = await restClient.get<ReferralEarnings | { data: ReferralEarnings }>(
      REFERRAL_ENDPOINTS.EARNINGS(code),
      {
        params: {
          startDate,
          endDate,
        },
      }
    );

    return extractResponseData(response.data);
  } catch (error) {
    throw createApiError(error);
  }
};

export default {
  getReferralLink,
  getReferralRevenue,
  getReferralEarnings,
};

