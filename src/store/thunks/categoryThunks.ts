import { createAsyncThunk } from '@reduxjs/toolkit';

import { categoryService } from '@/services/category/categoryService';
import {
  DEFAULT_LIST_QUERY,
  type ApiResponse,
  type ListQueryParams,
  type PageMeta,
} from '@/types/common/common';
import type { Category, CategoryPayload } from '@/types/product/product';
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

export const fetchCategoriesThunk = createAsyncThunk<
  ApiResponse<Category[], PageMeta>,
  ListQueryParams | undefined,
  { rejectValue: string }
>('categories/fetchCategories', async (params, { rejectWithValue }) => {
  try {
    const res = await categoryService.getCategories(params ?? DEFAULT_LIST_QUERY);
    if (!res.success) return rejectWithValue(apiFailureMessage(res));
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch categories'));
  }
});

export const fetchActiveCategoriesThunk = createAsyncThunk<
  ApiResponse<Category[], PageMeta>,
  ListQueryParams | undefined,
  { rejectValue: string }
>('categories/fetchActiveCategories', async (params, { rejectWithValue }) => {
  try {
    const res = await categoryService.getActiveCategories(params ?? DEFAULT_LIST_QUERY);
    if (!res.success) return rejectWithValue(apiFailureMessage(res));
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch active categories'));
  }
});

export const createCategoryThunk = createAsyncThunk<
  ApiResponse<Category>,
  CategoryPayload,
  { rejectValue: string }
>('categories/createCategory', async (payload, { rejectWithValue }) => {
  try {
    const res = await categoryService.createCategory(payload);
    if (!res.success || res.data === undefined || res.data === null) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to create category'));
  }
});

export const deleteCategoryThunk = createAsyncThunk<
  ApiResponse<unknown>,
  string,
  { rejectValue: string }
>('categories/deleteCategory', async (id, { rejectWithValue }) => {
  try {
    const res = await categoryService.deleteCategory(id);
    if (!res.success) return rejectWithValue(apiFailureMessage(res));
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to delete category'));
  }
});
