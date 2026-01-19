/**
 * Upload Service
 * Handles file/image upload API calls
 */

import restClient from '../config/restClient';
import {
  UploadResponse,
  UploadExclusiveContentInput,
  UploadExclusiveContentResponse,
  UpdateExclusiveContentInput,
  UpdateExclusiveContentResponse,
  DeleteExclusiveContentResponse,
  createApiError,
} from '../types';

const UPLOAD_ENDPOINT = '/users/upload';

/**
 * Upload File/Image
 */
export const uploadFileApi = async (file: File): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await restClient.post<UploadResponse>(UPLOAD_ENDPOINT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Upload Exclusive Content
 */
export const uploadExclusiveContentApi = async (
  bioId: string,
  input: UploadExclusiveContentInput
): Promise<UploadExclusiveContentResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', input.file);
    formData.append('price', input.price.toString());
    if (input.fakePrice !== undefined) {
      formData.append('fakePrice', input.fakePrice.toString());
    }
    formData.append('title', input.title);
    formData.append('titleColor', input.titleColor);
    formData.append('cropWidth', input.cropWidth.toString());
    formData.append('cropHeight', input.cropHeight.toString());
    formData.append('cropX', input.cropX.toString());
    formData.append('cropY', input.cropY.toString());
    if (input.order !== undefined) {
      formData.append('order', input.order.toString());
    }
    if (input.icon) {
      formData.append('icon', input.icon);
    }
    if (input.countdownStart !== undefined) {
      formData.append('countdownStart', input.countdownStart.toString());
    }
    if (input.percentDiscount !== undefined) {
      formData.append('percentDiscount', input.percentDiscount.toString());
    }
    if (input.description) {
      formData.append('description', input.description);
    }

    const response = await restClient.post<UploadExclusiveContentResponse>(
      `/users/upload-exclusive-content/${bioId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Update Exclusive Content
 */
export const updateExclusiveContentApi = async (
  bioId: string,
  contentId: string,
  input: UpdateExclusiveContentInput
): Promise<UpdateExclusiveContentResponse> => {
  try {
    const formData = new FormData();
    
    if (input.file) {
      formData.append('file', input.file);
    }
    if (input.price !== undefined) {
      formData.append('price', input.price.toString());
    }
    if (input.fakePrice !== undefined) {
      formData.append('fakePrice', input.fakePrice.toString());
    }
    if (input.title) {
      formData.append('title', input.title);
    }
    if (input.titleColor) {
      formData.append('titleColor', input.titleColor);
    }
    if (input.description) {
      formData.append('description', input.description);
    }
    if (input.cropWidth !== undefined) {
      formData.append('cropWidth', input.cropWidth.toString());
    }
    if (input.cropHeight !== undefined) {
      formData.append('cropHeight', input.cropHeight.toString());
    }
    if (input.cropX !== undefined) {
      formData.append('cropX', input.cropX.toString());
    }
    if (input.cropY !== undefined) {
      formData.append('cropY', input.cropY.toString());
    }
    if (input.countdownStart !== undefined) {
      formData.append('countdownStart', input.countdownStart.toString());
    }
    if (input.percentDiscount !== undefined) {
      formData.append('percentDiscount', input.percentDiscount.toString());
    }
    if (input.icon) {
      formData.append('icon', input.icon);
    }

    const response = await restClient.put<UpdateExclusiveContentResponse>(
      `/users/update-exclusive-content/${bioId}/${contentId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Delete Exclusive Content
 */
export const deleteExclusiveContentApi = async (
  bioId: string,
  contentId: string
): Promise<DeleteExclusiveContentResponse> => {
  try {
    const response = await restClient.delete<DeleteExclusiveContentResponse>(
      `/users/delete-exclusive-content/${bioId}/${contentId}`
    );

    return response.data;
  } catch (error: any) {
    throw createApiError(error);
  }
};

export default {
  uploadFileApi,
  uploadExclusiveContentApi,
  updateExclusiveContentApi,
  deleteExclusiveContentApi,
};

