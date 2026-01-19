/**
 * Content Service
 * Handles all content-related API calls
 */

import { executeGraphQL } from '../config/graphqlClient';
import {
  Content,
  CreateContentInput,
  CreateContentResponse,
  UpdateContentInput,
  UpdateContentResponse,
  DeleteContentResponse,
  PaginationParams,
  createApiError,
} from '../types';
import {
  GET_CONTENT_LIST_QUERY,
  GET_CONTENT_DETAIL_QUERY,
  CREATE_CONTENT_MUTATION,
  UPDATE_CONTENT_MUTATION,
  DELETE_CONTENT_MUTATION,
} from '../queries';

/**
 * Get Content List
 */
export const getContentListApi = async (
  bioId: string,
  pagination?: PaginationParams
): Promise<Content[]> => {
  try {
    const response = await executeGraphQL<{ getContentList: Content[] }>({
      operationName: 'GetContentList',
      query: GET_CONTENT_LIST_QUERY,
      variables: {
        bioId,
        limit: pagination?.limit || 20,
        offset: pagination?.offset || 0,
      },
    });

    return response.data.getContentList;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Get Content Detail
 */
export const getContentDetailApi = async (contentId: string): Promise<Content> => {
  try {
    const response = await executeGraphQL<{ getContentDetail: Content }>({
      operationName: 'GetContentDetail',
      query: GET_CONTENT_DETAIL_QUERY,
      variables: { contentId },
    });

    return response.data.getContentDetail;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Create Content
 */
export const createContentApi = async (
  input: CreateContentInput
): Promise<CreateContentResponse> => {
  try {
    const response = await executeGraphQL<{ createContent: CreateContentResponse }>({
      operationName: 'CreateContent',
      query: CREATE_CONTENT_MUTATION,
      variables: { input },
    });

    return response.data.createContent;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Update Content
 */
export const updateContentApi = async (
  input: UpdateContentInput
): Promise<UpdateContentResponse> => {
  try {
    const response = await executeGraphQL<{ updateContent: UpdateContentResponse }>({
      operationName: 'UpdateContent',
      query: UPDATE_CONTENT_MUTATION,
      variables: { input },
    });

    return response.data.updateContent;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Delete Content
 */
export const deleteContentApi = async (contentId: string): Promise<DeleteContentResponse> => {
  try {
    const response = await executeGraphQL<{ deleteContent: DeleteContentResponse }>({
      operationName: 'DeleteContent',
      query: DELETE_CONTENT_MUTATION,
      variables: { contentId },
    });

    return response.data.deleteContent;
  } catch (error: any) {
    throw createApiError(error);
  }
};

export default {
  getContentListApi,
  getContentDetailApi,
  createContentApi,
  updateContentApi,
  deleteContentApi,
};

