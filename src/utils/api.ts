import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL, AUTH_ENDPOINTS } from '@/constants';
import type { ApiResponse } from '@/types/common/common';
import type { AuthResponse } from '@/types/auth/auth';
import {
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
  clearAuthTokens,
} from './authStorage';

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };
type MaybeWrapped<T> = ApiResponse<T> | T;

const unwrapApiData = <T>(response: MaybeWrapped<T>): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as ApiResponse<T>).data;
  }

  return response as T;
};

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = getAccessToken();
        const isAuthRequest = config.url?.includes('/auth');

        if (token && config.headers && !isAuthRequest) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      response => response,
      async (error: AxiosError) => {
        if (error.response) {
          const status = error.response.status;
          const message =
            (error.response.data as { message?: string })?.message ||
            'An error occurred';

          switch (status) {
            case 401:
              {
                const originalRequest = error.config as RetryConfig | undefined;
                const refreshToken = getRefreshToken();

                if (
                  refreshToken &&
                  originalRequest &&
                  !originalRequest._retry &&
                  !originalRequest.url?.includes(AUTH_ENDPOINTS.REFRESH)
                ) {
                  originalRequest._retry = true;

                  try {
                    const refreshResponse = await this.client.post<
                      MaybeWrapped<AuthResponse>
                    >(AUTH_ENDPOINTS.REFRESH, { refreshToken });
                    const refreshData = unwrapApiData(refreshResponse.data);

                    setAuthTokens(
                      refreshData.accessToken,
                      refreshData.refreshToken
                    );

                    if (originalRequest.headers) {
                      originalRequest.headers.Authorization =
                        `Bearer ${refreshData.accessToken}`;
                    }

                    return this.client(originalRequest);
                  } catch {
                    clearAuthTokens();
                    window.location.href = '/login';
                    toast.error('Session expired. Please login again.');
                    break;
                  }
                }

                clearAuthTokens();
              }
              window.location.href = '/login';
              toast.error('Session expired. Please login again.');
              break;
            case 403:
              toast.error('You do not have permission to perform this action.');
              break;
            case 404:
              toast.error('Resource not found.');
              break;
            case 500:
              toast.error('Server error. Please try again later.');
              break;
            default:
              toast.error(message);
          }
        } else if (error.request) {
          toast.error('Network error. Please check your connection.');
        } else {
          toast.error('An unexpected error occurred.');
        }

        return Promise.reject(error);
      }
    );
  }

  public get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client
      .get<T, AxiosResponse<T>>(url, config)
      .then(response => response.data);
  }

  public post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.client
      .post<T, AxiosResponse<T>>(url, data, config)
      .then(response => response.data);
  }

  public put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.client
      .put<T, AxiosResponse<T>>(url, data, config)
      .then(response => response.data);
  }

  public patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.client
      .patch<T, AxiosResponse<T>>(url, data, config)
      .then(response => response.data);
  }

  public delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client
      .delete<T, AxiosResponse<T>>(url, config)
      .then(response => response.data);
  }
}

export const apiClient = new ApiClient();
export default apiClient;
