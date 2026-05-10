import axios from 'axios';
import apiClient from '@/utils/api';
import {
  LoginCredentials,
  SignUpCredentials,
  AuthResponse,
  User,
  Address,
} from '@/types/auth/auth';
import { KeycloakLoginExchangeRequest } from '@/types/auth/keycloakAuth';
import { ApiResponse } from '@/types/common/common';
import { API_ENDPOINTS, AUTH_ENDPOINTS } from '@/constants';
import { getAccessToken } from '@/utils/authStorage';
import { getRolesFromJwtToken } from '@/utils/jwt';
import { MaybeWrapped, unwrapApiData } from '@/utils/response';
import { keycloakAuthService } from './keycloakService';

type KeycloakExchangeResponse = MaybeWrapped<AuthResponse>;

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const kcSession = await keycloakAuthService.login(credentials);

      return authService.loginWithKeycloakToken({
        accessToken: kcSession.accessToken,
      });
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

  handleSocialCallback: async (): Promise<AuthResponse> => {
    try {
      const kcSession = await keycloakAuthService.exchangeAuthorizationCode();

      return authService.loginWithKeycloakToken({
        accessToken: kcSession.accessToken,
      });
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

  loginWithKeycloakToken: async (
    payload: KeycloakLoginExchangeRequest
  ): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<KeycloakExchangeResponse>(
        AUTH_ENDPOINTS.KEYCLOAK_LOGIN,
        payload
      );

      return unwrapApiData(response);
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
    const profile = unwrapApiData(response);
    const token = getAccessToken() || undefined;
    const tokenRoles = getRolesFromJwtToken(token);

    return {
      ...profile,
      roles:
        Array.isArray(profile.roles) && profile.roles.length > 0
          ? profile.roles
          : tokenRoles,
    };
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
