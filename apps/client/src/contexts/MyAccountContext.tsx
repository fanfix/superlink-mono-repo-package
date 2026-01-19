/**
 * My Account Context
 * Provides account data and operations through context
 * Clean architecture with hooks pattern
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { decryptProfileApi } from '../api/services/profileSettingsService';
import { updateBioApi, updateUserApi } from '../api/services/profileService';
import { useAuth } from './AuthContext';
import type { CurrentUser, UpdateUserInput, UpdateUserResponse, UpdateBioInput, UpdateBioResponse, DecryptProfileResponse } from '../api/types';

interface MyAccountContextValue {
  // Data
  user: CurrentUser | null;
  decryptedData: DecryptProfileResponse | null;
  
  // Loading states
  loading: boolean;
  updating: boolean;
  decrypting: boolean;
  
  // Error states
  error: Error | null;
  
  // Actions
  refreshUser: () => Promise<void>;
  updateUser: (input: UpdateUserInput) => Promise<void>;
  updateBio: (bioId: string, input: UpdateBioInput) => Promise<UpdateBioResponse>;
  decryptUserData: () => Promise<void>;
  clearError: () => void;
}

const MyAccountContext = createContext<MyAccountContextValue | undefined>(undefined);

interface MyAccountProviderProps {
  children: ReactNode;
  /** Auto-fetch user on mount */
  autoFetch?: boolean;
}

/**
 * My Account Provider
 * Manages account data and provides it through context
 */
export function MyAccountProvider({ children, autoFetch = true }: MyAccountProviderProps) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [decryptedData, setDecryptedData] = useState<DecryptProfileResponse | null>(null);
  const [decrypting, setDecrypting] = useState(false);
  const [updatingUser, setUpdatingUser] = useState(false);
  const [updatingBio, setUpdatingBio] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const { currentUser, refreshAuth } = useAuth();

  const loading = updatingUser || updatingBio;

  /**
   * Refresh user data (uses global auth context)
   */
  const refreshUser = useCallback(async () => {
    // Use global auth context instead of calling API again
    await refreshAuth();
  }, [refreshAuth]);

  /**
   * Decrypt user email and phone number
   */
  const decryptUserData = useCallback(async () => {
    if (!user?.email || !user?.phoneNumber) {
      return;
    }

    try {
      setDecrypting(true);
      const decrypted = await decryptProfileApi({
        email: user.email,
        phoneNumber: user.phoneNumber,
      });
      setDecryptedData(decrypted);
    } catch (err) {
      console.error('Failed to decrypt user data:', err);
      // Silently fail - decryption is optional
    } finally {
      setDecrypting(false);
    }
  }, [user]);

  const updateUser = useCallback(async (input: UpdateUserInput) => {
    try {
      setUpdatingUser(true);
      setError(null);
      const updatedUser = await updateUserApi(input);
      if (updatedUser) {
        setUser((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            name: updatedUser.name ?? prev.name,
            email: updatedUser.email ?? prev.email,
            phoneNumber: updatedUser.phoneNumber ?? prev.phoneNumber,
            dateOfBirth: updatedUser.dateOfBirth ?? prev.dateOfBirth,
          };
        });
        await refreshUser();
      }
    } catch (err: any) {
      console.error('Failed to update user:', err);
      setError(err);
      throw err;
    } finally {
      setUpdatingUser(false);
    }
  }, [refreshUser]);

  const updateBio = useCallback(async (bioId: string, input: UpdateBioInput): Promise<UpdateBioResponse> => {
    try {
      setUpdatingBio(true);
      setError(null);
      const response = await updateBioApi(bioId, input);
      await refreshUser();
      return response;
    } catch (err: any) {
      console.error('Failed to update bio:', err);
      setError(err);
      throw err;
    } finally {
      setUpdatingBio(false);
    }
  }, [refreshUser]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Use currentUser from global auth context (prevents duplicate API calls)
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    }
  }, [currentUser]);

  // Auto-decrypt when user data is available
  useEffect(() => {
    if (user && !decryptedData && !decrypting) {
      decryptUserData();
    }
  }, [user, decryptedData, decrypting, decryptUserData]);

  const value: MyAccountContextValue = {
    user,
    decryptedData,
    loading,
    updating: updatingUser || updatingBio,
    decrypting,
    error,
    refreshUser,
    updateUser,
    updateBio,
    decryptUserData,
    clearError,
  };

  return (
    <MyAccountContext.Provider value={value}>
      {children}
    </MyAccountContext.Provider>
  );
}

/**
 * Hook to access My Account context
 * @throws Error if used outside MyAccountProvider
 */
export function useMyAccount(): MyAccountContextValue {
  const context = useContext(MyAccountContext);
  if (context === undefined) {
    throw new Error('useMyAccount must be used within a MyAccountProvider');
  }
  return context;
}

export default MyAccountContext;

