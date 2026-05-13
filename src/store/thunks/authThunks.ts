import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  LoginCredentials,
  SignUpCredentials,
  AuthResponse,
  User,
  ForgotPasswordData,
} from '@/types/auth/auth';
import {
  authService,
  authDataWithNormalizedUser,
  finalizeUserFromMeEnvelope,
  normalizeUser,
  type UserInbound,
} from '@/services/auth/authService';
import {
  setAuthTokens,
  clearAuthTokens,
  getRefreshToken,
} from '@/utils/authStorage';
import { apiFailureMessage } from '@/utils/apiEnvelope';

const getHttpErrorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
  (error as { message?: string })?.message ||
  fallback;

// Login thunk
export const loginThunk = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const res = await authService.login(credentials);
    if (!res.success || res.data === undefined || res.data === null) {
      return rejectWithValue(apiFailureMessage(res));
    }
    const data = authDataWithNormalizedUser(res.data);
    setAuthTokens(data.accessToken, data.refreshToken);
    return data;
  } catch (error) {
    return rejectWithValue(getHttpErrorMessage(error, 'Login failed'));
  }
});

// Sign up thunk
export const signUpThunk = createAsyncThunk<
  User,
  SignUpCredentials,
  { rejectValue: string }
>('auth/signUp', async (credentials, { rejectWithValue }) => {
  try {
    const res = await authService.register(credentials);
    if (!res.success || res.data === undefined || res.data === null) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return normalizeUser(res.data as UserInbound);
  } catch (error) {
    return rejectWithValue(getHttpErrorMessage(error, 'Sign up failed'));
  }
});

// Logout thunk
export const logoutThunk = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async () => {
    try {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        clearAuthTokens();
        return;
      }

      await authService.logout(refreshToken);
    } catch {
      // Always clear local session even if backend logout endpoint fails.
    } finally {
      clearAuthTokens();
    }
  }
);

export const refreshTokenThunk = createAsyncThunk<
  AuthResponse,
  string,
  { rejectValue: string }
>('auth/refreshToken', async (refreshToken, { rejectWithValue }) => {
  try {
    const res = await authService.refreshToken(refreshToken);
    if (!res.success || res.data === undefined || res.data === null) {
      return rejectWithValue(apiFailureMessage(res));
    }
    const data = authDataWithNormalizedUser(res.data);
    setAuthTokens(data.accessToken, data.refreshToken);
    return data;
  } catch (error) {
    return rejectWithValue(getHttpErrorMessage(error, 'Failed to refresh token'));
  }
});

export const getProfileThunk = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>('auth/getProfile', async (_, { rejectWithValue }) => {
  try {
    const res = await authService.getProfile();
    if (!res.success || res.data === undefined || res.data === null) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return finalizeUserFromMeEnvelope(res);
  } catch (error) {
    return rejectWithValue(getHttpErrorMessage(error, 'Failed to load profile'));
  }
});

export const forgotPasswordThunk = createAsyncThunk<
  void,
  ForgotPasswordData,
  { rejectValue: string }
>('auth/forgotPassword', async (data, { rejectWithValue }) => {
  try {
    const res = await authService.forgotPassword(data);
    if (!res.success) return rejectWithValue(apiFailureMessage(res));
  } catch (error) {
    return rejectWithValue(
      getHttpErrorMessage(error, 'Unable to send reset email')
    );
  }
});
