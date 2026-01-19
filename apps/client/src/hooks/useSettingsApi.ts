/**
 * Settings API Hook
 * Custom hook for settings-related API calls
 */

import { useApiCall } from './useApiCall';
import {
  getSettingsApi,
  updateSettingsApi,
} from '../api/services/settingsService';
import type {
  NotificationSettings,
  PrivacySettings,
  UpdateSettingsInput,
  UpdateSettingsResponse,
} from '../api/types';

interface Settings {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  __typename?: string;
}

/**
 * Hook for get settings API
 */
export const useGetSettings = () => {
  return useApiCall<Settings, [string]>(getSettingsApi);
};

/**
 * Hook for update settings API
 */
export const useUpdateSettings = () => {
  return useApiCall<UpdateSettingsResponse, [UpdateSettingsInput]>(updateSettingsApi);
};

