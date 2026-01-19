import { useApiCall } from './useApiCall';
import { useContent } from '../contexts/ContentContext';
import { uploadFileApi } from '../api/services/uploadService';
import type {
  UploadResponse,
  UploadExclusiveContentInput,
} from '../api/types';

export const useUploadFile = () => {
  return useApiCall<UploadResponse, [File]>(uploadFileApi);
};

export const useUploadExclusiveContent = () => {
  const { uploadExclusiveContent, uploading, error } = useContent();
  return {
    execute: uploadExclusiveContent,
    loading: uploading,
    error,
  };
};

export const useUpdateExclusiveContent = () => {
  const { updateExclusiveContent, updating, error } = useContent();
  return {
    execute: (bioId: string, contentId: string, input: any) => {
      return updateExclusiveContent(bioId, contentId, input);
    },
    loading: updating,
    error,
  };
};

export const useDeleteExclusiveContent = () => {
  const { deleteExclusiveContent, deleting, error } = useContent();
  return {
    execute: (bioId: string, contentId: string) => {
      return deleteExclusiveContent(bioId, contentId);
    },
    loading: deleting,
    error,
  };
};

