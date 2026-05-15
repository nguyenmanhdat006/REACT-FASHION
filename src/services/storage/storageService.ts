import { STORAGE_ENDPOINTS } from '@/constants';
import type { ApiResponse } from '@/types/common/common';
import type { UploadCreatedData } from '@/types/storage/storage';
import { storageApiClient } from '@/utils/storageApi';

export const storageService = {
  uploadFile: async (file: File): Promise<ApiResponse<UploadCreatedData>> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await storageApiClient.post<ApiResponse<UploadCreatedData>>(
      STORAGE_ENDPOINTS.UPLOAD,
      formData,
      {
        transformRequest: [
          (data, headers) => {
            if (data instanceof FormData && headers) {
              delete headers['Content-Type'];
            }
            return data;
          },
        ],
      }
    );
    return data;
  },
};
