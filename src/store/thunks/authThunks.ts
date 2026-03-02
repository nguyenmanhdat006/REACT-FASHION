import { createAsyncThunk } from '@reduxjs/toolkit';
import { LoginCredentials, SignUpCredentials } from '@/types/auth';
import { authService } from '@/services/authService';

interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    fullName: string;
    phone?: string;
    avatar?: string;
    roles: string[];
    createdAt: string;
  };
}

// Login thunk
export const loginThunk = createAsyncThunk<
  AuthPayload,
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const data = await authService.login(credentials);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || 'Login failed';
    return rejectWithValue(errorMessage);
  }
});

// Sign up thunk
export const signUpThunk = createAsyncThunk<
  AuthPayload,
  SignUpCredentials,
  { rejectValue: string }
>('auth/signUp', async (credentials, { rejectWithValue }) => {
  try {
    const data = await authService.register(credentials);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
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
>('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authService.logout();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || 'Logout failed';
    return rejectWithValue(errorMessage);
  }
});

export const refreshTokenThunk = createAsyncThunk<
  AuthPayload,
  string,
  { rejectValue: string }
>('auth/refreshToken', async (refreshToken, { rejectWithValue }) => {
  try {
    const data = await authService.refreshToken(refreshToken);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || 'Failed to refresh token';
    return rejectWithValue(errorMessage);
  }
});

export const getProfileThunk = createAsyncThunk<
  AuthPayload['user'],
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
