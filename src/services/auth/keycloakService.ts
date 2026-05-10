import axios from 'axios';
import {
  KeycloakAuthSession,
  KeycloakLoginCredentials,
  KeycloakRegisterCredentials,
  KeycloakTokenResponse,
  KeycloakJwtPayload,
  KeycloakErrorResponse,
} from '@/types/auth/keycloakAuth';
import apiClient from '@/utils/api';
import { AUTH_ENDPOINTS, KEYCLOAK_AUTH_ENDPOINTS } from '@/constants';
import {
  SocialProvider,
  SOCIAL_PROVIDER_HINTS,
  getBrowserKeycloakClient,
  getCurrentRedirectUri,
  buildPasswordGrantTokenParams,
  createKeycloakHttpClient,
  parseKeycloakJwt,
  initBrowserKeycloakSession,
  getSessionFromBrowserKeycloakClient,
} from '@/utils/keycloak';

export const keycloakAuthService = {
  loginWithProvider: async (
    provider: SocialProvider,
    redirectUri?: string
  ): Promise<void> => {
    const initSuccess = await initBrowserKeycloakSession();
    if (!initSuccess) {
      throw new Error('Unable to initialize Keycloak');
    }

    const keycloakClient = getBrowserKeycloakClient();

    console.log('keycloakClient', keycloakClient);
    console.log('redirectUri', redirectUri);

    await keycloakClient.login({
      idpHint: SOCIAL_PROVIDER_HINTS[provider],
      redirectUri: redirectUri ?? getCurrentRedirectUri(),
    });
  },

  loginWithGoogle: async (redirectUri?: string): Promise<void> => {
    return keycloakAuthService.loginWithProvider('google', redirectUri);
  },

  loginWithFacebook: async (redirectUri?: string): Promise<void> => {
    return keycloakAuthService.loginWithProvider('facebook', redirectUri);
  },

  exchangeAuthorizationCode: async (): Promise<KeycloakAuthSession> => {
    const authenticated = await initBrowserKeycloakSession();
    if (!authenticated) {
      throw new Error('Failed to exchange authorization code: Not authenticated');
    }
    
    const session = getSessionFromBrowserKeycloakClient();
    if (!session) {
      throw new Error('No Keycloak session found after initialization');
    }
    
    return session;
  },

  login: async (
    credentials: KeycloakLoginCredentials
  ): Promise<KeycloakAuthSession> => {
    try {
      const keycloakClient = createKeycloakHttpClient();
      const params = buildPasswordGrantTokenParams(credentials.email, credentials.password);

      const tokenResponse = await keycloakClient.post<KeycloakTokenResponse>(
        KEYCLOAK_AUTH_ENDPOINTS.TOKEN,
        params
      );

      const keycloakTokens = tokenResponse.data;
      const keycloakAccessToken = keycloakTokens.access_token;

      const jwtPayload = parseKeycloakJwt(keycloakAccessToken);
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

register: async (
  credentials: KeycloakRegisterCredentials
): Promise<KeycloakAuthSession> => {
  try {
    const keycloakClient = createKeycloakHttpClient();
    const params = buildPasswordGrantTokenParams(credentials.email, credentials.password);

    await keycloakClient.post(KEYCLOAK_AUTH_ENDPOINTS.TOKEN, params);

    // Đăng nhập luôn sau khi register thành công
    return keycloakAuthService.login({
      email: credentials.email,
      password: credentials.password,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data as any;
      if (responseData?.errorMessage) {
        throw new Error(responseData.errorMessage);
      }
      if (error.response?.status === 409) {
        throw new Error('User already exists');
      }
    }
    throw new Error('Registration failed. Please try again.');
  }
},

  parseToken: (token: string): KeycloakJwtPayload | null => {
    return parseKeycloakJwt(token);
  },

  getKeycloakIdFromToken: (token: string): string | null => {
    const payload = parseKeycloakJwt(token);
    return payload?.sub ?? null;
  },
};

