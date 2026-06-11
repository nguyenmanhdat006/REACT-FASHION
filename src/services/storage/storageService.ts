import type { ApiResponse } from '@/types/common/common';
import type { UploadCreatedData } from '@/types/storage/storage';
import { uploadStorageFile } from '@/utils/storageApi';

export const storageService = {
  uploadFile: async (file: File): Promise<ApiResponse<UploadCreatedData>> => {
    const formData = new FormData();
    formData.append('file', file);
    return uploadStorageFile(formData);
  },
};
