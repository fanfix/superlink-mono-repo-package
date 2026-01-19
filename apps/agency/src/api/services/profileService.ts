/**
 * Profile Service
 * Handles profile image upload and profile updates
 */

import restClient from '../config/restClient';
import { executeGraphQL } from '../config/graphqlClient';
import {
  AgencyProfile,
  UpdateAgencyInput,
  UpdateAgencyResponse,
  UpdateAgencyUserInput,
  UploadImageResponse,
} from '../types';
import { UPDATE_AGENCY_MUTATION, UPDATE_AGENCY_USER_MUTATION } from '../queries';

const PROFILE_ENDPOINTS = {
  UPLOAD: '/users/upload',
} as const;

/**
 * Upload profile picture
 */
export const uploadProfileImage = async (file: File): Promise<UploadImageResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await restClient.post<UploadImageResponse>(
    PROFILE_ENDPOINTS.UPLOAD,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};

/**
 * Update agency user profile details
 */
export const updateAgencyUser = async (
  input: UpdateAgencyUserInput
): Promise<AgencyProfile> => {
  const response = await executeGraphQL<{
    updateAgencyUser: AgencyProfile;
  }>({
    operationName: 'UpdateAgencyUser',
    query: UPDATE_AGENCY_USER_MUTATION,
    variables: {
      input,
    },
  });

  return response.data.updateAgencyUser;
};

/**
 * Update agency branding/settings
 */
export const updateAgency = async (
  input: UpdateAgencyInput
): Promise<UpdateAgencyResponse> => {
  const response = await executeGraphQL<{
    updateAgency: UpdateAgencyResponse;
  }>({
    operationName: 'UpdateAgency',
    query: UPDATE_AGENCY_MUTATION,
    variables: {
      input,
    },
  });

  return response.data.updateAgency;
};

export default {
  uploadProfileImage,
  updateAgencyUser,
  updateAgency,
};

