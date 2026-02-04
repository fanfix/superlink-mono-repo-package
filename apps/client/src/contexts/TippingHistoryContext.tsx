/**
 * Tipping History Context
 * Provides tipping history data through context
 * Clean architecture with hooks pattern
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useMyAccount } from './MyAccountContext';
import { getTippingHistoryApi } from '../api/services/paymentService';
import type { TippingHistoryItem } from '../api/types';

interface TippingHistoryGroup {
  timestamp: string;
  transactions: TippingHistoryItem[];
}

interface TippingHistoryContextValue {
  // Data
  tippingGroups: TippingHistoryGroup[];
  
  // Loading states
  loading: boolean;
  
  // Error states
  error: Error | null;
  
  // Actions
  refreshTippingHistory: () => Promise<void>;
  clearError: () => void;
}

const TippingHistoryContext = createContext<TippingHistoryContextValue | undefined>(undefined);

interface TippingHistoryProviderProps {
  children: ReactNode;
  /** Auto-fetch on mount */
  autoFetch?: boolean;
}

/**
 * Group tipping history by date
 */
const groupByDateFormat = (date: number | Date | string): string => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/**
 * Format date for display
 */
export const transactionDateFormat = (date: number | Date | string): string => {
  const d = new Date(date);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  
  // Add ordinal suffix
  const getOrdinal = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  
  return `${month} ${getOrdinal(day)} ${year}`;
};

/**
 * Tipping History Provider
 * Manages tipping history data and provides it through context
 */
export function TippingHistoryProvider({ children, autoFetch = true }: TippingHistoryProviderProps) {
  const { user } = useMyAccount();
  const [tippingGroups, setTippingGroups] = useState<TippingHistoryGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch tipping history
   */
  const refreshTippingHistory = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const transactions = await getTippingHistoryApi(user.id);
      
      // Group transactions by date
      const groups = Object.entries(
        transactions.reduce<Record<string, TippingHistoryItem[]>>((acc, curr) => {
          const key = groupByDateFormat(curr.createdAt);
          if (!acc[key]) acc[key] = [];
          acc[key].push(curr);
          return acc;
        }, {})
      ).map(([timestamp, transactions]) => ({ timestamp, transactions }));
      
      setTippingGroups(groups);
    } catch (err: any) {
      setError(err);
      setTippingGroups([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch on mount or when user becomes available
  useEffect(() => {
    if (autoFetch && user?.id) {
      refreshTippingHistory();
    }
  }, [autoFetch, user?.id, refreshTippingHistory]);

  // Also fetch when user changes (in case user loads after component mounts)
  useEffect(() => {
    if (user?.id && !loading && tippingGroups.length === 0) {
      refreshTippingHistory();
    }
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const value: TippingHistoryContextValue = {
    tippingGroups,
    loading,
    error,
    refreshTippingHistory,
    clearError,
  };

  return (
    <TippingHistoryContext.Provider value={value}>
      {children}
    </TippingHistoryContext.Provider>
  );
}

/**
 * Hook to access Tipping History context
 * @throws Error if used outside TippingHistoryProvider
 */
export function useTippingHistory(): TippingHistoryContextValue {
  const context = useContext(TippingHistoryContext);
  if (context === undefined) {
    throw new Error('useTippingHistory must be used within a TippingHistoryProvider');
  }
  return context;
}

export default TippingHistoryContext;

