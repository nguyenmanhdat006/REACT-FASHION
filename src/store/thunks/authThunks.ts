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
import type { ApiResponse } from '@/types/common/common';

const getHttpErrorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
  (error as { message?: string })?.message ||
  fallback;

// Login thunk
export const loginThunk = createAsyncThunk<
  ApiResponse<AuthResponse>,
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
    return { ...res, data };
  } catch (error) {
    return rejectWithValue(getHttpErrorMessage(error, 'Login failed'));
  }
});

// Sign up thunk
export const signUpThunk = createAsyncThunk<
  ApiResponse<User>,
  SignUpCredentials,
  { rejectValue: string }
>('auth/signUp', async (credentials, { rejectWithValue }) => {
  try {
    const res = await authService.register(credentials);
    if (!res.success || res.data === undefined || res.data === null) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return { ...res, data: normalizeUser(res.data as UserInbound) };
  } catch (error) {
    return rejectWithValue(getHttpErrorMessage(error, 'Sign up failed'));
  }
});

// Logout thunk
export const logoutThunk = createAsyncThunk<
  ApiResponse<null>,
  void,
  { rejectValue: string }
>('auth/logout', async () => {
  try {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      clearAuthTokens();
      return { success: true as const, data: null };
    }

    await authService.logout(refreshToken);
  } catch {
    // Always clear local session even if backend logout endpoint fails.
  } finally {
    clearAuthTokens();
  }
  return { success: true as const, data: null };
});

export const refreshTokenThunk = createAsyncThunk<
  ApiResponse<AuthResponse>,
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
    return { ...res, data };
  } catch (error) {
    return rejectWithValue(getHttpErrorMessage(error, 'Failed to refresh token'));
  }
});

export const getProfileThunk = createAsyncThunk<
  ApiResponse<User>,
  void,
  { rejectValue: string }
>('auth/getProfile', async (_, { rejectWithValue }) => {
  try {
    const res = await authService.getProfile();
    if (!res.success || res.data === undefined || res.data === null) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return { ...res, data: finalizeUserFromMeEnvelope(res) };
  } catch (error) {
    return rejectWithValue(getHttpErrorMessage(error, 'Failed to load profile'));
  }
});

export const forgotPasswordThunk = createAsyncThunk<
  ApiResponse<null>,
  ForgotPasswordData,
  { rejectValue: string }
>('auth/forgotPassword', async (data, { rejectWithValue }) => {
  try {
    const res = await authService.forgotPassword(data);
    if (!res.success) return rejectWithValue(apiFailureMessage(res));
    return res;
  } catch (error) {
    return rejectWithValue(
      getHttpErrorMessage(error, 'Unable to send reset email')
    );
  }
});
