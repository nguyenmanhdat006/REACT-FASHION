import { JwtProfilePayload, JwtRolePayload } from '@/types/auth/jwt';

const decodeBase64Url = (value: string): string => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');

  // Convert latin1 output from atob into utf-8 string.
  const percentEncoded = atob(padded)
    .split('')
    .map(char => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
    .join('');

  return decodeURIComponent(percentEncoded);
};

export const parseJwtPayload = <T extends object = JwtRolePayload>(
  token?: string
): T | null => {
  if (!token) {
    return null;
  }

  try {
    const parts = token.split('.');
    if (parts.length < 2 || !parts[1]) {
      return null;
    }

    const decodedPayload = decodeBase64Url(parts[1]);
    return JSON.parse(decodedPayload) as T;
  } catch {
    return null;
  }
};

export const extractRolesFromJwtPayload = (
  payload?: JwtRolePayload | null
): string[] => {
  if (!payload) {
    return [];
  }

  const realmRoles = payload.realm_access?.roles ?? [];
  const resourceRoles = Object.values(payload.resource_access ?? {}).flatMap(
    resource => resource.roles ?? []
  );

  return Array.from(new Set([...realmRoles, ...resourceRoles]));
};

export const getRolesFromJwtToken = (token?: string): string[] => {
  const payload = parseJwtPayload<JwtRolePayload>(token);
  return extractRolesFromJwtPayload(payload);
};

export const getProfileFieldsFromJwtToken = (
  token?: string
): { email: string | undefined; fullName: string | undefined } => {
  const payload = parseJwtPayload<JwtProfilePayload>(token);
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
