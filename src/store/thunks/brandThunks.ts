import { createAsyncThunk } from '@reduxjs/toolkit';

import { brandService } from '@/services/brand/brandService';
import {
  DEFAULT_LIST_QUERY,
  type ApiResponse,
  type ListQueryParams,
  type PageMeta,
} from '@/types/common/common';
import type { Brand, BrandPayload, UpdateBrandRequest } from '@/types/product/product';
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

export type FetchBrandsParams = ListQueryParams & {
  /** When true, calls GET /api/brands/active instead of GET /api/brands */
  activeOnly?: boolean;
};

export const fetchBrandsThunk = createAsyncThunk<
  ApiResponse<Brand[], PageMeta>,
  FetchBrandsParams | undefined,
  { rejectValue: string }
>('brands/fetchBrands', async (params, { rejectWithValue }) => {
  const { activeOnly: activeOnlyFlag, ...listParams } = { ...DEFAULT_LIST_QUERY, ...params };
  const activeOnly = activeOnlyFlag === true;
  const query = listParams;

  try {
    const res = activeOnly
      ? await brandService.getActiveBrands(query)
      : await brandService.getBrands(query);
    if (!res.success) return rejectWithValue(apiFailureMessage(res));
    return res;
  } catch (error) {
    return rejectWithValue(
      getErrorMessage(error, activeOnly ? 'Failed to fetch active brands' : 'Failed to fetch brands'),
    );
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

export const fetchBrandByIdThunk = createAsyncThunk<
  ApiResponse<Brand>,
  string,
  { rejectValue: string }
>('brands/fetchBrandById', async (id, { rejectWithValue }) => {
  try {
    const res = await brandService.getBrandById(id);
    if (!res.success || res.data === undefined || res.data === null) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch brand'));
  }
});

export const updateBrandThunk = createAsyncThunk<
  ApiResponse<Brand>,
  { id: string; data: UpdateBrandRequest },
  { rejectValue: string }
>('brands/updateBrand', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await brandService.updateBrand(id, data);
    if (!res.success || res.data === undefined || res.data === null) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to update brand'));
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
