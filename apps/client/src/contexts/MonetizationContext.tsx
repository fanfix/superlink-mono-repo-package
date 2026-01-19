/**
 * Monetization Context
 * Provides monetization data and operations through context
 * Clean architecture with hooks pattern
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useMyAccount } from './MyAccountContext';
import { useUpdateBio } from '../hooks/useProfileApi';
import { getStripeConnectApi, getStripeConnectStatusApi, priceChangeApi } from '../api/services/paymentService';
import type { StripeConnectStatus, UpdateBioInput, PriceChangeResponse } from '../api/types';

interface MonetizationContextValue {
  // Data
  paymentMethod: StripeConnectStatus | null;
  bio: {
    allowTipping: boolean;
    allowMessaging: boolean;
    perMessageCost: number;
    verificationStatus: string | null;
  } | null;
  
  // Loading states
  loading: boolean;
  updating: boolean;
  connectingStripe: boolean;
  
  // Error states
  error: Error | null;
  
  // Actions
  refreshPaymentMethod: () => Promise<void>;
  connectStripe: () => Promise<void>;
  updateTipping: (enabled: boolean) => Promise<void>;
  updateMessaging: (enabled: boolean) => Promise<void>;
  updateMessagePrice: (price: number) => Promise<void>;
  clearError: () => void;
}

const MonetizationContext = createContext<MonetizationContextValue | undefined>(undefined);

interface MonetizationProviderProps {
  children: ReactNode;
  /** Auto-fetch payment method on mount */
  autoFetch?: boolean;
}

/**
 * Monetization Provider
 * Manages monetization data and provides it through context
 */
export function MonetizationProvider({ children, autoFetch = true }: MonetizationProviderProps) {
  const { user, refreshUser } = useMyAccount();
  const { execute: updateBioApi, loading: bioUpdating } = useUpdateBio();
  
  const [paymentMethod, setPaymentMethod] = useState<StripeConnectStatus | null>(null);
  const [connectingStripe, setConnectingStripe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Get bio data from user
  const bio = user?.bio ? {
    allowTipping: user.bio.allowTipping ?? false,
    allowMessaging: user.bio.allowMessaging ?? false,
    perMessageCost: user.bio.perMessageCost ?? 0,
    verificationStatus: user.bio.verificationStatus ?? null,
  } : null;

  // Combined loading state
  const updating = bioUpdating;

  /**
   * Fetch payment method status
   */
  const refreshPaymentMethod = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const status = await getStripeConnectStatusApi();
      setPaymentMethod(status);
    } catch (err: any) {
      console.error('Failed to fetch payment method:', err);
      setError(err);
      setPaymentMethod(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Connect Stripe account
   */
  const connectStripe = useCallback(async () => {
    try {
      setConnectingStripe(true);
      setError(null);
      const { url, transferAllowed } = await getStripeConnectApi();
      
      if (url) {
        if (transferAllowed) {
          // If transfer is already allowed, open in new tab (like superlink-main)
          window.open(url, '_blank');
        } else {
          // Store redirect URL in sessionStorage before redirecting to Stripe
          // This will be used when Stripe redirects back
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('stripe_connect_redirect', '/creator/myPage');
          }
          // Redirect to stripe connect page (like superlink-main)
          window.location.href = url;
        }
      }
      
      // Refresh payment method after a delay to allow for redirect
      setTimeout(() => {
        refreshPaymentMethod();
      }, 1000);
    } catch (err: any) {
      console.error('Failed to connect Stripe:', err);
      setError(err);
      throw err;
    } finally {
      setConnectingStripe(false);
    }
  }, [refreshPaymentMethod]);

  /**
   * Update tipping setting
   */
  const updateTipping = useCallback(async (enabled: boolean) => {
    if (!user?.bio?.id) {
      throw new Error('Bio not available');
    }

    try {
      const updateBioInput: UpdateBioInput = {
        allowTipping: enabled,
      };
      await updateBioApi(user.bio.id, updateBioInput);
      // Refresh user data to get latest state
      await refreshUser();
    } catch (err: any) {
      console.error('Failed to update tipping:', err);
      setError(err);
      throw err;
    }
  }, [user?.bio?.id, updateBioApi, refreshUser]);

  /**
   * Update messaging setting
   */
  const updateMessaging = useCallback(async (enabled: boolean) => {
    if (!user?.bio?.id) {
      throw new Error('Bio not available');
    }

    try {
      const updateBioInput: UpdateBioInput = {
        allowMessaging: enabled,
      };
      await updateBioApi(user.bio.id, updateBioInput);
      // Refresh user data to get latest state
      await refreshUser();
    } catch (err: any) {
      console.error('Failed to update messaging:', err);
      setError(err);
      throw err;
    }
  }, [user?.bio?.id, updateBioApi, refreshUser]);

  /**
   * Update message price
   */
  const updateMessagePrice = useCallback(async (price: number) => {
    if (!paymentMethod?.transferAllowed) {
      throw new Error('Stripe account must be connected to update message price');
    }

    try {
      await priceChangeApi(price);
      // Refresh user data to get latest state
      await refreshUser();
    } catch (err: any) {
      console.error('Failed to update message price:', err);
      setError(err);
      throw err;
    }
  }, [paymentMethod?.transferAllowed, refreshUser]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch payment method on mount
  useEffect(() => {
    if (autoFetch) {
      refreshPaymentMethod();
    }
  }, [autoFetch, refreshPaymentMethod]);

  // Refresh payment method when user changes
  useEffect(() => {
    if (user) {
      refreshPaymentMethod();
    }
  }, [user, refreshPaymentMethod]);

  const value: MonetizationContextValue = {
    paymentMethod,
    bio,
    loading,
    updating,
    connectingStripe,
    error,
    refreshPaymentMethod,
    connectStripe,
    updateTipping,
    updateMessaging,
    updateMessagePrice,
    clearError,
  };

  return (
    <MonetizationContext.Provider value={value}>
      {children}
    </MonetizationContext.Provider>
  );
}

/**
 * Hook to access Monetization context
 * @throws Error if used outside MonetizationProvider
 */
export function useMonetization(): MonetizationContextValue {
  const context = useContext(MonetizationContext);
  if (context === undefined) {
    throw new Error('useMonetization must be used within a MonetizationProvider');
  }
  return context;
}

export default MonetizationContext;

