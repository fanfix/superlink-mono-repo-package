/**
 * Brand Kit Context
 * Provides brand kit data and operations through context
 * Clean architecture with hooks pattern - Context manages state and API calls
 */

'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useMyAccount } from './MyAccountContext';
import {
  createBrandKitApi,
  updateBrandKitApi,
  deleteBrandKitApi,
  createEngagementApi,
  updateEngagementApi,
  deleteEngagementApi,
  createBrandKitItemApi,
  updateBrandKitItemApi,
  deleteBrandKitItemApi,
} from '../api/services/brandKitService';
import type {
  CreateBrandKitDto,
  UpdateBrandKitDto,
  CreateEngagementDto,
  UpdateEngagementDto,
  CreateKitItemsDto,
  UpdateKitItemsDto,
  CreateBrandKitResponse,
  UpdateBrandKitResponse,
  DeleteBrandKitResponse,
  CreateEngagementResponse,
  UpdateEngagementResponse,
  DeleteEngagementResponse,
  CreateBrandKitItemResponse,
  UpdateBrandKitItemResponse,
  DeleteBrandKitItemResponse,
  BrandKit,
} from '../api/types';

interface BrandKitContextValue {
  // Data - Brand Kit is stored in user.bio.customSections[].brandKit
  // We derive it from user context to avoid duplicate state
  
  // Loading states
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  creatingEngagement: boolean;
  updatingEngagement: boolean;
  deletingEngagement: boolean;
  creatingItem: boolean;
  updatingItem: boolean;
  deletingItem: boolean;
  
  // Error states
  error: Error | null;
  
  // Actions - Brand Kit CRUD
  createBrandKit: (dto: CreateBrandKitDto) => Promise<CreateBrandKitResponse>;
  updateBrandKit: (brandKitId: string, dto: UpdateBrandKitDto) => Promise<UpdateBrandKitResponse>;
  deleteBrandKit: (brandKitId: string) => Promise<DeleteBrandKitResponse>;
  
  // Actions - Engagement CRUD
  createEngagement: (brandKitId: string, dto: CreateEngagementDto) => Promise<CreateEngagementResponse>;
  updateEngagement: (engagementId: string, dto: UpdateEngagementDto) => Promise<UpdateEngagementResponse>;
  deleteEngagement: (engagementId: string) => Promise<DeleteEngagementResponse>;
  
  // Actions - Brand Kit Item CRUD
  createBrandKitItem: (brandKitId: string, dto: CreateKitItemsDto) => Promise<CreateBrandKitItemResponse>;
  updateBrandKitItem: (brandKitItemId: string, dto: UpdateKitItemsDto) => Promise<UpdateBrandKitItemResponse>;
  deleteBrandKitItem: (brandKitItemId: string) => Promise<DeleteBrandKitItemResponse>;
  
  // Utility
  clearError: () => void;
  getBrandKitBySectionId: (sectionId: string) => BrandKit | null;
}

const BrandKitContext = createContext<BrandKitContextValue | undefined>(undefined);

interface BrandKitProviderProps {
  children: ReactNode;
}

/**
 * Brand Kit Provider
 * Manages brand kit operations and provides them through context
 * Data is derived from MyAccountContext to avoid duplicate state
 */
