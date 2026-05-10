/**
 * Keycloak utilities layer
 * Helper functions for Keycloak authentication operations
 */

import axios, { AxiosInstance } from 'axios';
import Keycloak from 'keycloak-js';
import { KeycloakJwtPayload, KeycloakAuthSession } from '@/types/auth/keycloakAuth';
import { KEYCLOAK_CONFIG } from '@/constants';
import { parseJwtPayload, extractRolesFromJwtPayload } from './jwt';

// ============================================================================
// SOCIAL LOGIN CONFIGURATION
// ============================================================================

export type SocialProvider = 'google' | 'facebook';

export const SOCIAL_PROVIDER_HINTS: Record<SocialProvider, string> = {
  google: KEYCLOAK_CONFIG.SOCIAL_PROVIDERS.GOOGLE,
  facebook: KEYCLOAK_CONFIG.SOCIAL_PROVIDERS.FACEBOOK,
};

export interface KeycloakBaseConfig {
  url: string;
  realm: string;
}

export const getKeycloakBaseConfig = (): KeycloakBaseConfig => {
  const normalizedUrl = KEYCLOAK_CONFIG.REALM_URL.replace(/\/$/, '');
  const match = normalizedUrl.match(/^(.*)\/realms\/([^/]+)$/);

  if (match) {
    return {
      url: match[1],
      realm: match[2],
    };
  }

  return {
    url: normalizedUrl,
    realm: 'ecommerce',
  };
};

let browserKeycloakClient: InstanceType<typeof Keycloak> | null = null;
let browserSessionInitPromise: Promise<boolean> | null = null;

export const getBrowserKeycloakClient = (): InstanceType<typeof Keycloak> => {
  if (!browserKeycloakClient) {
    const { url, realm } = getKeycloakBaseConfig();

    browserKeycloakClient = new Keycloak({
      url,
      realm,
      clientId: KEYCLOAK_CONFIG.CLIENT_ID,
    });
  }

  return browserKeycloakClient;
};

export const resetBrowserKeycloakClient = (): void => {
  browserKeycloakClient = null;
  browserSessionInitPromise = null;
};

// ============================================================================
// JWT PARSING & TOKEN MANAGEMENT
// ============================================================================

export const parseKeycloakJwt = (token: string): KeycloakJwtPayload | null =>
  parseJwtPayload<KeycloakJwtPayload>(token);

export const isTokenExpired = (token: string): boolean => {
  const payload = parseKeycloakJwt(token);
  if (!payload) return true;

  const now = Math.floor(Date.now() / 1000);
  const expirationTime = payload.exp;

  return now >= expirationTime - 60;
};

export const extractRolesFromKeycloakToken = (payload: KeycloakJwtPayload): string[] => {
  return extractRolesFromJwtPayload(payload);
};

// ============================================================================
// REQUEST PARAMETER BUILDERS
// ============================================================================

export const buildPasswordGrantTokenParams = (email: string, password: string): URLSearchParams => {
  const params = new URLSearchParams();
  params.append('client_id', KEYCLOAK_CONFIG.CLIENT_ID);
  params.append('grant_type', KEYCLOAK_CONFIG.GRANT_TYPE);
  params.append('username', email);
  params.append('password', password);
  return params;
};

export const buildRefreshTokenParams = (refreshToken: string): URLSearchParams => {
  const params = new URLSearchParams();
  params.append('client_id', KEYCLOAK_CONFIG.CLIENT_ID);
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', refreshToken);
  return params;
};

// ============================================================================
// HTTP CLIENT
// ============================================================================

export const createKeycloakHttpClient = (): AxiosInstance => {
  return axios.create({
    timeout: 10000,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

// ============================================================================
// BROWSER SESSION HELPERS
// ============================================================================

export const getCurrentRedirectUri = (): string | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return window.location.href;
};

export const getSessionFromBrowserKeycloakClient = (): KeycloakAuthSession | null => {
  const client = getBrowserKeycloakClient();

  if (!client.token || !client.refreshToken || !client.subject || !client.tokenParsed?.exp) {
    return null;
  }

  const expiresIn = Math.max(
    client.tokenParsed.exp - Math.floor(Date.now() / 1000),
    0
  );

  return {
    accessToken: client.token,
    refreshToken: client.refreshToken,
    keycloakId: client.subject,
    expiresIn,
  };
};

export const initBrowserKeycloakSession = async (): Promise<boolean> => {
  if (!browserSessionInitPromise) {
    const keycloakClient = getBrowserKeycloakClient();

    browserSessionInitPromise = keycloakClient
      .init({
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        checkLoginIframe: false,
      })
      .catch(() => false);
  }

  return browserSessionInitPromise;
};
