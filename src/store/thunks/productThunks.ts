import { createAsyncThunk } from '@reduxjs/toolkit';

import { mapExploreToProductFilters } from '@/pages/UserProductV2/exploreFilters/exploreFilterModel';
import { productService } from '@/services/product/productService';
import type { RootState } from '@/store';
import type {
  CreateProductRequest,
  Product,
  ProductFilters,
  ProductListParams,
  UpdateProductRequest,
} from '@/types/product/product';
import type { ApiResponse, PageMeta } from '@/types/common/common';
import { apiFailureMessage } from '@/utils/apiEnvelope';
import { normalizeProduct } from '@/utils/product/normalizeProduct';

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

export const fetchProductsThunk = createAsyncThunk<
  ApiResponse<Product[], PageMeta>,
  ProductFilters | undefined,
  { rejectValue: string }
>('products/fetchProducts', async (filters, { rejectWithValue }) => {
  try {
    const res = await productService.getProducts(filters);
    if (!res.success) return rejectWithValue(apiFailureMessage(res));
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch products'));
  }
});

export const fetchFeaturedProductsThunk = createAsyncThunk<
  ApiResponse<Product[], PageMeta>,
  void,
  { rejectValue: string }
>('products/fetchFeaturedProducts', async (_, { rejectWithValue }) => {
  try {
    const res = await productService.getFeaturedProducts();
    if (!res.success) return rejectWithValue(apiFailureMessage(res));
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch featured products'));
  }
});

export const fetchProductBySlugThunk = createAsyncThunk<
  ApiResponse<Product>,
  string,
  { rejectValue: string }
>('products/fetchProductBySlug', async (slug, { rejectWithValue }) => {
  try {
    const res = await productService.getProductBySlug(slug);
    if (!res.success || res.data === undefined || res.data === null) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch product'));
  }
});

export type V2PublishedScope = 'home' | 'explore';

export const fetchExploreProductsThunk = createAsyncThunk<
  ApiResponse<Product[], PageMeta>,
  void,
  { rejectValue: string; state: RootState }
>('products/fetchExplore', async (_, { getState, rejectWithValue }) => {
  try {
    const { exploreAppliedFilters } = getState().products;
    const apiFilters = mapExploreToProductFilters(exploreAppliedFilters);
    const res = await productService.getProducts(apiFilters);
    if (res.success === false || !Array.isArray(res.data)) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to load products'));
  }
});

export const fetchV2PublishedProductsThunk = createAsyncThunk<
  ApiResponse<Product[], PageMeta>,
  { scope: V2PublishedScope; params?: ProductListParams },
  { rejectValue: string }
>('products/fetchV2Published', async ({ scope, params }, { rejectWithValue }) => {
  try {
    const merged: ProductListParams = {
      page: 0,
      size: scope === 'home' ? 8 : 12,
      ...params,
    };
    const res = await productService.getPublishedProducts(merged);
    if (res.success === false || !Array.isArray(res.data)) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to load products'));
  }
});

export const fetchProductByIdThunk = createAsyncThunk<
  ApiResponse<Product>,
  string,
  { rejectValue: string }
>('products/fetchProductById', async (id, { rejectWithValue }) => {
  try {
    const res = await productService.getProductById(id);
    if (!res.success || res.data === undefined || res.data === null) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return { ...res, data: normalizeProduct(res.data) };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to load product'));
  }
});

export const createProductThunk = createAsyncThunk<
  ApiResponse<Product>,
  CreateProductRequest,
  { rejectValue: string }
>('products/createProduct', async (payload, { rejectWithValue }) => {
  try {
    const res = await productService.createProduct(payload);
    if (!res.success || res.data === undefined || res.data === null) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return { ...res, data: normalizeProduct(res.data) };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to create product'));
  }
});

export const updateProductThunk = createAsyncThunk<
  ApiResponse<Product>,
  { id: string; payload: UpdateProductRequest },
  { rejectValue: string }
>('products/updateProduct', async ({ id, payload }, { rejectWithValue }) => {
  try {
    const res = await productService.updateProduct(id, payload);
    if (!res.success || res.data === undefined || res.data === null) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return { ...res, data: normalizeProduct(res.data) };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to update product'));
  }
});

export const deleteProductThunk = createAsyncThunk<
  ApiResponse<unknown>,
  string,
  { rejectValue: string }
>('products/deleteProduct', async (id, { rejectWithValue }) => {
  try {
    const res = await productService.deleteProduct(id);
    if (!res.success) return rejectWithValue(apiFailureMessage(res));
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to delete product'));
  }
});
