import { API_ENDPOINTS } from '@/constants';
import type { ApiResponse, PageResponse } from '@/types/common';
import type { Brand, Category, Product, ProductFilters } from '@/types/product';
import apiClient from '@/utils/api';

const toQueryParams = (filters?: ProductFilters) => ({ ...filters });

export const productService = {
  getProducts: async (filters?: ProductFilters): Promise<PageResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Product>>>(
      API_ENDPOINTS.PRODUCTS.LIST,
      { params: toQueryParams(filters) }
    );
    return response.data;
  },

  getProductById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(
      API_ENDPOINTS.PRODUCTS.DETAIL(id)
    );
    return response.data;
  },

  getProductBySlug: async (slug: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(
      API_ENDPOINTS.PRODUCTS.SLUG(slug)
    );
    return response.data;
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>(
      API_ENDPOINTS.PRODUCTS.FEATURED
    );
    return response.data;
  },

  searchProducts: async (filters: ProductFilters): Promise<PageResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Product>>>(
      API_ENDPOINTS.PRODUCTS.SEARCH,
      { params: toQueryParams(filters) }
    );
    return response.data;
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>(
      API_ENDPOINTS.PRODUCTS.CATEGORIES
    );
    return response.data;
  },

  getCategoryTree: async (): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>(
      API_ENDPOINTS.PRODUCTS.CATEGORIES_TREE
    );
    return response.data;
  },

  getBrands: async (): Promise<Brand[]> => {
    const response = await apiClient.get<ApiResponse<Brand[]>>(
      API_ENDPOINTS.PRODUCTS.BRANDS
    );
    return response.data;
  },
};
