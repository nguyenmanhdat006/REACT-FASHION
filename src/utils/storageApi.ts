import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

import { API_BASE_URL } from '@/constants';
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
