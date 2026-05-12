import { API_ENDPOINTS } from '@/constants';
import { normalizeUser, type UserInbound } from '@/services/auth/authService';
import type { Address, User } from '@/types/auth/auth';
import type { ApiResponse } from '@/types/common/common';
import apiClient from '@/utils/api';

export const userService = {
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(API_ENDPOINTS.USER.PROFILE);
    return normalizeUser(response.data as UserInbound);
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(
      API_ENDPOINTS.USER.PROFILE,
      data
    );
    return normalizeUser(response.data as UserInbound);
  },

  getAddresses: async (): Promise<Address[]> => {
    const response = await apiClient.get<ApiResponse<Address[]>>(
      API_ENDPOINTS.USER.ADDRESSES
    );
    return response.data;
  },
};
