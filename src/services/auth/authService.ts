import apiClient from '@/utils/api';
import {
  LoginCredentials,
  SignUpCredentials,
  AuthResponse,
  User,
  Address,
  ForgotPasswordData,
  OAuthExchangeRequest,
  SocialProvider,
} from '@/types/auth/auth';
import type { ApiResponse } from '@/types/common/common';
import {
  API_ENDPOINTS,
  AUTH_ENDPOINTS,
  KEYCLOAK_AUTH_ENDPOINTS,
  KEYCLOAK_CONFIG,
  SOCIAL_PROVIDER_HINTS,
} from '@/constants';
import { getAccessToken } from '@/utils/authStorage';
import { getRolesFromJwtToken } from '@/utils/jwt';

export type UserInbound = User & { roles?: string[] | null; avatar?: string | null };

export function normalizeUser(raw: UserInbound): User {
  const { avatar: legacyAvatar, roles: rawRoles, ...rest } = raw;
  const avatarUrl = rest.avatarUrl ?? legacyAvatar ?? undefined;
  return {
    ...rest,
    roles: Array.isArray(rawRoles) ? rawRoles : [],
    avatarUrl: avatarUrl ?? undefined,
  };
}

export function authDataWithNormalizedUser(data: AuthResponse): AuthResponse {
  return {
    ...data,
    user: normalizeUser(data.user as UserInbound),
  };
}

export function finalizeUserFromMeEnvelope(res: ApiResponse<User>): User {
  const profile = res.data;
  const token = getAccessToken() || undefined;
  const tokenRoles = getRolesFromJwtToken(token);

  const roles =
    Array.isArray(profile.roles) && profile.roles.length > 0 ? profile.roles : tokenRoles;

  return normalizeUser({
    ...(profile as UserInbound),
    roles,
  });
}

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
  login: (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> =>
    apiClient.post<ApiResponse<AuthResponse>>(AUTH_ENDPOINTS.LOGIN, credentials),

  register: (credentials: SignUpCredentials): Promise<ApiResponse<User>> =>
    apiClient.post<ApiResponse<User>>(AUTH_ENDPOINTS.REGISTER, credentials),

  logout: (refreshToken: string): Promise<void> =>
    apiClient.post(AUTH_ENDPOINTS.LOGOUT, { refreshToken }),

  refreshToken: (refreshToken: string): Promise<ApiResponse<AuthResponse>> =>
    apiClient.post<ApiResponse<AuthResponse>>(AUTH_ENDPOINTS.REFRESH, { refreshToken }),

  forgotPassword: (data: ForgotPasswordData): Promise<ApiResponse<null>> =>
    apiClient.post<ApiResponse<null>>(AUTH_ENDPOINTS.FORGOT_PASSWORD, data),

  socialLogin: (provider: SocialProvider): void => {
    window.location.assign(
      buildSocialLoginUrl(provider, getSocialLoginRedirectUri(provider))
    );
  },

  exchangeOAuthCode: (
    provider: SocialProvider,
    code: string
  ): Promise<ApiResponse<AuthResponse>> => {
    const body: OAuthExchangeRequest = {
      code,
      redirectUri: getSocialLoginRedirectUri(provider),
    };
    return apiClient.post<ApiResponse<AuthResponse>>(
      AUTH_ENDPOINTS.OAUTH2(provider),
      body
    );
  },

  getProfile: (): Promise<ApiResponse<User>> =>
    apiClient.get<ApiResponse<User>>(AUTH_ENDPOINTS.ME),

  updateProfile: (data: Partial<User>): Promise<ApiResponse<User>> =>
    apiClient.put<ApiResponse<User>>(API_ENDPOINTS.USER.PROFILE, data),

  getAddresses: (): Promise<ApiResponse<Address[]>> =>
    apiClient.get<ApiResponse<Address[]>>(API_ENDPOINTS.USER.ADDRESSES),

  addAddress: (address: Omit<Address, 'id' | 'isDefault'>): Promise<ApiResponse<Address>> =>
    apiClient.post<ApiResponse<Address>>(API_ENDPOINTS.USER.ADDRESSES, address),

  updateAddress: (
    id: string,
    address: Partial<Address>
  ): Promise<ApiResponse<Address>> =>
    apiClient.put<ApiResponse<Address>>(API_ENDPOINTS.USER.ADDRESS_DETAIL(id), address),

  deleteAddress: (id: string): Promise<ApiResponse<null>> =>
    apiClient.delete<ApiResponse<null>>(API_ENDPOINTS.USER.ADDRESS_DETAIL(id)),
};
