import { createAsyncThunk } from '@reduxjs/toolkit';

import { productService } from '@/services/product/productService';
import type {
  Brand,
  BrandPayload,
  Category,
  CategoryPayload,
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

export const fetchCategoriesThunk = createAsyncThunk<
  ApiResponse<Category[]>,
  void,
  { rejectValue: string }
>('products/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const res = await productService.getCategories();
    if (!res.success || !Array.isArray(res.data)) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch categories'));
  }
});

export const fetchBrandsThunk = createAsyncThunk<
  ApiResponse<Brand[]>,
  void,
  { rejectValue: string }
>('products/fetchBrands', async (_, { rejectWithValue }) => {
  try {
    const res = await productService.getBrands();
    if (!res.success || !Array.isArray(res.data)) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch brands'));
  }
});

export type V2PublishedScope = 'home' | 'explore';

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

export const fetchAdminProductMetaThunk = createAsyncThunk<
  ApiResponse<{ categories: Category[]; brands: Brand[] }>,
  void,
  { rejectValue: string }
>('products/fetchAdminProductMeta', async (_, { rejectWithValue }) => {
  try {
    const [catRes, brandRes] = await Promise.all([
      productService.getActiveCategories(),
      productService.getActiveBrands(),
    ]);
    if (!catRes.success || !Array.isArray(catRes.data)) {
      return rejectWithValue(apiFailureMessage(catRes));
    }
    if (!brandRes.success || !Array.isArray(brandRes.data)) {
      return rejectWithValue(apiFailureMessage(brandRes));
    }
    return {
      success: true,
      data: { categories: catRes.data, brands: brandRes.data },
    };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to load categories and brands'));
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

export const createCategoryThunk = createAsyncThunk<
  ApiResponse<Category>,
  CategoryPayload,
  { rejectValue: string }
>('products/createCategory', async (payload, { rejectWithValue }) => {
  try {
    const res = await productService.createCategory(payload);
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
>('products/deleteCategory', async (id, { rejectWithValue }) => {
  try {
    const res = await productService.deleteCategory(id);
    if (!res.success) return rejectWithValue(apiFailureMessage(res));
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to delete category'));
  }
});

export const createBrandThunk = createAsyncThunk<
  ApiResponse<Brand>,
  BrandPayload,
  { rejectValue: string }
>('products/createBrand', async (payload, { rejectWithValue }) => {
  try {
    const res = await productService.createBrand(payload);
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
>('products/deleteBrand', async (id, { rejectWithValue }) => {
  try {
    const res = await productService.deleteBrand(id);
    if (!res.success) return rejectWithValue(apiFailureMessage(res));
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to delete brand'));
  }
});
