'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useMyAccount } from './MyAccountContext';
import {
  uploadExclusiveContentApi,
  updateExclusiveContentApi,
  deleteExclusiveContentApi,
} from '../api/services/uploadService';
import type {
  UploadExclusiveContentInput,
  UploadExclusiveContentResponse,
  UpdateExclusiveContentInput,
  UpdateExclusiveContentResponse,
  DeleteExclusiveContentResponse,
} from '../api/types';

interface ContentContextValue {
  uploading: boolean;
  updating: boolean;
  deleting: boolean;
  error: Error | null;
  uploadExclusiveContent: (bioId: string, input: UploadExclusiveContentInput) => Promise<UploadExclusiveContentResponse>;
  updateExclusiveContent: (bioId: string, contentId: string, input: UpdateExclusiveContentInput) => Promise<UpdateExclusiveContentResponse>;
  deleteExclusiveContent: (bioId: string, contentId: string) => Promise<DeleteExclusiveContentResponse>;
  clearError: () => void;
}

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

interface ContentProviderProps {
  children: ReactNode;
}

export function ContentProvider({ children }: ContentProviderProps) {
  const { refreshUser } = useMyAccount();
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadExclusiveContent = useCallback(async (
    bioId: string,
    input: UploadExclusiveContentInput
  ): Promise<UploadExclusiveContentResponse> => {
    try {
      setUploading(true);
      setError(null);
      const response = await uploadExclusiveContentApi(bioId, input);
      await refreshUser();
      return response;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setUploading(false);
    }
  }, [refreshUser]);

  const updateExclusiveContent = useCallback(async (
    bioId: string,
    contentId: string,
    input: UpdateExclusiveContentInput
  ): Promise<UpdateExclusiveContentResponse> => {
    try {
      setUpdating(true);
      setError(null);
      const response = await updateExclusiveContentApi(bioId, contentId, input);
      // Don't refresh user here to avoid page re-render - let the component handle state update
      return response;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setUpdating(false);
    }
  }, []);

  const deleteExclusiveContent = useCallback(async (
    bioId: string,
    contentId: string
  ): Promise<DeleteExclusiveContentResponse> => {
    try {
      setDeleting(true);
      setError(null);
      const response = await deleteExclusiveContentApi(bioId, contentId);
      // Don't refresh user here to avoid page re-render - let the component handle state update
      return response;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setDeleting(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: ContentContextValue = {
    uploading,
    updating,
    deleting,
    error,
    uploadExclusiveContent,
    updateExclusiveContent,
    deleteExclusiveContent,
    clearError,
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent(): ContentContextValue {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}

export default ContentContext;
