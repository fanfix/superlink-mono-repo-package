/**
 * Brand Kit Service
 * Handles all brand kit-related API calls (engagements and kit items)
 */

import { executeGraphQL } from '../config/graphqlClient';
import {
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
  createApiError,
} from '../types';
import {
  CREATE_BRAND_KIT_MUTATION,
  UPDATE_BRAND_KIT_MUTATION,
  DELETE_BRAND_KIT_MUTATION,
  CREATE_ENGAGEMENT_MUTATION,
  UPDATE_ENGAGEMENT_MUTATION,
  DELETE_ENGAGEMENT_MUTATION,
  CREATE_BRAND_KIT_ITEM_MUTATION,
  UPDATE_BRAND_KIT_ITEM_MUTATION,
  DELETE_BRAND_KIT_ITEM_MUTATION,
} from '../queries';

/**
 * Create Brand Kit
 */
export const createBrandKitApi = async (
  createBrandKitDto: CreateBrandKitDto
): Promise<CreateBrandKitResponse> => {
  try {
    const response = await executeGraphQL<{ createBrandKit: CreateBrandKitResponse }>({
      operationName: 'CreateBrandKit',
      query: CREATE_BRAND_KIT_MUTATION,
      variables: { createBrandKitDto },
    });

    return response.data.createBrandKit;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Update Brand Kit
 */
export const updateBrandKitApi = async (
  brandKitId: string,
  updateBrandKitDto: UpdateBrandKitDto
): Promise<UpdateBrandKitResponse> => {
  try {
    const response = await executeGraphQL<{ updateBrandKit: UpdateBrandKitResponse }>({
      operationName: 'UpdateBrandKit',
      query: UPDATE_BRAND_KIT_MUTATION,
      variables: { brandKitId, updateBrandKitDto },
    });

    return response.data.updateBrandKit;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Delete Brand Kit
 */
export const deleteBrandKitApi = async (
  brandKitId: string
): Promise<DeleteBrandKitResponse> => {
  try {
    const response = await executeGraphQL<{ deleteBrandKit: DeleteBrandKitResponse }>({
      operationName: 'DeleteBrandKit',
      query: DELETE_BRAND_KIT_MUTATION,
      variables: { brandKitId },
    });

    return response.data.deleteBrandKit;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Create Engagement
 */
export const createEngagementApi = async (
  brandKitId: string,
  createEngagementDto: CreateEngagementDto
): Promise<CreateEngagementResponse> => {
  try {
    const response = await executeGraphQL<{ createEngagement: CreateEngagementResponse }>({
      operationName: 'CreateEngagement',
      query: CREATE_ENGAGEMENT_MUTATION,
      variables: { brandKitId, createEngagementDto },
    });

    return response.data.createEngagement;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Update Engagement
 */
export const updateEngagementApi = async (
  engagementId: string,
  updateEngagementDto: UpdateEngagementDto
): Promise<UpdateEngagementResponse> => {
  try {
    const response = await executeGraphQL<{ updateEngagement: UpdateEngagementResponse }>({
      operationName: 'UpdateEngagement',
      query: UPDATE_ENGAGEMENT_MUTATION,
      variables: { engagementId, updateEngagementDto },
    });

    return response.data.updateEngagement;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Delete Engagement
 */
export const deleteEngagementApi = async (engagementId: string): Promise<DeleteEngagementResponse> => {
  try {
    const response = await executeGraphQL<{ deleteEngagement: DeleteEngagementResponse }>({
      operationName: 'DeleteEngagement',
      query: DELETE_ENGAGEMENT_MUTATION,
      variables: { engagementId },
    });

    return response.data.deleteEngagement;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Create Brand Kit Item
 */
export const createBrandKitItemApi = async (
  brandKitId: string,
  createKitItemsDto: CreateKitItemsDto
): Promise<CreateBrandKitItemResponse> => {
  try {
    const response = await executeGraphQL<{ createBrandKitItem: CreateBrandKitItemResponse }>({
      operationName: 'CreateBrandKitItem',
      query: CREATE_BRAND_KIT_ITEM_MUTATION,
      variables: { brandKitId, createKitItemsDto },
    });

    return response.data.createBrandKitItem;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Update Brand Kit Item
 */
export const updateBrandKitItemApi = async (
  brandKitItemId: string,
  updateKitItemsDto: UpdateKitItemsDto
): Promise<UpdateBrandKitItemResponse> => {
  try {
    const response = await executeGraphQL<{ updateBrandKitItem: UpdateBrandKitItemResponse }>({
      operationName: 'UpdateBrandKitItem',
      query: UPDATE_BRAND_KIT_ITEM_MUTATION,
      variables: { brandKitItemId, updateKitItemsDto },
    });

    return response.data.updateBrandKitItem;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Delete Brand Kit Item
 */
export const deleteBrandKitItemApi = async (
  brandKitItemId: string
): Promise<DeleteBrandKitItemResponse> => {
  try {
    const response = await executeGraphQL<{ deleteBrandKitItem: DeleteBrandKitItemResponse }>({
      operationName: 'DeleteBrandKitItem',
      query: DELETE_BRAND_KIT_ITEM_MUTATION,
      variables: { brandKitItemId },
    });

    return response.data.deleteBrandKitItem;
  } catch (error: any) {
    throw createApiError(error);
  }
};

export default {
  createEngagementApi,
  updateEngagementApi,
  deleteEngagementApi,
  createBrandKitItemApi,
  updateBrandKitItemApi,
  deleteBrandKitItemApi,
};

