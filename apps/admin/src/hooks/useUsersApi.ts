/**
 * useUsersApi Hook
 * Provides access to users API functions
 */

import { useApiCall } from './useApiCall';
import {
  getUsersForAdmin,
  getUserOneForAdmin,
  updateUserForAdmin,
  removeUserForAdmin,
  exportUsersCSV,
  getUserAccounts,
  setSuperLockedEnabled,
  GetUsersParams,
  GetUserOneParams,
  UpdateUserParams,
  RemoveUserParams,
  SetSuperLockedEnabledParams,
} from '../api/services/usersService';
import {
  UsersForAdminResponse,
  UserOneForAdminResponse,
  UpdateUserForAdminResponse,
  RemoveUserForAdminResponse,
} from '../api/types';

export const useUsersApi = () => {
  const fetchUsers = useApiCall<UsersForAdminResponse, [GetUsersParams]>(getUsersForAdmin);
  const fetchUser = useApiCall<UserOneForAdminResponse['userOneForAdmin'], [GetUserOneParams]>(getUserOneForAdmin);
  const updateUser = useApiCall<UpdateUserForAdminResponse['updateUserForAdmin'], [UpdateUserParams]>(updateUserForAdmin);
  const removeUser = useApiCall<RemoveUserForAdminResponse['removeUserForAdmin'], [RemoveUserParams]>(removeUserForAdmin);
  const exportCSV = useApiCall<Blob, []>(exportUsersCSV);
  const fetchAccounts = useApiCall(getUserAccounts);
  const setSuperLocked = useApiCall<any, [SetSuperLockedEnabledParams]>(setSuperLockedEnabled);

  return {
    fetchUsers,
    fetchUser,
    updateUser,
    removeUser,
    exportCSV,
    fetchAccounts,
    setSuperLocked,
  };
};

export type {
  GetUsersParams,
  GetUserOneParams,
  UpdateUserParams,
  RemoveUserParams,
  SetSuperLockedEnabledParams,
};

