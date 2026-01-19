/**
 * Brand Kit API Hooks
 * Hooks that use BrandKitContext for brand kit operations
 * Context manages state and API calls, hooks provide easy access
 */

import { useBrandKit } from '../contexts/BrandKitContext';
import type {
  CreateBrandKitDto,
  UpdateBrandKitDto,
  CreateEngagementDto,
  UpdateEngagementDto,
  CreateKitItemsDto,
  UpdateKitItemsDto,
} from '../api/types';

/**
 * Hook for create brand kit
 * Uses BrandKitContext - data flows: Context -> Hook -> Component
 */
export const useCreateBrandKit = () => {
  const { createBrandKit, creating, error } = useBrandKit();
  
  return {
    execute: createBrandKit,
    loading: creating,
    error,
  };
};

/**
 * Hook for update brand kit
 * Uses BrandKitContext - data flows: Context -> Hook -> Component
 */
export const useUpdateBrandKit = () => {
  const { updateBrandKit, updating, error } = useBrandKit();
  
  return {
    execute: updateBrandKit,
    loading: updating,
    error,
  };
};

/**
 * Hook for delete brand kit
 * Uses BrandKitContext - data flows: Context -> Hook -> Component
 */
export const useDeleteBrandKit = () => {
  const { deleteBrandKit, deleting, error } = useBrandKit();
  
  return {
    execute: deleteBrandKit,
    loading: deleting,
    error,
  };
};

/**
 * Hook for create engagement
 * Uses BrandKitContext - data flows: Context -> Hook -> Component
 */
export const useCreateEngagement = () => {
  const { createEngagement, creatingEngagement, error } = useBrandKit();
  
  return {
    execute: createEngagement,
    loading: creatingEngagement,
    error,
  };
};

/**
 * Hook for update engagement
 * Uses BrandKitContext - data flows: Context -> Hook -> Component
 */
export const useUpdateEngagement = () => {
  const { updateEngagement, updatingEngagement, error } = useBrandKit();
  
  return {
    execute: updateEngagement,
    loading: updatingEngagement,
    error,
  };
};

/**
 * Hook for delete engagement
 * Uses BrandKitContext - data flows: Context -> Hook -> Component
 */
export const useDeleteEngagement = () => {
  const { deleteEngagement, deletingEngagement, error } = useBrandKit();
  
  return {
    execute: deleteEngagement,
    loading: deletingEngagement,
    error,
  };
};

/**
 * Hook for create brand kit item
 * Uses BrandKitContext - data flows: Context -> Hook -> Component
 */
export const useCreateBrandKitItem = () => {
  const { createBrandKitItem, creatingItem, error } = useBrandKit();
  
  return {
    execute: createBrandKitItem,
    loading: creatingItem,
    error,
  };
};

/**
 * Hook for update brand kit item
 * Uses BrandKitContext - data flows: Context -> Hook -> Component
 */
export const useUpdateBrandKitItem = () => {
  const { updateBrandKitItem, updatingItem, error } = useBrandKit();
  
  return {
    execute: updateBrandKitItem,
    loading: updatingItem,
    error,
  };
};

/**
 * Hook for delete brand kit item
 * Uses BrandKitContext - data flows: Context -> Hook -> Component
 */
export const useDeleteBrandKitItem = () => {
  const { deleteBrandKitItem, deletingItem, error } = useBrandKit();
  
  return {
    execute: deleteBrandKitItem,
    loading: deletingItem,
    error,
  };
};

