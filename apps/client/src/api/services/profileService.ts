/**
 * Profile Service
 * Handles all profile/bio-related API calls
 */

import { executeGraphQL } from '../config/graphqlClient';
import {
  Bio,
  CurrentUser,
  PublicUser,
  UpdateProfileInput,
  UpdateProfileResponse,
  UpdateBioInput,
  UpdateBioResponse,
  UpdateUserInput,
  UpdateUserResponse,
  SocialLink,
  CreateSocialLinkInput,
  UpdateSocialLinkInput,
  AddSocialLinkResponse,
  UpdateSocialLinkResponse,
  RemoveSocialLinkResponse,
  createApiError,
} from '../types';
import {
  GET_PROFILE_QUERY,
  CURRENT_USER_QUERY,
  USER_QUERY,
  UPDATE_PROFILE_MUTATION,
  UPDATE_BIO_MUTATION,
  UPDATE_USER_MUTATION,
  ADD_SOCIAL_LINK_MUTATION,
  UPDATE_SOCIAL_LINK_MUTATION,
  REMOVE_SOCIAL_LINK_MUTATION,
  DELETE_SOCIAL_LINK_MUTATION,
} from '../queries';

/**
 * Get Current User
 */
export const getCurrentUserApi = async (): Promise<CurrentUser> => {
  try {
    const response = await executeGraphQL<{ currentUser: CurrentUser }>({
      operationName: 'CurrentUser',
      query: CURRENT_USER_QUERY,
      variables: {},
    });

    return response.data.currentUser;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Get Profile by Username
 */
export const getProfileApi = async (username: string): Promise<Bio> => {
  try {
    const response = await executeGraphQL<{ getProfile: Bio }>({
      operationName: 'GetProfile',
      query: GET_PROFILE_QUERY,
      variables: { username },
    });

    return response.data.getProfile;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Get Public User by usernameOrId (for public profile page)
 * Uses User query; returns full bio with customSections for rendering.
 */
export const getPublicUserApi = async (usernameOrId: string): Promise<PublicUser> => {
  try {
    const response = await executeGraphQL<{ user: PublicUser }>({
      operationName: 'User',
      query: USER_QUERY,
      variables: { usernameOrId },
    });

    return response.data.user;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Update Profile
 */
export const updateProfileApi = async (
  input: UpdateProfileInput
): Promise<UpdateProfileResponse> => {
  try {
    const response = await executeGraphQL<{ updateProfile: UpdateProfileResponse }>({
      operationName: 'UpdateProfile',
      query: UPDATE_PROFILE_MUTATION,
      variables: { input },
    });

    return response.data.updateProfile;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Update User
 */
export const updateUserApi = async (
  updateUserInput: UpdateUserInput
): Promise<UpdateUserResponse> => {
  try {
    const response = await executeGraphQL<{ updateUser: UpdateUserResponse }>({
      operationName: 'UpdateUser',
      query: UPDATE_USER_MUTATION,
      variables: { updateUserInput },
    });

    return response.data.updateUser;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Update Bio
 */
export const updateBioApi = async (
  bioId: string,
  updateBioInput: UpdateBioInput
): Promise<UpdateBioResponse> => {
  try {
    const response = await executeGraphQL<{ updateBio: UpdateBioResponse }>({
      operationName: 'UpdateBio',
      query: UPDATE_BIO_MUTATION,
      variables: { bioId, updateBioInput },
    });

    return response.data.updateBio;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Add Social Link
 */
export const addSocialLinkApi = async (
  createSocialLinkInput: CreateSocialLinkInput
): Promise<AddSocialLinkResponse> => {
  try {
    const response = await executeGraphQL<{ addSocialLink: AddSocialLinkResponse }>({
      operationName: 'AddSocialLink',
      query: ADD_SOCIAL_LINK_MUTATION,
      variables: { createSocialLinkInput },
    });

    return response.data.addSocialLink;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Update Social Link
 */
export const updateSocialLinkApi = async (
  socialLinkId: string,
  updateSocialLinkInput: UpdateSocialLinkInput
): Promise<UpdateSocialLinkResponse> => {
  try {
    const response = await executeGraphQL<{ updateSocialLink: UpdateSocialLinkResponse }>({
      operationName: 'UpdateSocialLink',
      query: UPDATE_SOCIAL_LINK_MUTATION,
      variables: { socialLinkId, updateSocialLinkInput },
    });

    return response.data.updateSocialLink;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Remove Social Link
 */
export const removeSocialLinkApi = async (socialLinkId: string): Promise<RemoveSocialLinkResponse> => {
  try {
    const response = await executeGraphQL<{ removeSocialLink: RemoveSocialLinkResponse }>({
      operationName: 'RemoveSocialLink',
      query: REMOVE_SOCIAL_LINK_MUTATION,
      variables: { socialLinkId },
    });

    return response.data.removeSocialLink;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Delete Social Link (alias for removeSocialLinkApi)
 */
export const deleteSocialLinkApi = async (socialLinkId: string): Promise<{ id: string }> => {
  try {
    const response = await executeGraphQL<{ deleteSocialLink: { id: string } }>({
      operationName: 'DeleteSocialLink',
      query: DELETE_SOCIAL_LINK_MUTATION,
      variables: { socialLinkId },
    });

    return response.data.deleteSocialLink;
  } catch (error: any) {
    throw createApiError(error);
  }
};

export default {
  getCurrentUserApi,
  getProfileApi,
  getPublicUserApi,
  updateProfileApi,
  updateUserApi,
  updateBioApi,
  addSocialLinkApi,
  updateSocialLinkApi,
  removeSocialLinkApi,
  deleteSocialLinkApi,
};

