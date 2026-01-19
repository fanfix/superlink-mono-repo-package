/**
 * Sendbird Service
 * Handles Sendbird messaging platform API calls
 */

import axios from 'axios';
import { getAuthToken } from '../../lib/auth';
import {
  ChannelInvitationPreference,
  SendbirdUserUpdate,
  SendbirdUserResponse,
  MyGroupChannelsResponse,
  GroupChannelCountResponse,
  createApiError,
} from '../types';

// Sendbird API base URL - This should be configured via environment variable
const SENDBIRD_API_BASE_URL = process.env.NEXT_PUBLIC_SENDBIRD_API_URL || 'https://api-5d92112b-10f5-4a77-b1a0-0095ad43ecf2.sendbird.com/v3';

/**
 * Create Sendbird client instance
 */
const sendbirdClient = axios.create({
  baseURL: SENDBIRD_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor - Add Sendbird API token
 * Note: Sendbird uses different authentication, adjust as needed
 */
sendbirdClient.interceptors.request.use(
  (config: any) => {
    const token = getAuthToken();
    
    if (token && config.headers) {
      // Adjust header name based on your Sendbird API requirements
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

/**
 * Update Channel Invitation Preference
 */
export const updateChannelInvitationPreferenceApi = async (
  userId: string,
  autoAccept: boolean
): Promise<ChannelInvitationPreference> => {
  try {
    const response = await sendbirdClient.put<ChannelInvitationPreference>(
      `/users/${userId}/channel_invitation_preference`,
      { auto_accept: autoAccept }
    );

    return response.data;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Update Sendbird User Detail
 */
export const updateSendbirdUserApi = async (
  userId: string,
  userData: SendbirdUserUpdate
): Promise<SendbirdUserUpdate> => {
  try {
    const response = await sendbirdClient.put<SendbirdUserUpdate>(
      `/users/${userId}`,
      userData
    );

    return response.data;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Get Sendbird User Detail
 */
export const getSendbirdUserApi = async (userId: string): Promise<SendbirdUserResponse> => {
  try {
    const response = await sendbirdClient.get<SendbirdUserResponse>(`/users/${userId}`);
    return response.data;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Get My Group Channels
 */
export const getMyGroupChannelsApi = async (
  userId: string,
  params?: {
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
  }
): Promise<MyGroupChannelsResponse> => {
  try {
    const response = await sendbirdClient.get<MyGroupChannelsResponse>(
      `/users/${userId}/my_group_channels`,
      { params }
    );
    return response.data;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Get Group Channel Count
 */
export const getGroupChannelCountApi = async (
  userId: string,
  state: string = 'all'
): Promise<GroupChannelCountResponse> => {
  try {
    const response = await sendbirdClient.get<GroupChannelCountResponse>(
      `/users/${userId}/group_channel_count`,
      { params: { state } }
    );
    return response.data;
  } catch (error: any) {
    throw createApiError(error);
  }
};

export default {
  updateChannelInvitationPreferenceApi,
  updateSendbirdUserApi,
  getSendbirdUserApi,
  getMyGroupChannelsApi,
  getGroupChannelCountApi,
};

