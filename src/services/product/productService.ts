import { API_ENDPOINTS } from '@/constants';
import type { ApiResponse, PageResponse } from '@/types/common/common';
import type {
  Brand,
  BrandPayload,
  Category,
  CategoryPayload,
  CreateProductRequest,
  Product,
  ProductFilters,
  ProductListParams,
  SearchProductsParams,
  UpdateBrandRequest,
  UpdateCategoryRequest,
  UpdateProductRequest,
} from '@/types/product/product';
import apiClient from '@/utils/api';

const toQueryParams = (
  params?: ProductFilters | ProductListParams | SearchProductsParams
) => ({ ...params });

const normalizeProductList = (payload: PageResponse<Product> | Product[]): Product[] => {
  return Array.isArray(payload) ? payload : payload.content;
};

export const productService = {
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

  getCategoryById: async (id: string): Promise<Category> => {
    const response = await apiClient.get<ApiResponse<Category>>(
      API_ENDPOINTS.PRODUCTS.CATEGORY_DETAIL(id)
    );
    return response.data;
  },

  getCategoryBySlug: async (slug: string): Promise<Category> => {
    const response = await apiClient.get<ApiResponse<Category>>(
      API_ENDPOINTS.PRODUCTS.CATEGORY_SLUG(slug)
    );
    return response.data;
  },

  createCategory: async (payload: CategoryPayload): Promise<Category> => {
    const response = await apiClient.post<ApiResponse<Category>>(
      API_ENDPOINTS.PRODUCTS.CATEGORIES,
      payload
    );
    return response.data;
  },

  updateCategory: async (
    id: string,
    payload: UpdateCategoryRequest
  ): Promise<Category> => {
    const response = await apiClient.put<ApiResponse<Category>>(
      API_ENDPOINTS.PRODUCTS.CATEGORY_DETAIL(id),
      payload
    );
    return response.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.PRODUCTS.CATEGORY_DETAIL(id));
  },

  getBrands: async (): Promise<Brand[]> => {
    const response = await apiClient.get<ApiResponse<Brand[]>>(
      API_ENDPOINTS.PRODUCTS.BRANDS
    );
    return response.data;
  },

  getActiveBrands: async (): Promise<Brand[]> => {
    const response = await apiClient.get<ApiResponse<Brand[]>>(
      API_ENDPOINTS.PRODUCTS.BRANDS_ACTIVE
    );
    return response.data;
  },

  getBrandById: async (id: string): Promise<Brand> => {
    const response = await apiClient.get<ApiResponse<Brand>>(
      API_ENDPOINTS.PRODUCTS.BRAND_DETAIL(id)
    );
    return response.data;
  },

  getBrandBySlug: async (slug: string): Promise<Brand> => {
    const response = await apiClient.get<ApiResponse<Brand>>(
      API_ENDPOINTS.PRODUCTS.BRAND_SLUG(slug)
    );
    return response.data;
  },

  createBrand: async (payload: BrandPayload): Promise<Brand> => {
    const response = await apiClient.post<ApiResponse<Brand>>(
      API_ENDPOINTS.PRODUCTS.BRANDS,
      payload
    );
    return response.data;
  },

  updateBrand: async (id: string, payload: UpdateBrandRequest): Promise<Brand> => {
    const response = await apiClient.put<ApiResponse<Brand>>(
      API_ENDPOINTS.PRODUCTS.BRAND_DETAIL(id),
      payload
    );
    return response.data;
  },

  deleteBrand: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.PRODUCTS.BRAND_DETAIL(id));
  },

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

  getPublishedProducts: async (
    params?: ProductListParams
  ): Promise<PageResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Product>>>(
      API_ENDPOINTS.PRODUCTS.PUBLISHED,
      { params: toQueryParams(params) }
    );
    return response.data;
  },

  getProductsByCategory: async (
    categoryId: string,
    params?: ProductListParams
  ): Promise<PageResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Product>>>(
      API_ENDPOINTS.PRODUCTS.BY_CATEGORY(categoryId),
      { params: toQueryParams(params) }
    );
    return response.data;
  },

  getProductsByBrand: async (
    brandId: string,
    params?: ProductListParams
  ): Promise<PageResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Product>>>(
      API_ENDPOINTS.PRODUCTS.BY_BRAND(brandId),
      { params: toQueryParams(params) }
    );
    return response.data;
  },

  getFeaturedProductsPage: async (
    params?: ProductListParams
  ): Promise<PageResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Product>>>(
      API_ENDPOINTS.PRODUCTS.FEATURED,
      { params: toQueryParams(params) }
    );
    return response.data;
  },

  getFeaturedProducts: async (params?: ProductListParams): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Product> | Product[]>>(
      API_ENDPOINTS.PRODUCTS.FEATURED,
      { params: toQueryParams(params) }
    );
    return normalizeProductList(response.data);
  },

  getProductsByPriceRange: async (
    minPrice: number,
    maxPrice: number,
    params?: ProductListParams
  ): Promise<PageResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Product>>>(
      API_ENDPOINTS.PRODUCTS.PRICE_RANGE,
      {
        params: {
          ...toQueryParams(params),
          minPrice,
          maxPrice,
        },
      }
    );
    return response.data;
  },

  searchProducts: async (
    filters: SearchProductsParams
  ): Promise<PageResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Product>>>(
      API_ENDPOINTS.PRODUCTS.SEARCH,
      { params: toQueryParams(filters) }
    );
    return response.data;
  },

  createProduct: async (payload: CreateProductRequest): Promise<Product> => {
    const response = await apiClient.post<ApiResponse<Product>>(
      API_ENDPOINTS.PRODUCTS.CREATE,
      payload
    );
    return response.data;
  },

  updateProduct: async (
    id: string,
    payload: UpdateProductRequest
  ): Promise<Product> => {
    const response = await apiClient.put<ApiResponse<Product>>(
      API_ENDPOINTS.PRODUCTS.UPDATE(id),
      payload
    );
    return response.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.PRODUCTS.DELETE(id));
  },

  uploadProductImage: async (id: string, file: File): Promise<Product> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ApiResponse<Product>>(
      API_ENDPOINTS.PRODUCTS.UPLOAD_IMAGE(id),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  syncAllProductsToElasticsearch: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.PRODUCTS.SYNC_ELASTICSEARCH);
  },
};
