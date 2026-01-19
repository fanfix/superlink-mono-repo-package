/**
 * useBiosApi Hook
 * Provides access to bios API functions
 */

import { useApiCall } from './useApiCall';
import {
  getAllBiosForAdmin,
  getOneBioForAdmin,
  createBio,
  updateBioAdmin,
  removeBio,
  importFollowers,
  GetBiosParams,
  GetBioOneParams,
  CreateBioParams,
  UpdateBioParams,
  RemoveBioParams,
  ImportFollowersParams,
} from '../api/services/biosService';
import {
  FindAllBiosForAdminResponse,
  FindOneBioForAdminResponse,
  CreateBioResponse,
  UpdateBioAdminResponse,
  RemoveBioResponse,
} from '../api/types';

export const useBiosApi = () => {
  const fetchBios = useApiCall<FindAllBiosForAdminResponse, [GetBiosParams]>(getAllBiosForAdmin);
  const fetchBio = useApiCall<FindOneBioForAdminResponse['findOneBioForAdmin'], [GetBioOneParams]>(getOneBioForAdmin);
  const create = useApiCall<CreateBioResponse['createBio'], [CreateBioParams]>(createBio);
  const update = useApiCall<UpdateBioAdminResponse['updateBioAdmin'], [UpdateBioParams]>(updateBioAdmin);
  const remove = useApiCall<RemoveBioResponse['removeBio'], [RemoveBioParams]>(removeBio);
  const importFollowersData = useApiCall<any, [ImportFollowersParams]>(importFollowers);

  return {
    fetchBios,
    fetchBio,
    create,
    update,
    remove,
    importFollowers: importFollowersData,
  };
};

export type {
  GetBiosParams,
  GetBioOneParams,
  CreateBioParams,
  UpdateBioParams,
  RemoveBioParams,
  ImportFollowersParams,
};

