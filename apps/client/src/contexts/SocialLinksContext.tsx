'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useMyAccount } from './MyAccountContext';
import {
  addSocialLinkApi,
  updateSocialLinkApi,
  removeSocialLinkApi,
} from '../api/services/profileService';
import type {
  CreateSocialLinkInput,
  UpdateSocialLinkInput,
  AddSocialLinkResponse,
  UpdateSocialLinkResponse,
  RemoveSocialLinkResponse,
} from '../api/types';

interface SocialLinksContextValue {
  adding: boolean;
  updating: boolean;
  removing: boolean;
  error: Error | null;
  addSocialLink: (input: CreateSocialLinkInput) => Promise<AddSocialLinkResponse>;
  updateSocialLink: (socialLinkId: string, input: UpdateSocialLinkInput) => Promise<UpdateSocialLinkResponse>;
  removeSocialLink: (socialLinkId: string) => Promise<RemoveSocialLinkResponse>;
  clearError: () => void;
}

const SocialLinksContext = createContext<SocialLinksContextValue | undefined>(undefined);

interface SocialLinksProviderProps {
  children: ReactNode;
}

export function SocialLinksProvider({ children }: SocialLinksProviderProps) {
  const { refreshUser } = useMyAccount();
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addSocialLink = useCallback(async (input: CreateSocialLinkInput): Promise<AddSocialLinkResponse> => {
    try {
      setAdding(true);
      setError(null);
      const response = await addSocialLinkApi(input);
      await refreshUser();
      return response;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setAdding(false);
    }
  }, [refreshUser]);

  const updateSocialLink = useCallback(async (
    socialLinkId: string,
    input: UpdateSocialLinkInput
  ): Promise<UpdateSocialLinkResponse> => {
    try {
      setUpdating(true);
      setError(null);
      const response = await updateSocialLinkApi(socialLinkId, input);
      await refreshUser();
      return response;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setUpdating(false);
    }
  }, [refreshUser]);

  const removeSocialLink = useCallback(async (socialLinkId: string): Promise<RemoveSocialLinkResponse> => {
    try {
      setRemoving(true);
      setError(null);
      const response = await removeSocialLinkApi(socialLinkId);
      await refreshUser();
      return response;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setRemoving(false);
    }
  }, [refreshUser]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: SocialLinksContextValue = {
    adding,
    updating,
    removing,
    error,
    addSocialLink,
    updateSocialLink,
    removeSocialLink,
    clearError,
  };

  return (
    <SocialLinksContext.Provider value={value}>
      {children}
    </SocialLinksContext.Provider>
  );
}

export function useSocialLinks(): SocialLinksContextValue {
  const context = useContext(SocialLinksContext);
  if (context === undefined) {
    throw new Error('useSocialLinks must be used within a SocialLinksProvider');
  }
  return context;
}

export default SocialLinksContext;
