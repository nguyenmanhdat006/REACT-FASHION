import axios, { AxiosInstance } from 'axios';
import {
  KeycloakAuthSession,
  KeycloakLoginCredentials,
  KeycloakRegisterCredentials,
  KeycloakTokenResponse,
  KeycloakJwtPayload,
  KeycloakErrorResponse,
} from '@/types/auth/keycloakAuth';
import { parseJwtPayload, extractRolesFromJwtPayload } from '@/utils/jwt';
import apiClient from '@/utils/api';
import {
  AUTH_ENDPOINTS,
  KEYCLOAK_CONFIG,
  KEYCLOAK_AUTH_ENDPOINTS,
} from '@/constants';

const parseJwt = (token: string): KeycloakJwtPayload | null =>
  parseJwtPayload<KeycloakJwtPayload>(token);

const isTokenExpired = (token: string): boolean => {
  const payload = parseJwt(token);
  if (!payload) return true;

  const now = Math.floor(Date.now() / 1000);
  const expirationTime = payload.exp;

  return now >= expirationTime - 60;
};

const extractRolesFromToken = (payload: KeycloakJwtPayload): string[] => {
  return extractRolesFromJwtPayload(payload);
};

const buildTokenParams = (credentials: KeycloakLoginCredentials): URLSearchParams => {
  const params = new URLSearchParams();
  params.append('client_id', KEYCLOAK_CONFIG.CLIENT_ID);
  params.append('grant_type', KEYCLOAK_CONFIG.GRANT_TYPE);
  params.append('username', credentials.email);
  params.append('password', credentials.password);
  return params;
};

const buildRefreshTokenParams = (refreshToken: string): URLSearchParams => {
  const params = new URLSearchParams();
  params.append('client_id', KEYCLOAK_CONFIG.CLIENT_ID);
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', refreshToken);
  return params;
};

const createKeycloakClient = (): AxiosInstance => {
  return axios.create({
    timeout: 10000,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

export const keycloakAuthService = {

  login: async (
    credentials: KeycloakLoginCredentials
  ): Promise<KeycloakAuthSession> => {
    return keycloakAuthService.exchangeCredentials(credentials);
  },

  register: async (
    credentials: KeycloakRegisterCredentials
  ): Promise<KeycloakAuthSession> => {
    await apiClient.post<void>(AUTH_ENDPOINTS.REGISTER, credentials);

    return keycloakAuthService.login({
      email: credentials.email,
      password: credentials.password,
    });
  },

  exchangeCredentials: async (
    credentials: KeycloakLoginCredentials
  ): Promise<KeycloakAuthSession> => {
    try {
      const keycloakClient = createKeycloakClient();
      const params = buildTokenParams(credentials);

      const tokenResponse = await keycloakClient.post<KeycloakTokenResponse>(
        KEYCLOAK_AUTH_ENDPOINTS.TOKEN,
        params
      );

      const keycloakTokens = tokenResponse.data;
      const keycloakAccessToken = keycloakTokens.access_token;

      const jwtPayload = parseJwt(keycloakAccessToken);
      if (!jwtPayload || !jwtPayload.sub) {
        throw new Error('Invalid Keycloak token: missing sub claim');
      }

      const keycloakId = jwtPayload.sub;

      return {
        accessToken: keycloakAccessToken,
        refreshToken: keycloakTokens.refresh_token,
        keycloakId,
        expiresIn: keycloakTokens.expires_in,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data as
          | KeycloakErrorResponse
          | { message?: string }
          | undefined;

        if (errorData && 'error' in errorData) {
          // Keycloak error response
          const message = (errorData as KeycloakErrorResponse).error_description || 
                         (errorData as KeycloakErrorResponse).error;
          throw new Error(message);
        }
        
        if (!error.response) {
          throw new Error('Unable to connect to Keycloak server');
        }

        // Handle HTTP errors
        if (error.response.status === 401) {
          throw new Error('Invalid email or password');
        }
        if (error.response.status === 400) {
          throw new Error('Invalid request to Keycloak');
        }
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      throw new Error(errorMessage);
    }
  },

  refreshTokens: async (
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> => {
    try {
      const keycloakClient = createKeycloakClient();
      const params = buildRefreshTokenParams(refreshToken);

      const response = await keycloakClient.post<KeycloakTokenResponse>(
        KEYCLOAK_AUTH_ENDPOINTS.TOKEN,
        params
      );

      const data = response.data;
      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data as KeycloakErrorResponse | undefined;
        
        if (errorData && 'error' in errorData) {
          const message = errorData.error_description || errorData.error;
          throw new Error(message);
        }

        if (!error.response) {
          throw new Error('Unable to connect to Keycloak server');
        }

        // Refresh token likely expired or invalid
        if (error.response.status === 400 || error.response.status === 401) {
          throw new Error('Refresh token expired or invalid');
        }
      }

      const errorMessage = error instanceof Error ? error.message : 'Token refresh failed';
      throw new Error(errorMessage);
    }
  },

  isAccessTokenExpired: (token: string): boolean => {
    return isTokenExpired(token);
  },

  parseToken: (token: string): KeycloakJwtPayload | null => {
    return parseJwt(token);
  },

  getRolesFromToken: (token: string): string[] => {
    const payload = parseJwt(token);
    if (!payload) return [];
    return extractRolesFromToken(payload);
  },

  getKeycloakIdFromToken: (token: string): string | null => {
    const payload = parseJwt(token);
    return payload?.sub ?? null;
  },
};
