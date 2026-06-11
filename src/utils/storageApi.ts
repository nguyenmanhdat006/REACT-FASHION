import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

import { API_BASE_URL, STORAGE_ENDPOINTS } from '@/constants';
import { IS_MOCK_ENABLED } from '@/config/env';
import { handleMockApiRequest } from '@/mocks/handlers/mockApiHandlers';
import type { ApiResponse } from '@/types/common/common';
import type { UploadCreatedData } from '@/types/storage/storage';
import { getAccessToken } from '@/utils/authStorage';

function createStorageClient(): AxiosInstance {
  const client = axios.create({
    baseURL: API_BASE_URL.replace(/\/+$/, ''),
    timeout: 120_000,
  });

  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return client;
}

export const storageApiClient = createStorageClient();

export async function uploadStorageFile(
  formData: FormData,
): Promise<ApiResponse<UploadCreatedData>> {
  if (IS_MOCK_ENABLED) {
    const mockResponse = await handleMockApiRequest<ApiResponse<UploadCreatedData>>(
      'post',
      STORAGE_ENDPOINTS.UPLOAD,
      formData,
    );
    if (mockResponse !== undefined) {
      return mockResponse;
    }
  }

  const { data } = await storageApiClient.post<ApiResponse<UploadCreatedData>>(
    STORAGE_ENDPOINTS.UPLOAD,
    formData,
    {
      transformRequest: [
        (payload, headers) => {
          if (payload instanceof FormData && headers) {
            delete headers['Content-Type'];
          }
          return payload;
        },
      ],
    },
  );
  return data;
}
