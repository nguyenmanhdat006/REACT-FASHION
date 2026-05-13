import { API_ENDPOINTS } from '@/constants';
import type { ApiResponse, PageMeta } from '@/types/common/common';
import type {
  Brand,
  BrandPayload,
  Category,
  CategoryPayload,
  CreateProductRequest,
  Product,
  ProductDocument,
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

const getFeaturedPage = (params?: ProductListParams) =>
  apiClient.get<ApiResponse<Product[], PageMeta>>(API_ENDPOINTS.PRODUCTS.FEATURED, {
    params: toQueryParams(params),
  });

export const productService = {
  getCategories: (): Promise<ApiResponse<Category[]>> =>
    apiClient.get<ApiResponse<Category[]>>(API_ENDPOINTS.PRODUCTS.CATEGORIES),

  getActiveCategories: (): Promise<ApiResponse<Category[]>> =>
    apiClient.get<ApiResponse<Category[]>>(API_ENDPOINTS.PRODUCTS.CATEGORIES_ACTIVE),

  getCategoryTree: (): Promise<ApiResponse<Category[]>> =>
    apiClient.get<ApiResponse<Category[]>>(API_ENDPOINTS.PRODUCTS.CATEGORIES_TREE),

  getCategoryById: (id: string): Promise<ApiResponse<Category>> =>
    apiClient.get<ApiResponse<Category>>(API_ENDPOINTS.PRODUCTS.CATEGORY_DETAIL(id)),

  getCategoryBySlug: (slug: string): Promise<ApiResponse<Category>> =>
    apiClient.get<ApiResponse<Category>>(API_ENDPOINTS.PRODUCTS.CATEGORY_SLUG(slug)),

  createCategory: (payload: CategoryPayload): Promise<ApiResponse<Category>> =>
    apiClient.post<ApiResponse<Category>>(API_ENDPOINTS.PRODUCTS.CATEGORIES, payload),

  updateCategory: (
    id: string,
    payload: UpdateCategoryRequest
  ): Promise<ApiResponse<Category>> =>
    apiClient.put<ApiResponse<Category>>(API_ENDPOINTS.PRODUCTS.CATEGORY_DETAIL(id), payload),

  deleteCategory: (id: string): Promise<ApiResponse<unknown>> =>
    apiClient.delete<ApiResponse<unknown>>(API_ENDPOINTS.PRODUCTS.CATEGORY_DETAIL(id)),

  getBrands: (): Promise<ApiResponse<Brand[]>> =>
    apiClient.get<ApiResponse<Brand[]>>(API_ENDPOINTS.PRODUCTS.BRANDS),

  getActiveBrands: (): Promise<ApiResponse<Brand[]>> =>
    apiClient.get<ApiResponse<Brand[]>>(API_ENDPOINTS.PRODUCTS.BRANDS_ACTIVE),

  getBrandById: (id: string): Promise<ApiResponse<Brand>> =>
    apiClient.get<ApiResponse<Brand>>(API_ENDPOINTS.PRODUCTS.BRAND_DETAIL(id)),

  getBrandBySlug: (slug: string): Promise<ApiResponse<Brand>> =>
    apiClient.get<ApiResponse<Brand>>(API_ENDPOINTS.PRODUCTS.BRAND_SLUG(slug)),

  createBrand: (payload: BrandPayload): Promise<ApiResponse<Brand>> =>
    apiClient.post<ApiResponse<Brand>>(API_ENDPOINTS.PRODUCTS.BRANDS, payload),

  updateBrand: (id: string, payload: UpdateBrandRequest): Promise<ApiResponse<Brand>> =>
    apiClient.put<ApiResponse<Brand>>(API_ENDPOINTS.PRODUCTS.BRAND_DETAIL(id), payload),

  deleteBrand: (id: string): Promise<ApiResponse<unknown>> =>
    apiClient.delete<ApiResponse<unknown>>(API_ENDPOINTS.PRODUCTS.BRAND_DETAIL(id)),

  getProducts: (filters?: ProductFilters): Promise<ApiResponse<Product[], PageMeta>> =>
    apiClient.get<ApiResponse<Product[], PageMeta>>(API_ENDPOINTS.PRODUCTS.LIST, {
      params: toQueryParams(filters),
    }),

  getProductById: (id: string): Promise<ApiResponse<Product>> =>
    apiClient.get<ApiResponse<Product>>(API_ENDPOINTS.PRODUCTS.DETAIL(id)),

  getProductBySlug: (slug: string): Promise<ApiResponse<Product>> =>
    apiClient.get<ApiResponse<Product>>(API_ENDPOINTS.PRODUCTS.SLUG(slug)),

  getPublishedProducts: (
    params?: ProductListParams
  ): Promise<ApiResponse<Product[], PageMeta>> =>
    apiClient.get<ApiResponse<Product[], PageMeta>>(API_ENDPOINTS.PRODUCTS.PUBLISHED, {
      params: toQueryParams(params),
    }),

  getProductsByCategory: (
    categoryId: string,
    params?: ProductListParams
  ): Promise<ApiResponse<Product[], PageMeta>> =>
    apiClient.get<ApiResponse<Product[], PageMeta>>(
      API_ENDPOINTS.PRODUCTS.BY_CATEGORY(categoryId),
      { params: toQueryParams(params) }
    ),

  getProductsByBrand: (
    brandId: string,
    params?: ProductListParams
  ): Promise<ApiResponse<Product[], PageMeta>> =>
    apiClient.get<ApiResponse<Product[], PageMeta>>(
      API_ENDPOINTS.PRODUCTS.BY_BRAND(brandId),
      { params: toQueryParams(params) }
    ),

  getFeaturedProductsPage: getFeaturedPage,

  getFeaturedProducts: getFeaturedPage,

  getProductsByPriceRange: (
    minPrice: number,
    maxPrice: number,
    params?: ProductListParams
  ): Promise<ApiResponse<Product[], PageMeta>> =>
    apiClient.get<ApiResponse<Product[], PageMeta>>(API_ENDPOINTS.PRODUCTS.PRICE_RANGE, {
      params: {
        ...toQueryParams(params),
        minPrice,
        maxPrice,
      },
    }),

  searchProducts: (
    filters: SearchProductsParams
  ): Promise<ApiResponse<ProductDocument[], PageMeta>> =>
    apiClient.get<ApiResponse<ProductDocument[], PageMeta>>(API_ENDPOINTS.PRODUCTS.SEARCH, {
      params: toQueryParams(filters),
    }),

  createProduct: (payload: CreateProductRequest): Promise<ApiResponse<Product>> =>
    apiClient.post<ApiResponse<Product>>(API_ENDPOINTS.PRODUCTS.CREATE, payload),

  updateProduct: (
    id: string,
    payload: UpdateProductRequest
  ): Promise<ApiResponse<Product>> =>
    apiClient.put<ApiResponse<Product>>(API_ENDPOINTS.PRODUCTS.UPDATE(id), payload),

  deleteProduct: (id: string): Promise<ApiResponse<unknown>> =>
    apiClient.delete<ApiResponse<unknown>>(API_ENDPOINTS.PRODUCTS.DELETE(id)),

  uploadProductImage: (id: string, file: File): Promise<ApiResponse<string>> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<ApiResponse<string>>(
      API_ENDPOINTS.PRODUCTS.UPLOAD_IMAGE(id),
      formData
    );
  },

  syncAllProductsToElasticsearch: (): Promise<ApiResponse<unknown>> =>
    apiClient.post<ApiResponse<unknown>>(API_ENDPOINTS.PRODUCTS.SYNC_ELASTICSEARCH),
};
