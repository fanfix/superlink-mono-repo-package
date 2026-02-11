'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useMyAccount } from './MyAccountContext';
import {
  addCustomSectionApi,
  updateCustomSectionApi,
  removeCustomSectionApi,
  reorderCustomSectionsApi,
  addCustomSectionLinkApi,
  updateCustomSectionLinkApi,
  removeCustomSectionLinkApi,
} from '../api/services/customSectionService';
import type {
  CreateCustomSectionInput,
  UpdateCustomSectionInput,
  CreateCustomSectionLinkInput,
  UpdateCustomSectionLinkInput,
  AddCustomSectionResponse,
  UpdateCustomSectionResponse,
  RemoveCustomSectionResponse,
  ReorderCustomSectionsResponse,
  AddCustomSectionLinkResponse,
  UpdateCustomSectionLinkResponse,
  RemoveCustomSectionLinkResponse,
} from '../api/types';

interface CustomSectionsContextValue {
  adding: boolean;
  updating: boolean;
  removing: boolean;
  reordering: boolean;
  addingLink: boolean;
  updatingLink: boolean;
  removingLink: boolean;
  error: Error | null;
  addCustomSection: (input: CreateCustomSectionInput) => Promise<AddCustomSectionResponse>;
  updateCustomSection: (customSectionId: string, input: UpdateCustomSectionInput) => Promise<UpdateCustomSectionResponse>;
  removeCustomSection: (customSectionId: string) => Promise<RemoveCustomSectionResponse>;
  reorderCustomSections: (customSectionIds: string[]) => Promise<ReorderCustomSectionsResponse>;
  addCustomSectionLink: (customSectionId: string, input: CreateCustomSectionLinkInput) => Promise<AddCustomSectionLinkResponse>;
  updateCustomSectionLink: (customSectionLinkId: string, input: UpdateCustomSectionLinkInput) => Promise<UpdateCustomSectionLinkResponse>;
  removeCustomSectionLink: (customSectionLinkId: string) => Promise<RemoveCustomSectionLinkResponse>;
  clearError: () => void;
}

const CustomSectionsContext = createContext<CustomSectionsContextValue | undefined>(undefined);

interface CustomSectionsProviderProps {
  children: ReactNode;
}

export function CustomSectionsProvider({ children }: CustomSectionsProviderProps) {
  const { refreshUser } = useMyAccount();
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [addingLink, setAddingLink] = useState(false);
  const [updatingLink, setUpdatingLink] = useState(false);
  const [removingLink, setRemovingLink] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addCustomSection = useCallback(async (input: CreateCustomSectionInput): Promise<AddCustomSectionResponse> => {
    try {
      setAdding(true);
      setError(null);
      const response = await addCustomSectionApi(input);
      await refreshUser();
      return response;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setAdding(false);
    }
  }, [refreshUser]);

  const updateCustomSection = useCallback(async (
    customSectionId: string,
    input: UpdateCustomSectionInput
  ): Promise<UpdateCustomSectionResponse> => {
    try {
      setUpdating(true);
      setError(null);
      const response = await updateCustomSectionApi(customSectionId, input);
      await refreshUser();
      return response;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setUpdating(false);
    }
  }, [refreshUser]);

  const removeCustomSection = useCallback(async (customSectionId: string): Promise<RemoveCustomSectionResponse> => {
    try {
      setRemoving(true);
      setError(null);
      const response = await removeCustomSectionApi(customSectionId);
      await refreshUser();
      return response;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setRemoving(false);
    }
  }, [refreshUser]);

  const reorderCustomSections = useCallback(async (customSectionIds: string[]): Promise<ReorderCustomSectionsResponse> => {
    try {
      setReordering(true);
      setError(null);
      const response = await reorderCustomSectionsApi(customSectionIds);
      await refreshUser();
      return response;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setReordering(false);
    }
  }, [refreshUser]);

  const addCustomSectionLink = useCallback(async (
    customSectionId: string,
    input: CreateCustomSectionLinkInput
  ): Promise<AddCustomSectionLinkResponse> => {
    try {
      setAddingLink(true);
      setError(null);
      const response = await addCustomSectionLinkApi(customSectionId, input);
      await refreshUser();
      return response;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setAddingLink(false);
    }
  }, [refreshUser]);

  const updateCustomSectionLink = useCallback(async (
    customSectionLinkId: string,
    input: UpdateCustomSectionLinkInput
  ): Promise<UpdateCustomSectionLinkResponse> => {
    try {
      setUpdatingLink(true);
      setError(null);
      const response = await updateCustomSectionLinkApi(customSectionLinkId, input);
      await refreshUser();
      return response;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setUpdatingLink(false);
    }
  }, [refreshUser]);

  const removeCustomSectionLink = useCallback(async (
    customSectionLinkId: string
  ): Promise<RemoveCustomSectionLinkResponse> => {
    try {
      setRemovingLink(true);
      setError(null);
      const response = await removeCustomSectionLinkApi(customSectionLinkId);
      await refreshUser();
      return response;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setRemovingLink(false);
    }
  }, [refreshUser]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: CustomSectionsContextValue = {
    adding,
    updating,
    removing,
    reordering,
    addingLink,
    updatingLink,
    removingLink,
    error,
    addCustomSection,
    updateCustomSection,
    removeCustomSection,
    reorderCustomSections,
    addCustomSectionLink,
    updateCustomSectionLink,
    removeCustomSectionLink,
    clearError,
  };

  return (
    <CustomSectionsContext.Provider value={value}>
      {children}
    </CustomSectionsContext.Provider>
  );
}

export function useCustomSections(): CustomSectionsContextValue {
  const context = useContext(CustomSectionsContext);
  if (context === undefined) {
    throw new Error('useCustomSections must be used within a CustomSectionsProvider');
  }
  return context;
}

export default CustomSectionsContext;
