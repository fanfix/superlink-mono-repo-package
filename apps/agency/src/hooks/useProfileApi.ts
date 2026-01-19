/**
 * useProfileApi Hook
 * Provides access to profile data and actions from ApiContext
 */

import { useMemo } from 'react';
import { useApiContext } from '../contexts/ApiContext';

export const useProfileApi = () => {
  const {
    profile,
    loadingStates,
    errors,
    uploadProfileImage,
    updateProfile,
    updateAgencyBranding,
  } = useApiContext();

  const loading = useMemo(
    () =>
      loadingStates.profile ||
      loadingStates.profileUpdate ||
      loadingStates.profileImageUpload ||
      loadingStates.agencyUpdate,
    [
      loadingStates.profile,
      loadingStates.profileUpdate,
      loadingStates.profileImageUpload,
      loadingStates.agencyUpdate,
    ]
  );

  return {
    profile,
    loading,
    loadingStates: {
      profile: loadingStates.profile,
      update: loadingStates.profileUpdate,
      imageUpload: loadingStates.profileImageUpload,
      agencyUpdate: loadingStates.agencyUpdate,
    },
    errors: {
      profile: errors.profile,
      update: errors.profileUpdate,
      imageUpload: errors.profileImageUpload,
      agencyUpdate: errors.agencyUpdate,
    },
    uploadProfileImage,
    updateProfile,
    updateAgencyBranding,
  };
};

export default useProfileApi;

