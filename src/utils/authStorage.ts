import { AUTH_STORAGE_KEYS } from '@/constants';

export const getAccessToken = (): string | null =>
  localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);

export const getRefreshToken = (): string | null =>
  localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);

export const setAuthTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
};

export const clearAuthTokens = (): void => {
  localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
};
