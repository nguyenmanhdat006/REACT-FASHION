import { createAsyncThunk } from '@reduxjs/toolkit';

import { productService } from '@/services/product/productService';
import type {
  Brand,
  Category,
  CreateProductRequest,
  Product,
  ProductFilters,
  ProductListParams,
} from '@/types/product/product';
import type { PageResponse } from '@/types/common/common';

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
  PageResponse<Product>,
  ProductFilters | undefined,
  { rejectValue: string }
>('products/fetchProducts', async (filters, { rejectWithValue }) => {
  try {
    return await productService.getProducts(filters);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch products'));
  }
});

export const fetchFeaturedProductsThunk = createAsyncThunk<
  PageResponse<Product>,
  void,
  { rejectValue: string }
>('products/fetchFeaturedProducts', async (_, { rejectWithValue }) => {
  try {
    return await productService.getFeaturedProducts();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch featured products'));
  }
});

export const fetchProductBySlugThunk = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>('products/fetchProductBySlug', async (slug, { rejectWithValue }) => {
  try {
    return await productService.getProductBySlug(slug);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch product'));
  }
});

export const fetchCategoriesThunk = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>('products/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    return await productService.getCategories();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch categories'));
  }
});

export const fetchBrandsThunk = createAsyncThunk<Brand[], void, { rejectValue: string }>(
  'products/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      return await productService.getBrands();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch brands'));
    }
  }
);

export type V2PublishedScope = 'home' | 'explore';

export const fetchV2PublishedProductsThunk = createAsyncThunk<
  { scope: V2PublishedScope; products: Product[] },
  { scope: V2PublishedScope; params?: ProductListParams },
  { rejectValue: string }
>('products/fetchV2Published', async ({ scope, params }, { rejectWithValue }) => {
  try {
    const merged: ProductListParams = {
      page: 0,
      size: scope === 'home' ? 8 : 12,
      ...params,
    };
    const page = await productService.getPublishedProducts(merged);
    return { scope, products: page.content };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to load products'));
  }
});

export const fetchProductByIdThunk = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>('products/fetchProductById', async (id, { rejectWithValue }) => {
  try {
    return await productService.getProductById(id);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to load product'));
  }
});

export const fetchAdminProductMetaThunk = createAsyncThunk<
  { categories: Category[]; brands: Brand[] },
  void,
  { rejectValue: string }
>('products/fetchAdminProductMeta', async (_, { rejectWithValue }) => {
  try {
    const [categories, brands] = await Promise.all([
      productService.getActiveCategories(),
      productService.getActiveBrands(),
    ]);
    return { categories, brands };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to load categories and brands'));
  }
});

export const createProductThunk = createAsyncThunk<
  Product,
  CreateProductRequest,
  { rejectValue: string }
>('products/createProduct', async (payload, { rejectWithValue }) => {
  try {
    return await productService.createProduct(payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to create product'));
  }
});

export const deleteProductThunk = createAsyncThunk<string, string, { rejectValue: string }>(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await productService.deleteProduct(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to delete product'));
    }
  }
);
