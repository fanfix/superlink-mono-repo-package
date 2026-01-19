/**
 * Custom Button Service
 * Handles all custom button-related API calls
 */

import { executeGraphQL } from '../config/graphqlClient';
import {
  CreateCustomButtonInput,
  UpdateCustomButtonInput,
  AddCustomButtonResponse,
  UpdateCustomButtonResponse,
  UpdateFavoriteCustomButtonResponse,
  RemoveCustomButtonResponse,
  createApiError,
} from '../types';
import {
  ADD_CUSTOM_BUTTON_MUTATION,
  UPDATE_CUSTOM_BUTTON_MUTATION,
  UPDATE_FAVORITE_CUSTOM_BUTTON_MUTATION,
  REMOVE_CUSTOM_BUTTON_MUTATION,
} from '../queries';

/**
 * Add Custom Button
 */
export async function addCustomButtonApi(
  createCustomButtonInput: CreateCustomButtonInput
): Promise<AddCustomButtonResponse> {
  try {
    const response = await executeGraphQL<{ addCustomButton: AddCustomButtonResponse }>({
      operationName: 'AddCustomButton',
      query: ADD_CUSTOM_BUTTON_MUTATION,
      variables: { createCustomButtonInput },
    });

    return response.data.addCustomButton;
  } catch (error: any) {
    throw createApiError(error);
  }
}

/**
 * Update Custom Button
 */
export async function updateCustomButtonApi(
  customButtonId: string,
  updateCustomButtonInput: UpdateCustomButtonInput
): Promise<UpdateCustomButtonResponse> {
  try {
    const response = await executeGraphQL<{ updateCustomButton: UpdateCustomButtonResponse }>({
      operationName: 'UpdateCustomButton',
      query: UPDATE_CUSTOM_BUTTON_MUTATION,
      variables: { customButtonId, updateCustomButtonInput },
    });

    return response.data.updateCustomButton;
  } catch (error: any) {
    throw createApiError(error);
  }
}

/**
 * Update Favorite Custom Button
 */
export async function updateFavoriteCustomButtonApi(
  customButtonId: string
): Promise<UpdateFavoriteCustomButtonResponse> {
  try {
    const response = await executeGraphQL<{ updateFavoriteCustomButton: UpdateFavoriteCustomButtonResponse }>({
      operationName: 'UpdateFavoriteCustomButton',
      query: UPDATE_FAVORITE_CUSTOM_BUTTON_MUTATION,
      variables: { customButtonId },
    });

    return response.data.updateFavoriteCustomButton;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Remove Custom Button
 */
export async function removeCustomButtonApi(
  customButtonId: string
): Promise<RemoveCustomButtonResponse> {
  try {
    const response = await executeGraphQL<{ removeCustomButton: RemoveCustomButtonResponse }>({
      operationName: 'RemoveCustomButton',
      query: REMOVE_CUSTOM_BUTTON_MUTATION,
      variables: { customButtonId },
    });

    return response.data.removeCustomButton;
  } catch (error: any) {
    throw createApiError(error);
  }
}

export default {
  addCustomButtonApi,
  updateCustomButtonApi,
  updateFavoriteCustomButtonApi,
  removeCustomButtonApi,
};

