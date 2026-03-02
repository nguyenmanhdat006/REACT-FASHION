import { createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '@/services/productService';
import type { ProductFilters } from '@/types/product';

const getErrorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } })?.response?.data
    ?.message || fallback;

export const fetchProductsThunk = createAsyncThunk(
  'products/fetchProducts',
  async (filters: ProductFilters | undefined, { rejectWithValue }) => {
    try {
      return await productService.getProducts(filters);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch products'));
    }
  }
);

export const fetchFeaturedProductsThunk = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      return await productService.getFeaturedProducts();
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Failed to fetch featured products')
      );
    }
  }
);

export const fetchProductBySlugThunk = createAsyncThunk(
  'products/fetchProductBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      return await productService.getProductBySlug(slug);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch product'));
    }
  }
);

export const fetchCategoriesThunk = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await productService.getCategories();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch categories'));
    }
  }
);

export const fetchBrandsThunk = createAsyncThunk(
  'products/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      return await productService.getBrands();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch brands'));
    }
  }
);
