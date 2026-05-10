import apiClient from '@/utils/api';
import {
  LoginCredentials,
  SignUpCredentials,
  AuthResponse,
  User,
  Address,
} from '@/types/auth/auth';
import { ApiResponse } from '@/types/common/common';
import {
  API_ENDPOINTS,
  AUTH_ENDPOINTS,
  KEYCLOAK_AUTH_ENDPOINTS,
  KEYCLOAK_CONFIG,
  SOCIAL_PROVIDER_HINTS,
} from '@/constants';
import { getAccessToken } from '@/utils/authStorage';
import { getRolesFromJwtToken } from '@/utils/jwt';
import { MaybeWrapped, unwrapApiData } from '@/utils/response';
import { OAuthExchangeRequest, SocialProvider } from '@/types/auth/auth';

/** Must match the `redirect_uri` sent when starting the Keycloak authorization request. */
export const getSocialLoginRedirectUri = (provider: SocialProvider): string =>
  `${window.location.origin}/auth/callback?provider=${provider}`;

const buildSocialLoginUrl = (provider: SocialProvider, redirectUri: string): string => {
  const url = new URL(KEYCLOAK_AUTH_ENDPOINTS.AUTH);

  url.searchParams.set('client_id', KEYCLOAK_CONFIG.CLIENT_ID);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid');
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('kc_idp_hint', SOCIAL_PROVIDER_HINTS[provider]);

  return url.toString();
};


export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<MaybeWrapped<AuthResponse>>(
      AUTH_ENDPOINTS.LOGIN,
      credentials
    );
    return unwrapApiData(response);
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

  startSocialLogin: (provider: SocialProvider): void => {
    window.location.assign(
      buildSocialLoginUrl(provider, getSocialLoginRedirectUri(provider))
    );
  },

  exchangeOAuthCode: async (
    provider: SocialProvider,
    code: string
  ): Promise<AuthResponse> => {
    const body: OAuthExchangeRequest = {
      code,
      redirectUri: getSocialLoginRedirectUri(provider),
    };
    const response = await apiClient.post<MaybeWrapped<AuthResponse>>(
      AUTH_ENDPOINTS.OAUTH2(provider),
      body
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
