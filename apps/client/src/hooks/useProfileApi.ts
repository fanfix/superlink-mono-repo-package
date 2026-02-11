import { useApiCall } from './useApiCall';
import { useMyAccount } from '../contexts/MyAccountContext';
import { useSocialLinks } from '../contexts/SocialLinksContext';
import {
  getCurrentUserApi,
  getProfileApi,
  getPublicUserApi,
  updateProfileApi,
} from '../api/services/profileService';
import type {
  CurrentUser,
  Bio,
  PublicUser,
  UpdateProfileInput,
  UpdateProfileResponse,
  UpdateUserInput,
  UpdateUserResponse,
  UpdateBioInput,
  UpdateBioResponse,
  CreateSocialLinkInput,
  UpdateSocialLinkInput,
} from '../api/types';

export const useGetCurrentUser = () => {
  return useApiCall<CurrentUser, []>(getCurrentUserApi);
};

export const useGetProfile = () => {
  return useApiCall<Bio, [string]>(getProfileApi);
};

export const useGetPublicUser = (options?: { throwOnError?: boolean }) => {
  return useApiCall<PublicUser, [string]>(getPublicUserApi, { throwOnError: options?.throwOnError ?? false });
};

export const useUpdateProfile = () => {
  return useApiCall<UpdateProfileResponse, [UpdateProfileInput]>(updateProfileApi);
};

export const useUpdateUser = () => {
  const { updateUser, updating, error } = useMyAccount();
  return {
    execute: updateUser,
    loading: updating,
    error,
  };
};

export const useUpdateBio = () => {
  const { updateBio, updating, error } = useMyAccount();
  return {
    execute: updateBio,
    loading: updating,
    error,
  };
};

export const useAddSocialLink = () => {
  const { addSocialLink, adding, error } = useSocialLinks();
  return {
    execute: addSocialLink,
    loading: adding,
    error,
  };
};

export const useUpdateSocialLink = () => {
  const { updateSocialLink, updating, error } = useSocialLinks();
  return {
    execute: updateSocialLink,
    loading: updating,
    error,
  };
};

export const useRemoveSocialLink = () => {
  const { removeSocialLink, removing, error } = useSocialLinks();
  return {
    execute: removeSocialLink,
    loading: removing,
    error,
  };
};

