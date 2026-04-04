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
import { getAccessToken } from '@/utils/authStorage';

type MaybeWrapped<T> = ApiResponse<T> | T;

type LoginApiUser = User & {
  avatarUrl?: string | null;
  roles?: string[] | null;
};

type LoginApiAuthResponse = Omit<AuthResponse, 'user'> & {
  tokenType?: string;
  user?: LoginApiUser | null;
};

interface JwtPayload {
  email?: string;
  name?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  realm_access?: {
    roles?: string[];
  };
  resource_access?: Record<string, { roles?: string[] }>;
}

const unwrapApiData = <T>(response: MaybeWrapped<T>): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as ApiResponse<T>).data;
  }

  return response as T;
};

const parseJwtPayload = (token?: string): JwtPayload | null => {
  if (!token) {
    return null;
  }

  try {
    const parts = token.split('.');
    if (parts.length < 2) {
      return null;
    }

    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const decoded = atob(padded);
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
};

const getRolesFromToken = (token?: string): string[] => {
  const payload = parseJwtPayload(token);
  if (!payload) {
    return [];
  }

  const realmRoles = payload.realm_access?.roles ?? [];
  const resourceRoles = Object.values(payload.resource_access ?? {}).flatMap(
    resource => resource.roles ?? []
  );

  return Array.from(new Set([...realmRoles, ...resourceRoles]));
};

const getProfileFieldsFromToken = (token?: string) => {
  const payload = parseJwtPayload(token);
  if (!payload) {
    return {
      email: undefined,
      fullName: undefined,
    };
  }

  return {
    email: payload.email || payload.preferred_username,
    fullName:
      payload.name ||
      [payload.given_name, payload.family_name].filter(Boolean).join(' ') ||
      payload.preferred_username,
  };
};

const normalizeAuthResponse = (
  payload: LoginApiAuthResponse,
  fallbackEmail: string
): AuthResponse => {
  const tokenRoles = getRolesFromToken(payload.accessToken);
  const tokenProfile = getProfileFieldsFromToken(payload.accessToken);

  const normalizedUser: User = payload.user
    ? {
        ...payload.user,
        avatar: payload.user.avatar ?? payload.user.avatarUrl ?? undefined,
        email: payload.user.email || tokenProfile.email || fallbackEmail,
        fullName:
          payload.user.fullName || tokenProfile.fullName || payload.user.email || fallbackEmail,
        roles: Array.isArray(payload.user.roles) && payload.user.roles.length > 0
          ? payload.user.roles
          : tokenRoles,
        createdAt: payload.user.createdAt || new Date().toISOString(),
      }
    : {
        id: '',
        email: tokenProfile.email || fallbackEmail,
        fullName: tokenProfile.fullName || fallbackEmail,
        roles: tokenRoles,
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
    const profile = unwrapApiData(response);
    const token = getAccessToken() || undefined;
    const tokenRoles = getRolesFromToken(token);

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
