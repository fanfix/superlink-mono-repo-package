/**
 * Custom Section Service
 * Handles all custom section-related API calls
 */

import { executeGraphQL } from '../config/graphqlClient';
import {
  CreateCustomSectionInput,
  UpdateCustomSectionInput,
  CreateCustomSectionLinkInput,
  UpdateCustomSectionLinkInput,
  AddCustomSectionResponse,
  UpdateCustomSectionResponse,
  RemoveCustomSectionResponse,
  AddCustomSectionLinkResponse,
  UpdateCustomSectionLinkResponse,
  RemoveCustomSectionLinkResponse,
  ReorderCustomSectionsResponse,
  createApiError,
} from '../types';
import {
  ADD_CUSTOM_SECTION_MUTATION,
  UPDATE_CUSTOM_SECTION_MUTATION,
  REMOVE_CUSTOM_SECTION_MUTATION,
  REORDER_CUSTOM_SECTIONS_MUTATION,
  ADD_CUSTOM_SECTION_LINK_MUTATION,
  UPDATE_CUSTOM_SECTION_LINK_MUTATION,
  REMOVE_CUSTOM_SECTION_LINK_MUTATION,
} from '../queries';

/**
 * Add Custom Section
 */
export const addCustomSectionApi = async (
  createCustomSectionInput: CreateCustomSectionInput
): Promise<AddCustomSectionResponse> => {
  try {
    const response = await executeGraphQL<{ addCustomSection: AddCustomSectionResponse }>({
      operationName: 'AddCustomSection',
      query: ADD_CUSTOM_SECTION_MUTATION,
      variables: { createCustomSectionInput },
    });

    return response.data.addCustomSection;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Update Custom Section
 */
export const updateCustomSectionApi = async (
  customSectionId: string,
  updateCustomSectionInput: UpdateCustomSectionInput
): Promise<UpdateCustomSectionResponse> => {
  try {
    const response = await executeGraphQL<{ updateCustomSection: UpdateCustomSectionResponse }>({
      operationName: 'UpdateCustomSection',
      query: UPDATE_CUSTOM_SECTION_MUTATION,
      variables: { customSectionId, updateCustomSectionInput },
    });

    return response.data.updateCustomSection;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Remove Custom Section
 */
export const removeCustomSectionApi = async (
  customSectionId: string
): Promise<RemoveCustomSectionResponse> => {
  try {
    const response = await executeGraphQL<{ removeCustomSection: RemoveCustomSectionResponse }>({
      operationName: 'RemoveCustomSection',
      query: REMOVE_CUSTOM_SECTION_MUTATION,
      variables: { customSectionId },
    });

    return response.data.removeCustomSection;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Add Custom Section Link
 */
export const addCustomSectionLinkApi = async (
  customSectionId: string,
  createCustomSectionLinkInput: CreateCustomSectionLinkInput
): Promise<AddCustomSectionLinkResponse> => {
  try {
    const response = await executeGraphQL<{ addCustomSectionLink: AddCustomSectionLinkResponse }>({
      operationName: 'AddCustomSectionLink',
      query: ADD_CUSTOM_SECTION_LINK_MUTATION,
      variables: { customSectionId, createCustomSectionLinkInput },
    });

    return response.data.addCustomSectionLink;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Update Custom Section Link
 */
export const updateCustomSectionLinkApi = async (
  customSectionLinkId: string,
  updateCustomSectionLinkInput: UpdateCustomSectionLinkInput
): Promise<UpdateCustomSectionLinkResponse> => {
  try {
    const response = await executeGraphQL<{ updateCustomSectionLink: UpdateCustomSectionLinkResponse }>({
      operationName: 'UpdateCustomSectionLink',
      query: UPDATE_CUSTOM_SECTION_LINK_MUTATION,
      variables: { customSectionLinkId, updateCustomSectionLinkInput },
    });

    return response.data.updateCustomSectionLink;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Reorder Custom Sections
 */
export const reorderCustomSectionsApi = async (
  customSectionIds: string[]
): Promise<ReorderCustomSectionsResponse> => {
  try {
    const response = await executeGraphQL<{ reorderCustomSections: ReorderCustomSectionsResponse }>({
      operationName: 'ReorderCustomSections',
      query: REORDER_CUSTOM_SECTIONS_MUTATION,
      variables: { customSectionIds },
    });

    return response.data.reorderCustomSections;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Remove Custom Section Link
 */
export const removeCustomSectionLinkApi = async (
  customSectionLinkId: string
): Promise<RemoveCustomSectionLinkResponse> => {
  try {
    const response = await executeGraphQL<{ removeCustomSectionLink: RemoveCustomSectionLinkResponse }>({
      operationName: 'RemoveCustomSectionLink',
      query: REMOVE_CUSTOM_SECTION_LINK_MUTATION,
      variables: { customSectionLinkId },
    });

    return response.data.removeCustomSectionLink;
  } catch (error: any) {
    throw createApiError(error);
  }
};

export default {
  addCustomSectionApi,
  updateCustomSectionApi,
  removeCustomSectionApi,
  reorderCustomSectionsApi,
  addCustomSectionLinkApi,
  updateCustomSectionLinkApi,
  removeCustomSectionLinkApi,
};

