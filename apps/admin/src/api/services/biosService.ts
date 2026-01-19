/**
 * Bios Service for Admin Panel
 * Handles all bios-related API calls
 */

import { executeGraphQL } from '../config/graphqlClient';
import restClient from '../config/restClient';
import {
  FIND_ALL_BIOS_FOR_ADMIN_QUERY,
  FIND_ONE_BIO_FOR_ADMIN_QUERY,
  CREATE_BIO_MUTATION,
  UPDATE_BIO_ADMIN_MUTATION,
  REMOVE_BIO_MUTATION,
} from '../queries';
import {
  FindAllBiosForAdminResponse,
  FindOneBioForAdminResponse,
  CreateBioInput,
  CreateBioResponse,
  UpdateBioInputForAdmin,
  UpdateBioAdminResponse,
  RemoveBioResponse,
  Bio,
} from '../types';

/**
 * Get All Bios for Admin
 */
export interface GetBiosParams {
  limit?: number;
  offset?: number;
  withDeleted?: boolean;
  where?: Record<string, any>;
  orderBy?: Record<string, any>;
}

export const getAllBiosForAdmin = async (
  params: GetBiosParams
): Promise<FindAllBiosForAdminResponse> => {
  const response = await executeGraphQL<FindAllBiosForAdminResponse>({
    operationName: 'FindAllBiosForAdmin',
    query: FIND_ALL_BIOS_FOR_ADMIN_QUERY,
    variables: params,
  });

  return response.data;
};

/**
 * Get One Bio for Admin
 */
export interface GetBioOneParams {
  bioId: string;
  withDeleted?: boolean;
}

export const getOneBioForAdmin = async (
  params: GetBioOneParams
): Promise<FindOneBioForAdminResponse['findOneBioForAdmin']> => {
  const response = await executeGraphQL<FindOneBioForAdminResponse>({
    operationName: 'FindOneBioForAdmin',
    query: FIND_ONE_BIO_FOR_ADMIN_QUERY,
    variables: params,
  });

  return response.data.findOneBioForAdmin;
};

/**
 * Create Bio
 */
export interface CreateBioParams {
  createBioInput: CreateBioInput;
}

export const createBio = async (
  params: CreateBioParams
): Promise<CreateBioResponse['createBio']> => {
  const response = await executeGraphQL<CreateBioResponse>({
    operationName: 'CreateBio',
    query: CREATE_BIO_MUTATION,
    variables: params,
  });

  return response.data.createBio;
};

/**
 * Update Bio Admin
 */
export interface UpdateBioParams {
  bioId: string;
  updateBioInput: UpdateBioInputForAdmin;
}

export const updateBioAdmin = async (
  params: UpdateBioParams
): Promise<UpdateBioAdminResponse['updateBioAdmin']> => {
  const response = await executeGraphQL<UpdateBioAdminResponse>({
    operationName: 'UpdateBioAdmin',
    query: UPDATE_BIO_ADMIN_MUTATION,
    variables: params,
  });

  return response.data.updateBioAdmin;
};

/**
 * Remove Bio
 */
export interface RemoveBioParams {
  bioId: string;
}

export const removeBio = async (
  params: RemoveBioParams
): Promise<RemoveBioResponse['removeBio']> => {
  const response = await executeGraphQL<RemoveBioResponse>({
    operationName: 'RemoveBio',
    query: REMOVE_BIO_MUTATION,
    variables: params,
  });

  return response.data.removeBio;
};

/**
 * Import Followers
 */
export interface ImportFollowersParams {
  bioId: string;
  followers: any[];
}

export const importFollowers = async (
  params: ImportFollowersParams
): Promise<any> => {
  const response = await restClient.post('/bios/import-followers', params);
  return response.data;
};

export default {
  getAllBiosForAdmin,
  getOneBioForAdmin,
  createBio,
  updateBioAdmin,
  removeBio,
  importFollowers,
};

