import apiClient from '@/utils/api';
import {
  LoginCredentials,
  SignUpCredentials,
  AuthResponse,
  User,
  Address,
} from '@/types/auth';
import { ApiResponse } from '@/types/common';
import { API_ENDPOINTS } from '@/constants';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data;
  },

  register: async (credentials: SignUpCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.REGISTER,
      credentials
    );
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.REFRESH
      ,
      { refreshToken }
    );
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(
      API_ENDPOINTS.USER.PROFILE
    );
    return response.data;
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
