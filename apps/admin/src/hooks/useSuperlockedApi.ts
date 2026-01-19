/**
 * useSuperlockedApi Hook
 * Provides access to superlocked content API functions
 */

import { useApiCall } from './useApiCall';
import {
  getUsersWithUnlockContent,
  GetUsersWithUnlockContentParams,
} from '../api/services/superlockedService';
import {
  UsersWithUnlockContentResponse,
} from '../api/types';

export const useSuperlockedApi = () => {
  const fetchUsers = useApiCall<UsersWithUnlockContentResponse['usersWithUnlockContent'], [GetUsersWithUnlockContentParams]>(getUsersWithUnlockContent);

  return {
    fetchUsers,
  };
};

export type {
  GetUsersWithUnlockContentParams,
};

