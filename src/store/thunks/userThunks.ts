import { createAsyncThunk } from '@reduxjs/toolkit';
import { normalizeUser, type UserInbound } from '@/services/auth/authService';
import {
  userService,
  normalizeAddressList,
  type AddressInbound,
} from '@/services/user/userService';
import type { CreateAddressRequest, UpdateAddressRequest, User } from '@/types/auth/auth';
import type { Address } from '@/types/auth/auth';
import type { ApiResponse } from '@/types/common/common';
import { apiFailureMessage } from '@/utils/apiEnvelope';

const getErrorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
  fallback;

const listFromEnvelope = (res: ApiResponse<AddressInbound[]>): Address[] | null => {
  if (!res.success || !Array.isArray(res.data)) return null;
  return normalizeAddressList(res.data);
};

const toNormalizedAddressesEnvelope = (
  res: ApiResponse<AddressInbound[]>
): ApiResponse<Address[]> | null => {
  const list = listFromEnvelope(res);
  if (!list) return null;
  return { ...res, data: list };
};

export const fetchProfileThunk = createAsyncThunk<
  ApiResponse<User>,
  void,
  { rejectValue: string }
>('user/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const res = await userService.getProfile();
    if (!res.success || res.data === undefined || res.data === null) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return { ...res, data: normalizeUser(res.data as UserInbound) };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch profile'));
  }
});

export const updateProfileThunk = createAsyncThunk<
  ApiResponse<User>,
  Partial<User>,
  { rejectValue: string }
>('user/updateProfile', async (payload, { rejectWithValue }) => {
  try {
    const res = await userService.updateProfile(payload);
    if (!res.success || res.data === undefined || res.data === null) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return { ...res, data: normalizeUser(res.data as UserInbound) };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to update profile'));
  }
});

export const fetchAddressesThunk = createAsyncThunk<
  ApiResponse<Address[]>,
  void,
  { rejectValue: string }
>('user/fetchAddresses', async (_, { rejectWithValue }) => {
  try {
    const res = await userService.getAddresses();
    const out = toNormalizedAddressesEnvelope(res);
    if (!out) return rejectWithValue(apiFailureMessage(res));
    return out;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch addresses'));
  }
});

export const createAddressThunk = createAsyncThunk<
  ApiResponse<Address[]>,
  CreateAddressRequest,
  { rejectValue: string }
>('user/createAddress', async (payload, { rejectWithValue }) => {
  try {
    const createRes = await userService.createAddress(payload);
    if (!createRes.success) return rejectWithValue(apiFailureMessage(createRes));
    const res = await userService.getAddresses();
    const out = toNormalizedAddressesEnvelope(res);
    if (!out) return rejectWithValue(apiFailureMessage(res));
    return out;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to create address'));
  }
});

export const updateAddressThunk = createAsyncThunk<
  ApiResponse<Address[]>,
  { id: string; body: UpdateAddressRequest },
  { rejectValue: string }
>('user/updateAddress', async ({ id, body }, { rejectWithValue }) => {
  try {
    const updateRes = await userService.updateAddress(id, body);
    if (!updateRes.success) return rejectWithValue(apiFailureMessage(updateRes));
    const res = await userService.getAddresses();
    const out = toNormalizedAddressesEnvelope(res);
    if (!out) return rejectWithValue(apiFailureMessage(res));
    return out;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to update address'));
  }
});

export const setDefaultAddressThunk = createAsyncThunk<
  ApiResponse<Address[]>,
  string,
  { rejectValue: string }
>('user/setDefaultAddress', async (id, { rejectWithValue }) => {
  try {
    const defRes = await userService.setDefaultAddress(id);
    if (!defRes.success) return rejectWithValue(apiFailureMessage(defRes));
    const res = await userService.getAddresses();
    const out = toNormalizedAddressesEnvelope(res);
    if (!out) return rejectWithValue(apiFailureMessage(res));
    return out;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to set default address'));
  }
});

export const deleteAddressThunk = createAsyncThunk<
  ApiResponse<Address[]>,
  string,
  { rejectValue: string }
>('user/deleteAddress', async (id, { rejectWithValue }) => {
  try {
    const delRes = await userService.deleteAddress(id);
    if (!delRes.success) return rejectWithValue(apiFailureMessage(delRes));
    const res = await userService.getAddresses();
    const out = toNormalizedAddressesEnvelope(res);
    if (!out) return rejectWithValue(apiFailureMessage(res));
    return out;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to delete address'));
  }
});