export function BrandKitProvider({ children }: BrandKitProviderProps) {
  const { user, refreshUser } = useMyAccount();
  
  // Loading states
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [creatingEngagement, setCreatingEngagement] = useState(false);
  const [updatingEngagement, setUpdatingEngagement] = useState(false);
  const [deletingEngagement, setDeletingEngagement] = useState(false);
  const [creatingItem, setCreatingItem] = useState(false);
  const [updatingItem, setUpdatingItem] = useState(false);
  const [deletingItem, setDeletingItem] = useState(false);
  
  // Error state
  const [error, setError] = useState<Error | null>(null);

  /**
   * Get brand kit by custom section ID
   */
  const getBrandKitBySectionId = useCallback((sectionId: string): BrandKit | null => {
    if (!user?.bio?.customSections) return null;
    
    const section = user.bio.customSections.find((s) => s.id === sectionId);
    return section?.brandKit || null;
  }, [user]);

  /**
   * Create Brand Kit
   */
  const createBrandKit = useCallback(async (dto: CreateBrandKitDto): Promise<CreateBrandKitResponse> => {
    try {
      setCreating(true);
      setError(null);
      const response = await createBrandKitApi(dto);
      // Refresh user data to get updated brand kit
      await refreshUser();
      return response;
    } catch (err: any) {
      console.error('Failed to create brand kit:', err);
      setError(err);
      throw err;
    } finally {
      setCreating(false);
    }
  }, [refreshUser]);

  /**
   * Update Brand Kit
   */
  const updateBrandKit = useCallback(async (
    brandKitId: string,
    dto: UpdateBrandKitDto
  ): Promise<UpdateBrandKitResponse> => {
    try {
      setUpdating(true);
      setError(null);
      const response = await updateBrandKitApi(brandKitId, dto);
      // Refresh user data to get updated brand kit
      await refreshUser();
      return response;
    } catch (err: any) {
      console.error('Failed to update brand kit:', err);
      setError(err);
      throw err;
    } finally {
      setUpdating(false);
    }
  }, [refreshUser]);

  /**
   * Delete Brand Kit
   */
  const deleteBrandKit = useCallback(async (brandKitId: string): Promise<DeleteBrandKitResponse> => {
    try {
      setDeleting(true);
      setError(null);
      const response = await deleteBrandKitApi(brandKitId);
      // Refresh user data to get updated state
      await refreshUser();
      return response;
    } catch (err: any) {
      console.error('Failed to delete brand kit:', err);
      setError(err);
      throw err;
    } finally {
      setDeleting(false);
    }
  }, [refreshUser]);

  /**
   * Create Engagement
   */
  const createEngagement = useCallback(async (
    brandKitId: string,
    dto: CreateEngagementDto
  ): Promise<CreateEngagementResponse> => {
    try {
      setCreatingEngagement(true);
      setError(null);
      const response = await createEngagementApi(brandKitId, dto);
      // Refresh user data to get updated engagements
      await refreshUser();
      return response;
    } catch (err: any) {
      console.error('Failed to create engagement:', err);
      setError(err);
      throw err;
    } finally {
      setCreatingEngagement(false);
    }
  }, [refreshUser]);

  /**
   * Update Engagement
   */
  const updateEngagement = useCallback(async (
    engagementId: string,
    dto: UpdateEngagementDto
  ): Promise<UpdateEngagementResponse> => {
    try {
      setUpdatingEngagement(true);
      setError(null);
      const response = await updateEngagementApi(engagementId, dto);
      // Refresh user data to get updated engagements
      await refreshUser();
      return response;
    } catch (err: any) {
      console.error('Failed to update engagement:', err);
      setError(err);
      throw err;
    } finally {
      setUpdatingEngagement(false);
    }
  }, [refreshUser]);

  /**
   * Delete Engagement
   */
  const deleteEngagement = useCallback(async (engagementId: string): Promise<DeleteEngagementResponse> => {
    try {
      setDeletingEngagement(true);
      setError(null);
      const response = await deleteEngagementApi(engagementId);
      // Refresh user data to get updated engagements
      await refreshUser();
      return response;
    } catch (err: any) {
      console.error('Failed to delete engagement:', err);
      setError(err);
      throw err;
    } finally {
      setDeletingEngagement(false);
    }
  }, [refreshUser]);

  /**
   * Create Brand Kit Item
   */
  const createBrandKitItem = useCallback(async (
    brandKitId: string,
    dto: CreateKitItemsDto
  ): Promise<CreateBrandKitItemResponse> => {
    try {
      setCreatingItem(true);
      setError(null);
      const response = await createBrandKitItemApi(brandKitId, dto);
      // Refresh user data to get updated kit items
      await refreshUser();
      return response;
    } catch (err: any) {
      console.error('Failed to create brand kit item:', err);
      setError(err);
      throw err;
    } finally {
      setCreatingItem(false);
    }
  }, [refreshUser]);

  /**
   * Update Brand Kit Item
   */
  const updateBrandKitItem = useCallback(async (
    brandKitItemId: string,
    dto: UpdateKitItemsDto
  ): Promise<UpdateBrandKitItemResponse> => {
    try {
      setUpdatingItem(true);
      setError(null);
      const response = await updateBrandKitItemApi(brandKitItemId, dto);
      // Refresh user data to get updated kit items
      await refreshUser();
      return response;
    } catch (err: any) {
      console.error('Failed to update brand kit item:', err);
      setError(err);
      throw err;
    } finally {
      setUpdatingItem(false);
    }
  }, [refreshUser]);

  /**
   * Delete Brand Kit Item
   */
  const deleteBrandKitItem = useCallback(async (
    brandKitItemId: string
  ): Promise<DeleteBrandKitItemResponse> => {
    try {
      setDeletingItem(true);
      setError(null);
      const response = await deleteBrandKitItemApi(brandKitItemId);
      // Refresh user data to get updated kit items
      await refreshUser();
      return response;
    } catch (err: any) {
      console.error('Failed to delete brand kit item:', err);
      setError(err);
      throw err;
    } finally {
      setDeletingItem(false);
    }
  }, [refreshUser]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: BrandKitContextValue = {
    creating,
    updating,
    deleting,
    creatingEngagement,
    updatingEngagement,
    deletingEngagement,
    creatingItem,
    updatingItem,
    deletingItem,
    error,
    createBrandKit,
    updateBrandKit,
    deleteBrandKit,
    createEngagement,
    updateEngagement,
    deleteEngagement,
    createBrandKitItem,
    updateBrandKitItem,
    deleteBrandKitItem,
    clearError,
    getBrandKitBySectionId,
  };

  return (
    <BrandKitContext.Provider value={value}>
      {children}
    </BrandKitContext.Provider>
  );
}

/**
 * Hook to access Brand Kit context
 * @throws Error if used outside BrandKitProvider
 */
export function useBrandKit(): BrandKitContextValue {
  const context = useContext(BrandKitContext);
  if (context === undefined) {
    throw new Error('useBrandKit must be used within a BrandKitProvider');
  }
  return context;
}

export default BrandKitContext;

