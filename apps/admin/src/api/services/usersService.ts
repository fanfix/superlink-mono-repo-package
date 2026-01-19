/**
 * Users Service for Admin Panel
 * Handles all users-related API calls
 */

import { executeGraphQL } from '../config/graphqlClient';
import restClient from '../config/restClient';
import {
  USERS_FOR_ADMIN_QUERY,
  USER_ONE_FOR_ADMIN_QUERY,
  UPDATE_USER_FOR_ADMIN_MUTATION,
  REMOVE_USER_FOR_ADMIN_MUTATION,
} from '../queries';
import {
  UsersForAdminResponse,
  UserOneForAdminResponse,
  UpdateUserInputForAdmin,
  UpdateUserForAdminResponse,
  RemoveUserForAdminResponse,
  User,
} from '../types';

/**
 * Get Users for Admin
 */
export interface GetUsersParams {
  limit?: number;
  offset?: number;
  withDeleted?: boolean;
  where?: Record<string, any>;
  orderBy?: Record<string, any>;
}

export const getUsersForAdmin = async (
  params: GetUsersParams
): Promise<UsersForAdminResponse> => {
  const response = await executeGraphQL<UsersForAdminResponse>({
    operationName: 'UsersForAdmin',
    query: USERS_FOR_ADMIN_QUERY,
    variables: params,
  });

  return response.data;
};

/**
 * Get User One for Admin
 */
export interface GetUserOneParams {
  id: string;
  withDeleted?: boolean;
}

export const getUserOneForAdmin = async (
  params: GetUserOneParams
): Promise<UserOneForAdminResponse['userOneForAdmin']> => {
  const response = await executeGraphQL<UserOneForAdminResponse>({
    operationName: 'userOneForAdmin',
    query: USER_ONE_FOR_ADMIN_QUERY,
    variables: params,
  });

  return response.data.userOneForAdmin;
};

/**
 * Update User for Admin
 */
export interface UpdateUserParams {
  userId: string;
  updateUserInput: UpdateUserInputForAdmin;
}

export const updateUserForAdmin = async (
  params: UpdateUserParams
): Promise<UpdateUserForAdminResponse['updateUserForAdmin']> => {
  const response = await executeGraphQL<UpdateUserForAdminResponse>({
    operationName: 'UpdateUserForAdmin',
    query: UPDATE_USER_FOR_ADMIN_MUTATION,
    variables: params,
  });

  return response.data.updateUserForAdmin;
};

/**
 * Remove User for Admin
 */
export interface RemoveUserParams {
  userId: string;
}

export const removeUserForAdmin = async (
  params: RemoveUserParams
): Promise<RemoveUserForAdminResponse['removeUserForAdmin']> => {
  const response = await executeGraphQL<RemoveUserForAdminResponse>({
    operationName: 'RemoveUserForAdmin',
    query: REMOVE_USER_FOR_ADMIN_MUTATION,
    variables: params,
  });

  return response.data.removeUserForAdmin;
};

/**
 * Export Users to CSV
 */
export const exportUsersCSV = async (): Promise<Blob> => {
  const response = await restClient.get('/users/csv-export', {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Get User Accounts
 */
export const getUserAccounts = async (): Promise<any> => {
  const response = await restClient.get('/users/accounts');
  return response.data;
};

/**
 * Set Super Locked Enabled
 */
export interface SetSuperLockedEnabledParams {
  id: string;
  enabled: boolean;
}

export const setSuperLockedEnabled = async (
  params: SetSuperLockedEnabledParams
): Promise<any> => {
  const response = await restClient.post(
    `/users/admin/set-super-locked-enabled/${params.id}`,
    { enabled: params.enabled }
  );
  return response.data;
};

export default {
  getUsersForAdmin,
  getUserOneForAdmin,
  updateUserForAdmin,
  removeUserForAdmin,
  exportUsersCSV,
  getUserAccounts,
  setSuperLockedEnabled,
};

