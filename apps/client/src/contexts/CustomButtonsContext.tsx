'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useMyAccount } from './MyAccountContext';
import {
  addCustomButtonApi,
  updateCustomButtonApi,
  updateFavoriteCustomButtonApi,
  removeCustomButtonApi,
} from '../api/services';
import type {
  CreateCustomButtonInput,
  UpdateCustomButtonInput,
  AddCustomButtonResponse,
  UpdateCustomButtonResponse,
  UpdateFavoriteCustomButtonResponse,
  RemoveCustomButtonResponse,
} from '../api/types';

interface CustomButtonsContextValue {
  adding: boolean;
  updating: boolean;
  togglingFavorite: boolean;
  removing: boolean;
  error: Error | null;
  addCustomButton: (input: CreateCustomButtonInput) => Promise<AddCustomButtonResponse>;
  updateCustomButton: (customButtonId: string, input: UpdateCustomButtonInput) => Promise<UpdateCustomButtonResponse>;
  updateFavoriteCustomButton: (customButtonId: string) => Promise<UpdateFavoriteCustomButtonResponse>;
  removeCustomButton: (customButtonId: string) => Promise<RemoveCustomButtonResponse>;
  clearError: () => void;
}

const CustomButtonsContext = createContext<CustomButtonsContextValue | undefined>(undefined);

interface CustomButtonsProviderProps {
  children: ReactNode;
}

export function CustomButtonsProvider({ children }: CustomButtonsProviderProps) {
  const { refreshUser } = useMyAccount();
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [togglingFavorite, setTogglingFavorite] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addCustomButton = useCallback(async (input: CreateCustomButtonInput): Promise<AddCustomButtonResponse> => {
    try {
      setAdding(true);
      setError(null);
      const response = await addCustomButtonApi(input);
      await refreshUser();
      return response;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setAdding(false);
    }
  }, [refreshUser]);

  const updateCustomButton = useCallback(async (
    customButtonId: string,
    input: UpdateCustomButtonInput
  ): Promise<UpdateCustomButtonResponse> => {
    try {
      setUpdating(true);
      setError(null);
      const response = await updateCustomButtonApi(customButtonId, input);
      await refreshUser();
      return response;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setUpdating(false);
    }
  }, [refreshUser]);

  const updateFavoriteCustomButton = useCallback(async (
    customButtonId: string
  ): Promise<UpdateFavoriteCustomButtonResponse> => {
    try {
      setTogglingFavorite(true);
      setError(null);
      const response = await updateFavoriteCustomButtonApi(customButtonId);
      await refreshUser();
      return response;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setTogglingFavorite(false);
    }
  }, [refreshUser]);

  const removeCustomButton = useCallback(async (
    customButtonId: string
  ): Promise<RemoveCustomButtonResponse> => {
    try {
      setRemoving(true);
      setError(null);
      const response = await removeCustomButtonApi(customButtonId);
      // Don't refresh user - let the component handle state update
      return response;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setRemoving(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: CustomButtonsContextValue = {
    adding,
    updating,
    togglingFavorite,
    removing,
    error,
    addCustomButton,
    updateCustomButton,
    updateFavoriteCustomButton,
    removeCustomButton,
    clearError,
  };

  return (
    <CustomButtonsContext.Provider value={value}>
      {children}
    </CustomButtonsContext.Provider>
  );
}

export function useCustomButtons(): CustomButtonsContextValue {
  const context = useContext(CustomButtonsContext);
  if (context === undefined) {
    throw new Error('useCustomButtons must be used within a CustomButtonsProvider');
  }
  return context;
}

export default CustomButtonsContext;
