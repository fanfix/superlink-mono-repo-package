/**
 * Settings Service
 * Handles all settings-related API calls
 */

import { executeGraphQL } from '../config/graphqlClient';
import {
  NotificationSettings,
  PrivacySettings,
  UpdateSettingsInput,
  UpdateSettingsResponse,
  createApiError,
} from '../types';
import {
  GET_SETTINGS_QUERY,
  UPDATE_SETTINGS_MUTATION,
} from '../queries';

interface Settings {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  __typename?: string;
}

/**
 * Get Settings
 */
export const getSettingsApi = async (bioId: string): Promise<Settings> => {
  try {
    const response = await executeGraphQL<{ getSettings: Settings }>({
      operationName: 'GetSettings',
      query: GET_SETTINGS_QUERY,
      variables: { bioId },
    });

    return response.data.getSettings;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Update Settings
 */
export const updateSettingsApi = async (
  input: UpdateSettingsInput
): Promise<UpdateSettingsResponse> => {
  try {
    const response = await executeGraphQL<{ updateSettings: UpdateSettingsResponse }>({
      operationName: 'UpdateSettings',
      query: UPDATE_SETTINGS_MUTATION,
      variables: { input },
    });

    return response.data.updateSettings;
  } catch (error: any) {
    throw createApiError(error);
  }
};

export default {
  getSettingsApi,
  updateSettingsApi,
};

