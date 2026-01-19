/**
 * Superlocked Content Service for Admin Panel
 * Handles all superlocked content-related API calls
 */

import { executeGraphQL } from '../config/graphqlClient';
import {
  GET_USERS_WITH_UNLOCK_CONTENT_QUERY,
} from '../queries';
import {
  UsersWithUnlockContentResponse,
} from '../types';

/**
 * Get Users with Unlock Content
 */
export interface GetUsersWithUnlockContentParams {
  limit: number;
  offset: number;
  agencyId?: string;
}

export const getUsersWithUnlockContent = async (
  params: GetUsersWithUnlockContentParams
): Promise<UsersWithUnlockContentResponse['usersWithUnlockContent']> => {
  const response = await executeGraphQL<UsersWithUnlockContentResponse>({
    operationName: 'GetUsersWithUnlockContent',
    query: GET_USERS_WITH_UNLOCK_CONTENT_QUERY,
    variables: params,
  });

  return response.data.usersWithUnlockContent;
};

export default {
  getUsersWithUnlockContent,
};

