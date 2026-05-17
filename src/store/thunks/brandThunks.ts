import { createAsyncThunk } from '@reduxjs/toolkit';

import { brandService } from '@/services/brand/brandService';
import type { ApiResponse } from '@/types/common/common';
import type { Brand, BrandPayload } from '@/types/product/product';
import { apiFailureMessage } from '@/utils/apiEnvelope';

const getErrorMessage = (error: unknown, fallback: string): string => {
  const data = (error as { response?: { data?: { message?: string; error?: string } } })?.response
    ?.data;
  if (data && typeof data.error === 'string' && data.error.trim()) {
    return data.error.trim();
  }
  if (data && typeof data.message === 'string' && data.message.trim()) {
    return data.message.trim();
  }
  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }
  return fallback;
};

export const fetchBrandsThunk = createAsyncThunk<
  ApiResponse<Brand[]>,
  void,
  { rejectValue: string }
>('brands/fetchBrands', async (_, { rejectWithValue }) => {
  try {
    const res = await brandService.getBrands();
    if (!res.success || !Array.isArray(res.data)) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch brands'));
  }
});

export const createBrandThunk = createAsyncThunk<
  ApiResponse<Brand>,
  BrandPayload,
  { rejectValue: string }
>('brands/createBrand', async (payload, { rejectWithValue }) => {
  try {
    const res = await brandService.createBrand(payload);
    if (!res.success || res.data === undefined || res.data === null) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to create brand'));
  }
});

export const deleteBrandThunk = createAsyncThunk<
  ApiResponse<unknown>,
  string,
  { rejectValue: string }
>('brands/deleteBrand', async (id, { rejectWithValue }) => {
  try {
    const res = await brandService.deleteBrand(id);
    if (!res.success) return rejectWithValue(apiFailureMessage(res));
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to delete brand'));
  }
});
