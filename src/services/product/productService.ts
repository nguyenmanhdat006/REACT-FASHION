import { API_ENDPOINTS } from '@/constants';
import type { ApiResponse, PageMeta } from '@/types/common/common';
import type {
  CreateProductRequest,
  Product,
  ProductDocument,
  ProductFilters,
  ProductListParams,
  SearchProductsParams,
  UpdateProductRequest,
} from '@/types/product/product';
import apiClient from '@/utils/api';
import { toQueryParams } from '@/utils/queryParams';

const getFeaturedPage = (params?: ProductListParams) =>
  apiClient.get<ApiResponse<Product[], PageMeta>>(API_ENDPOINTS.PRODUCTS.FEATURED, {
    params: toQueryParams(params),
  });

export const productService = {
  getProducts: (filters?: ProductFilters): Promise<ApiResponse<Product[], PageMeta>> =>
    apiClient.get<ApiResponse<Product[], PageMeta>>(API_ENDPOINTS.PRODUCTS.LIST, {
      params: toQueryParams(filters),
    }),

  getProductById: (id: string): Promise<ApiResponse<Product>> =>
    apiClient.get<ApiResponse<Product>>(API_ENDPOINTS.PRODUCTS.DETAIL(id)),

  getProductBySlug: (slug: string): Promise<ApiResponse<Product>> =>
    apiClient.get<ApiResponse<Product>>(API_ENDPOINTS.PRODUCTS.SLUG(slug)),

  getPublishedProducts: (
    params?: ProductListParams,
  ): Promise<ApiResponse<Product[], PageMeta>> =>
    apiClient.get<ApiResponse<Product[], PageMeta>>(API_ENDPOINTS.PRODUCTS.PUBLISHED, {
      params: toQueryParams(params),
    }),

  getProductsByCategory: (
    categoryId: string,
    params?: ProductListParams,
  ): Promise<ApiResponse<Product[], PageMeta>> =>
    apiClient.get<ApiResponse<Product[], PageMeta>>(
      API_ENDPOINTS.PRODUCTS.BY_CATEGORY(categoryId),
      { params: toQueryParams(params) },
    ),

  getProductsByBrand: (
    brandId: string,
    params?: ProductListParams,
  ): Promise<ApiResponse<Product[], PageMeta>> =>
    apiClient.get<ApiResponse<Product[], PageMeta>>(
      API_ENDPOINTS.PRODUCTS.BY_BRAND(brandId),
      { params: toQueryParams(params) },
    ),

  getFeaturedProductsPage: getFeaturedPage,

  getFeaturedProducts: getFeaturedPage,

  getProductsByPriceRange: (
    minPrice: number,
    maxPrice: number,
    params?: ProductListParams,
  ): Promise<ApiResponse<Product[], PageMeta>> =>
    apiClient.get<ApiResponse<Product[], PageMeta>>(API_ENDPOINTS.PRODUCTS.PRICE_RANGE, {
      params: {
        ...toQueryParams(params),
        minPrice,
        maxPrice,
      },
    }),

  searchProducts: (
    filters: SearchProductsParams,
  ): Promise<ApiResponse<ProductDocument[], PageMeta>> =>
    apiClient.get<ApiResponse<ProductDocument[], PageMeta>>(API_ENDPOINTS.PRODUCTS.SEARCH, {
      params: toQueryParams(filters),
    }),

  createProduct: (payload: CreateProductRequest): Promise<ApiResponse<Product>> =>
    apiClient.post<ApiResponse<Product>>(API_ENDPOINTS.PRODUCTS.CREATE, payload),

  updateProduct: (
    id: string,
    payload: UpdateProductRequest,
  ): Promise<ApiResponse<Product>> =>
    apiClient.put<ApiResponse<Product>>(API_ENDPOINTS.PRODUCTS.UPDATE(id), payload),

  deleteProduct: (id: string): Promise<ApiResponse<unknown>> =>
    apiClient.delete<ApiResponse<unknown>>(API_ENDPOINTS.PRODUCTS.DELETE(id)),

  uploadProductImage: (id: string, file: File): Promise<ApiResponse<string>> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<ApiResponse<string>>(
      API_ENDPOINTS.PRODUCTS.UPLOAD_IMAGE(id),
      formData,
    );
  },

  syncAllProductsToElasticsearch: (): Promise<ApiResponse<unknown>> =>
    apiClient.post<ApiResponse<unknown>>(API_ENDPOINTS.PRODUCTS.SYNC_ELASTICSEARCH),
};
