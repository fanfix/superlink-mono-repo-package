/**
 * Payment Service
 * Handles payment-related API calls
 */

import restClient from '../config/restClient';
import { executeGraphQL } from '../config/graphqlClient';
import { PRICE_CHANGE_MUTATION } from '../queries';
import { createApiError, PriceChangeResponse } from '../types';

/**
 * Get Stripe Connect URL (to connect Stripe account)
 */
export const getStripeConnectApi = async (): Promise<{ url: string; transferAllowed: boolean }> => {
  try {
    const response = await restClient.get<{ url: string; transferAllowed: boolean }>(
      '/payments/stripe-connect'
    );
    return response.data;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Get Stripe Connect Status (payment method info)
 */
export interface StripeConnectStatus {
  name: string | null;
  id: string;
  transferAllowed: boolean;
  last4: string;
  isAgencyStripeAccount: boolean;
  isAgencyConnected: boolean;
  payoutMethod: 'agency_payout' | 'individual_payout';
}

export const getStripeConnectStatusApi = async (): Promise<StripeConnectStatus | null> => {
  try {
    const response = await restClient.get<StripeConnectStatus>(
      '/payments/stripe-connect-status'
    );
    return response.data;
  } catch (error: any) {
    // If no stripe account connected, return null
    if (error.response?.status === 404) {
      return null;
    }
    throw createApiError(error);
  }
};

/**
 * Price Change Mutation
 */
export interface PriceChangeInput {
  price: number;
}

export const priceChangeApi = async (price: number): Promise<PriceChangeResponse> => {
  try {
    const response = await executeGraphQL<{ priceChange: PriceChangeResponse }>({
      operationName: 'PriceChange',
      query: PRICE_CHANGE_MUTATION,
      variables: { price },
    });

    return response.data.priceChange;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Get Tipping History
 */
export interface TippingHistoryItem {
  amount: number;
  createdAt: string;
  sender: {
    name: string;
  } | null;
}

export const getTippingHistoryApi = async (userId: string): Promise<TippingHistoryItem[]> => {
  try {
    const response = await restClient.get<TippingHistoryItem[]>(
      `/payments/transactions/tipping/${userId}`
    );
    return response.data;
  } catch (error: any) {
    // If no tips, return empty array
    if (error.response?.status === 404) {
      return [];
    }
    throw createApiError(error);
  }
};

export default {
  getStripeConnectApi,
  getStripeConnectStatusApi,
  priceChangeApi,
  getTippingHistoryApi,
};

