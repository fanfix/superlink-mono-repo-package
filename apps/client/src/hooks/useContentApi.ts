/**
 * Content API Hook
 * Custom hook for content-related API calls
 */

import { useApiCall } from './useApiCall';
import {
  getContentListApi,
  getContentDetailApi,
  createContentApi,
  updateContentApi,
  deleteContentApi,
} from '../api/services/contentService';
import type {
  Content,
  CreateContentInput,
  CreateContentResponse,
  UpdateContentInput,
  UpdateContentResponse,
  DeleteContentResponse,
  PaginationParams,
} from '../api/types';

/**
 * Hook for get content list API
 */
export const useGetContentList = () => {
  return useApiCall<Content[], [string, PaginationParams?]>(getContentListApi);
};

/**
 * Hook for get content detail API
 */
export const useGetContentDetail = () => {
  return useApiCall<Content, [string]>(getContentDetailApi);
};

/**
 * Hook for create content API
 */
export const useCreateContent = () => {
  return useApiCall<CreateContentResponse, [CreateContentInput]>(createContentApi);
};

/**
 * Hook for update content API
 */
export const useUpdateContent = () => {
  return useApiCall<UpdateContentResponse, [UpdateContentInput]>(updateContentApi);
};

/**
 * Hook for delete content API
 */
export const useDeleteContent = () => {
  return useApiCall<DeleteContentResponse, [string]>(deleteContentApi);
};

