import { createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '@/services/user/userService';
import type { CreateAddressRequest, UpdateAddressRequest, User } from '@/types/auth/auth';

const getErrorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
  fallback;

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
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch addresses'));
    }
  }
);

export const createAddressThunk = createAsyncThunk(
  'user/createAddress',
  async (payload: CreateAddressRequest, { rejectWithValue }) => {
    try {
      await userService.createAddress(payload);
      return await userService.getAddresses();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to create address'));
    }
  }
);

export const updateAddressThunk = createAsyncThunk(
  'user/updateAddress',
  async (
    { id, body }: { id: string; body: UpdateAddressRequest },
    { rejectWithValue }
  ) => {
    try {
      await userService.updateAddress(id, body);
      return await userService.getAddresses();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to update address'));
    }
  }
);

export const setDefaultAddressThunk = createAsyncThunk(
  'user/setDefaultAddress',
  async (id: string, { rejectWithValue }) => {
    try {
      await userService.setDefaultAddress(id);
      return await userService.getAddresses();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to set default address'));
    }
  }
);

export const deleteAddressThunk = createAsyncThunk(
  'user/deleteAddress',
  async (id: string, { rejectWithValue }) => {
    try {
      await userService.deleteAddress(id);
      return await userService.getAddresses();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to delete address'));
    }
  }
);
