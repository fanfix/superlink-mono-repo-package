/**
 * Manage Access Context
 * Provides manage access data and operations through context
 * Clean architecture with hooks pattern
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useMyAccount } from './MyAccountContext';
import {
  searchManageAccessApi,
  getAgencyStatusApi,
  inviteAgencyApi,
  revokeAgencyAccessApi,
} from '../api/services/manageAccessService';
import type { Agency, AgencyStatus, InviteAgencyInput, RevokeAgencyAccessInput } from '../api/types';

interface ManageAccessContextValue {
  // Data
  agencies: Agency[];
  invitedAgency: AgencyStatus | null;
  
  // Loading states
  loading: boolean;
  searching: boolean;
  inviting: boolean;
  revoking: boolean;
  
  // Error states
  error: Error | null;
  
  // Actions
  searchAgencies: (query: string) => Promise<void>;
  refreshAgencyStatus: () => Promise<void>;
  inviteAgency: (input: InviteAgencyInput) => Promise<void>;
  revokeAgencyAccess: (input: RevokeAgencyAccessInput) => Promise<void>;
  clearError: () => void;
  clearSearch: () => void;
}

const ManageAccessContext = createContext<ManageAccessContextValue | undefined>(undefined);

interface ManageAccessProviderProps {
  children: ReactNode;
  /** Auto-fetch agency status on mount */
  autoFetch?: boolean;
}

/**
 * Manage Access Provider
 * Manages agency access data and provides it through context
 */
export function ManageAccessProvider({ children, autoFetch = true }: ManageAccessProviderProps) {
  const { user } = useMyAccount();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [invitedAgency, setInvitedAgency] = useState<AgencyStatus | null>(null);
  const [searching, setSearching] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Search agencies
   */
  const searchAgencies = useCallback(async (query: string) => {
    if (!query.trim()) {
      setAgencies([]);
      return;
    }

    try {
      setSearching(true);
      setError(null);
      const results = await searchManageAccessApi(query);
      
      // Handle array or object response
      const agencyList = Array.isArray(results) ? results : (results.agencies || []);
      setAgencies(agencyList);
    } catch (err: any) {
      setError(err);
      setAgencies([]);
    } finally {
      setSearching(false);
    }
  }, []);

  /**
   * Get agency status (check if agency is invited/connected)
   */
  const refreshAgencyStatus = useCallback(async () => {
    if (!user?.bio?.id) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const status = await getAgencyStatusApi(user.bio.id);
      setInvitedAgency(status);
    } catch (err: any) {
      setError(err);
      setInvitedAgency(null);
    } finally {
      setLoading(false);
    }
  }, [user?.bio?.id]);

  /**
   * Invite agency
   */
  const inviteAgency = useCallback(async (input: InviteAgencyInput) => {
    if (!user?.bio?.id) {
      throw new Error('Bio not available');
    }

    try {
      setInviting(true);
      setError(null);
      await inviteAgencyApi({
        ...input,
        bioId: user.bio.id,
      });
      // Refresh agency status after invite
      await refreshAgencyStatus();
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setInviting(false);
    }
  }, [user?.bio?.id, refreshAgencyStatus]);

  /**
   * Revoke agency access
   */
  const revokeAgencyAccess = useCallback(async (input: RevokeAgencyAccessInput) => {
    if (!user?.bio?.id) {
      throw new Error('Bio not available');
    }

    try {
      setRevoking(true);
      setError(null);
      await revokeAgencyAccessApi({
        ...input,
        bioId: user.bio.id,
      });
      // Refresh agency status after revoke
      await refreshAgencyStatus();
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setRevoking(false);
    }
  }, [user?.bio?.id, refreshAgencyStatus]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Clear search results
   */
  const clearSearch = useCallback(() => {
    setAgencies([]);
  }, []);

  // Auto-fetch agency status on mount
  useEffect(() => {
    if (autoFetch && user?.bio?.id) {
      refreshAgencyStatus();
    }
  }, [autoFetch, user?.bio?.id, refreshAgencyStatus]);

  // Also fetch when user/bio changes (in case user loads after component mounts)
  useEffect(() => {
    if (user?.bio?.id && !loading && !invitedAgency) {
      refreshAgencyStatus();
    }
  }, [user?.bio?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const value: ManageAccessContextValue = {
    agencies,
    invitedAgency,
    loading,
    searching,
    inviting,
    revoking,
    error,
    searchAgencies,
    refreshAgencyStatus,
    inviteAgency,
    revokeAgencyAccess,
    clearError,
    clearSearch,
  };

  return (
    <ManageAccessContext.Provider value={value}>
      {children}
    </ManageAccessContext.Provider>
  );
}

/**
 * Hook to access Manage Access context
 * @throws Error if used outside ManageAccessProvider
 */
export function useManageAccess(): ManageAccessContextValue {
  const context = useContext(ManageAccessContext);
  if (context === undefined) {
    throw new Error('useManageAccess must be used within a ManageAccessProvider');
  }
  return context;
}

export default ManageAccessContext;

