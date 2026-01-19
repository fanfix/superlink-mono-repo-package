/**
 * Sendbird API Hook
 * Custom hook for Sendbird messaging platform API calls
 */

import { useApiCall } from './useApiCall';
import {
  updateChannelInvitationPreferenceApi,
  updateSendbirdUserApi,
  getSendbirdUserApi,
  getMyGroupChannelsApi,
  getGroupChannelCountApi,
} from '../api/services/sendbirdService';
import type {
  ChannelInvitationPreference,
  SendbirdUserUpdate,
  SendbirdUserResponse,
  MyGroupChannelsResponse,
  GroupChannelCountResponse,
} from '../api/types';

/**
 * Hook for update channel invitation preference API
 */
export const useUpdateChannelInvitationPreference = () => {
  return useApiCall<ChannelInvitationPreference, [string, boolean]>(
    updateChannelInvitationPreferenceApi
  );
};

/**
 * Hook for update sendbird user API
 */
export const useUpdateSendbirdUser = () => {
  return useApiCall<SendbirdUserUpdate, [string, SendbirdUserUpdate]>(
    updateSendbirdUserApi
  );
};

/**
 * Hook for get sendbird user API
 */
export const useGetSendbirdUser = () => {
  return useApiCall<SendbirdUserResponse, [string]>(getSendbirdUserApi);
};

/**
 * Hook for get my group channels API
 */
export const useGetMyGroupChannels = () => {
  return useApiCall<
    MyGroupChannelsResponse,
    [
      string,
      {
        token?: string;
        limit?: number;
        order?: string;
        show_member?: boolean;
        show_read_receipt?: boolean;
        show_delivery_receipt?: boolean;
        show_empty?: boolean;
        member_state_filter?: string;
        super_mode?: string;
        public_mode?: string;
        unread_filter?: string;
        name_contains?: string;
        hidden_mode?: string;
        show_frozen?: boolean;
      }?
    ]
  >(getMyGroupChannelsApi);
};

/**
 * Hook for get group channel count API
 */
export const useGetGroupChannelCount = () => {
  return useApiCall<GroupChannelCountResponse, [string, string?]>(getGroupChannelCountApi);
};

