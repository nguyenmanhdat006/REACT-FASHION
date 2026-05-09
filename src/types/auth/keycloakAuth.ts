/**
 * Keycloak Authentication V2 Types
 * Resource Owner Password Credentials Grant (Password Grant Flow)
 * Direct API communication with Keycloak server only
 */

// ============================================================================
// REQUEST TYPES
// ============================================================================

/**
 * User credentials for Keycloak password grant flow
 */
export interface KeycloakLoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration payload used by app API before exchanging credentials with Keycloak.
 */
export interface KeycloakRegisterCredentials extends KeycloakLoginCredentials {
  fullName: string;
  phone?: string;
}

/**
 * Normalized authentication session returned after password grant.
 */
export interface KeycloakAuthSession {
  accessToken: string;
  refreshToken: string;
  keycloakId: string;
  expiresIn: number;
}

// ============================================================================
// KEYCLOAK API RESPONSE TYPES
// ============================================================================

/**
 * Response from Keycloak token endpoint
 * POST /realms/{realm}/protocol/openid-connect/token
 */
export interface KeycloakTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: 'Bearer';
  'not-before-policy': number;
  scope: string;
  session_state: string;
}

/**
 * Keycloak JWT payload structure
 * Extracted from access_token via JWT parsing
 * Contains user identity (sub) and roles information
 */
export interface KeycloakJwtPayload {
  jti: string;
  exp: number;
  nbf: number;
  iat: number;
  iss: string;
  aud: string | string[];
  sub: string; // Keycloak user ID
  typ: string;
  azp: string;
  nonce?: string;
  auth_time: number;
  session_state: string;
  acr: string;
  'allowed-origins': string[];
  realm_access: {
    roles: string[];
  };
  resource_access: Record<string, { roles: string[] }>;
  name?: string;
  preferred_username: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  email_verified?: boolean;
}

/**
 * Keycloak userinfo response
 * GET /realms/{realm}/protocol/openid-connect/userinfo
 */
export interface KeycloakUserInfo {
  sub: string;
  email_verified: boolean;
  name?: string;
  preferred_username: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  realm_access?: {
    roles: string[];
  };
  resource_access?: Record<string, { roles: string[] }>;
}

/**
 * Keycloak error response structure
 */
export interface KeycloakErrorResponse {
  error: string;
  error_description?: string;
}
