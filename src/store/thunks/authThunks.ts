import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  LoginCredentials,
  SignUpCredentials,
  AuthResponse,
  User,
  ForgotPasswordData,
} from '@/types/auth/auth';
import { authService } from '@/services/auth/authService';
import {
  setAuthTokens,
  clearAuthTokens,
  getRefreshToken,
} from '@/utils/authStorage';

// Login thunk
export const loginThunk = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const data = await authService.login(credentials);
    setAuthTokens(data.accessToken, data.refreshToken);
    return data;
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message ||
      (error as { message?: string })?.message ||
      'Login failed';
    return rejectWithValue(errorMessage);
  }
});

// Sign up thunk
export const signUpThunk = createAsyncThunk<
  User,
  SignUpCredentials,
  { rejectValue: string }
>('auth/signUp', async (credentials, { rejectWithValue }) => {
  try {
    return await authService.register(credentials);
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || 'Sign up failed';
    return rejectWithValue(errorMessage);
  }
});

// Logout thunk
export const logoutThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('auth/logout', async () => {
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
});

export const refreshTokenThunk = createAsyncThunk<
  AuthResponse,
  string,
  { rejectValue: string }
>('auth/refreshToken', async (refreshToken, { rejectWithValue }) => {
  try {
    const data = await authService.refreshToken(refreshToken);
    setAuthTokens(data.accessToken, data.refreshToken);
    return data;
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || 'Failed to refresh token';
    return rejectWithValue(errorMessage);
  }
});

export const getProfileThunk = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>('auth/getProfile', async (_, { rejectWithValue }) => {
  try {
    return await authService.getProfile();
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || 'Failed to load profile';
    return rejectWithValue(errorMessage);
  }
});

export const forgotPasswordThunk = createAsyncThunk<
  void,
  ForgotPasswordData,
  { rejectValue: string }
>('auth/forgotPassword', async (data, { rejectWithValue }) => {
  try {
    await authService.forgotPassword(data);
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message ||
      (error as { message?: string })?.message ||
      'Unable to send reset email';
    return rejectWithValue(errorMessage);
  }
});
