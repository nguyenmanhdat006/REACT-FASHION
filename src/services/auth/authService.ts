import axios from 'axios';
import apiClient from '@/utils/api';
import {
  LoginCredentials,
  SignUpCredentials,
  AuthResponse,
  User,
  Address,
} from '@/types/auth/auth';
import { ApiResponse } from '@/types/common/common';
import { API_ENDPOINTS, AUTH_ENDPOINTS } from '@/constants';

type MaybeWrapped<T> = ApiResponse<T> | T;

type LoginApiUser = User & {
  avatarUrl?: string | null;
  roles?: string[] | null;
};

type LoginApiAuthResponse = Omit<AuthResponse, 'user'> & {
  tokenType?: string;
  user?: LoginApiUser | null;
};

const unwrapApiData = <T>(response: MaybeWrapped<T>): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as ApiResponse<T>).data;
  }

  return response as T;
};

const normalizeAuthResponse = (
  payload: LoginApiAuthResponse,
  fallbackEmail: string
): AuthResponse => {
  const normalizedUser: User = payload.user
    ? {
        ...payload.user,
        avatar: payload.user.avatar ?? payload.user.avatarUrl ?? undefined,
        roles: Array.isArray(payload.user.roles) ? payload.user.roles : [],
      }
    : {
        id: '',
        email: fallbackEmail,
        fullName: fallbackEmail,
        roles: [],
        createdAt: new Date().toISOString(),
      };

  return {
    ...payload,
    user: normalizedUser,
  };
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<MaybeWrapped<LoginApiAuthResponse>>(
        AUTH_ENDPOINTS.LOGIN,
        credentials
      );
      const authData = unwrapApiData(response);

      if (!authData?.accessToken || !authData?.refreshToken) {
        throw new Error('Invalid login response: missing auth tokens.');
      }

      return normalizeAuthResponse(authData, credentials.email);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverMessage = (error.response?.data as { message?: string })?.message;

        if (serverMessage) {
          error.message = serverMessage;
        } else if (!error.response) {
          error.message = 'Unable to connect to authentication gateway.';
        }
      }

      throw error;
    }
  },

  register: async (credentials: SignUpCredentials): Promise<User> => {
    const response = await apiClient.post<MaybeWrapped<User>>(
      AUTH_ENDPOINTS.REGISTER,
      credentials
    );
    return unwrapApiData(response);
  },

  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post(AUTH_ENDPOINTS.LOGOUT, { refreshToken });
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<MaybeWrapped<AuthResponse>>(
      AUTH_ENDPOINTS.REFRESH,
      { refreshToken }
    );
    return unwrapApiData(response);
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<MaybeWrapped<User>>(AUTH_ENDPOINTS.ME);
    return unwrapApiData(response);
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(
      API_ENDPOINTS.USER.PROFILE,
      data
    );
    return response.data;
  },

  getAddresses: async (): Promise<Address[]> => {
    const response = await apiClient.get<ApiResponse<Address[]>>(
      API_ENDPOINTS.USER.ADDRESSES
    );
    return response.data;
  },

  addAddress: async (
    address: Omit<Address, 'id' | 'isDefault'>
  ): Promise<Address> => {
    const response = await apiClient.post<ApiResponse<Address>>(
      API_ENDPOINTS.USER.ADDRESSES,
      address
    );
    return response.data;
  },

  updateAddress: async (
    id: string,
    address: Partial<Address>
  ): Promise<Address> => {
    const response = await apiClient.put<ApiResponse<Address>>(
      API_ENDPOINTS.USER.ADDRESS_DETAIL(id),
      address
    );
    return response.data;
  },

  deleteAddress: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.USER.ADDRESS_DETAIL(id));
  },
};
