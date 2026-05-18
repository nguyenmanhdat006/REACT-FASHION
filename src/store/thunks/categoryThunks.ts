import { createAsyncThunk } from '@reduxjs/toolkit';

import { categoryService } from '@/services/category/categoryService';
import {
  DEFAULT_LIST_QUERY,
  type ApiResponse,
  type ListQueryParams,
  type PageMeta,
} from '@/types/common/common';
import type {
  Category,
  CategoryPayload,
  UpdateCategoryRequest,
} from '@/types/product/product';
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

export type FetchCategoriesParams = ListQueryParams & {
  /** When true, calls GET /api/categories/active instead of GET /api/categories */
  activeOnly?: boolean;
};

export const fetchCategoriesThunk = createAsyncThunk<
  ApiResponse<Category[], PageMeta>,
  FetchCategoriesParams | undefined,
  { rejectValue: string }
>('categories/fetchCategories', async (params, { rejectWithValue }) => {
  const { activeOnly: activeOnlyFlag, ...listParams } = { ...DEFAULT_LIST_QUERY, ...params };
  const activeOnly = activeOnlyFlag === true;
  const query = listParams;

  try {
    const res = activeOnly
      ? await categoryService.getActiveCategories(query)
      : await categoryService.getCategories(query);
    if (!res.success) return rejectWithValue(apiFailureMessage(res));
    return res;
  } catch (error) {
    return rejectWithValue(
      getErrorMessage(
        error,
        activeOnly ? 'Failed to fetch active categories' : 'Failed to fetch categories',
      ),
    );
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

export const fetchCategoryByIdThunk = createAsyncThunk<
  ApiResponse<Category>,
  string,
  { rejectValue: string }
>('categories/fetchCategoryById', async (id, { rejectWithValue }) => {
  try {
    const res = await categoryService.getCategoryById(id);
    if (!res.success || res.data === undefined || res.data === null) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch category'));
  }
});

export const updateCategoryThunk = createAsyncThunk<
  ApiResponse<Category>,
  { id: string; data: UpdateCategoryRequest },
  { rejectValue: string }
>('categories/updateCategory', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await categoryService.updateCategory(id, data);
    if (!res.success || res.data === undefined || res.data === null) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to update category'));
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
