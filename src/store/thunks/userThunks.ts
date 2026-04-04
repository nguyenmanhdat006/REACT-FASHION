import { createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '@/services/user/userService';
import type { User } from '@/types/auth/auth';

const getErrorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } })?.response?.data
    ?.message || fallback;

export const fetchProfileThunk = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getProfile();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch profile'));
    }
  }
);

export const updateProfileThunk = createAsyncThunk(
  'user/updateProfile',
  async (payload: Partial<User>, { rejectWithValue }) => {
    try {
      return await userService.updateProfile(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to update profile'));
    }
  }
);

export const fetchAddressesThunk = createAsyncThunk(
  'user/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getAddresses();
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Failed to fetch addresses')
      );
    }
  }
);
