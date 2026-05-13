import { API_ENDPOINTS } from '@/constants';
import type { PageResponse } from '@/types/common/common';
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
import { MaybeWrapped, unwrapApiSuccess } from '@/utils/response';

const toQueryParams = (
  params?: ProductFilters | ProductListParams | SearchProductsParams
) => ({ ...params });

const getFeaturedPage = async (
  params?: ProductListParams
): Promise<PageResponse<Product>> => {
  const response = await apiClient.get<MaybeWrapped<PageResponse<Product>>>(
    API_ENDPOINTS.PRODUCTS.FEATURED,
    { params: toQueryParams(params) }
  );
  return unwrapApiSuccess(response);
};

export const productService = {
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<MaybeWrapped<Category[]>>(
      API_ENDPOINTS.PRODUCTS.CATEGORIES
    );
    return unwrapApiSuccess(response);
  },

  getActiveCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<MaybeWrapped<Category[]>>(
      API_ENDPOINTS.PRODUCTS.CATEGORIES_ACTIVE
    );
    return unwrapApiSuccess(response);
  },

  getCategoryTree: async (): Promise<Category[]> => {
    const response = await apiClient.get<MaybeWrapped<Category[]>>(
      API_ENDPOINTS.PRODUCTS.CATEGORIES_TREE
    );
    return unwrapApiSuccess(response);
  },

  getCategoryById: async (id: string): Promise<Category> => {
    const response = await apiClient.get<MaybeWrapped<Category>>(
      API_ENDPOINTS.PRODUCTS.CATEGORY_DETAIL(id)
    );
    return unwrapApiSuccess(response);
  },

  getCategoryBySlug: async (slug: string): Promise<Category> => {
    const response = await apiClient.get<MaybeWrapped<Category>>(
      API_ENDPOINTS.PRODUCTS.CATEGORY_SLUG(slug)
    );
    return unwrapApiSuccess(response);
  },

  createCategory: async (payload: CategoryPayload): Promise<Category> => {
    const response = await apiClient.post<MaybeWrapped<Category>>(
      API_ENDPOINTS.PRODUCTS.CATEGORIES,
      payload
    );
    return unwrapApiSuccess(response);
  },

  updateCategory: async (
    id: string,
    payload: UpdateCategoryRequest
  ): Promise<Category> => {
    const response = await apiClient.put<MaybeWrapped<Category>>(
      API_ENDPOINTS.PRODUCTS.CATEGORY_DETAIL(id),
      payload
    );
    return unwrapApiSuccess(response);
  },

  deleteCategory: async (id: string): Promise<void> => {
    const response = await apiClient.delete<MaybeWrapped<unknown>>(
      API_ENDPOINTS.PRODUCTS.CATEGORY_DETAIL(id)
    );
    if (response === undefined || response === null || response === '') return;
    unwrapApiSuccess(response);
  },

  getBrands: async (): Promise<Brand[]> => {
    const response = await apiClient.get<MaybeWrapped<Brand[]>>(API_ENDPOINTS.PRODUCTS.BRANDS);
    return unwrapApiSuccess(response);
  },

  getActiveBrands: async (): Promise<Brand[]> => {
    const response = await apiClient.get<MaybeWrapped<Brand[]>>(
      API_ENDPOINTS.PRODUCTS.BRANDS_ACTIVE
    );
    return unwrapApiSuccess(response);
  },

  getBrandById: async (id: string): Promise<Brand> => {
    const response = await apiClient.get<MaybeWrapped<Brand>>(
      API_ENDPOINTS.PRODUCTS.BRAND_DETAIL(id)
    );
    return unwrapApiSuccess(response);
  },

  getBrandBySlug: async (slug: string): Promise<Brand> => {
    const response = await apiClient.get<MaybeWrapped<Brand>>(
      API_ENDPOINTS.PRODUCTS.BRAND_SLUG(slug)
    );
    return unwrapApiSuccess(response);
  },

  createBrand: async (payload: BrandPayload): Promise<Brand> => {
    const response = await apiClient.post<MaybeWrapped<Brand>>(
      API_ENDPOINTS.PRODUCTS.BRANDS,
      payload
    );
    return unwrapApiSuccess(response);
  },

  updateBrand: async (id: string, payload: UpdateBrandRequest): Promise<Brand> => {
    const response = await apiClient.put<MaybeWrapped<Brand>>(
      API_ENDPOINTS.PRODUCTS.BRAND_DETAIL(id),
      payload
    );
    return unwrapApiSuccess(response);
  },

  deleteBrand: async (id: string): Promise<void> => {
    const response = await apiClient.delete<MaybeWrapped<unknown>>(
      API_ENDPOINTS.PRODUCTS.BRAND_DETAIL(id)
    );
    if (response === undefined || response === null || response === '') return;
    unwrapApiSuccess(response);
  },

  getProducts: async (filters?: ProductFilters): Promise<PageResponse<Product>> => {
    const response = await apiClient.get<MaybeWrapped<PageResponse<Product>>>(
      API_ENDPOINTS.PRODUCTS.LIST,
      { params: toQueryParams(filters) }
    );
    return unwrapApiSuccess(response);
  },

  getProductById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<MaybeWrapped<Product>>(
      API_ENDPOINTS.PRODUCTS.DETAIL(id)
    );
    return unwrapApiSuccess(response);
  },

  getProductBySlug: async (slug: string): Promise<Product> => {
    const response = await apiClient.get<MaybeWrapped<Product>>(
      API_ENDPOINTS.PRODUCTS.SLUG(slug)
    );
    return unwrapApiSuccess(response);
  },

  getPublishedProducts: async (
    params?: ProductListParams
  ): Promise<PageResponse<Product>> => {
    const response = await apiClient.get<MaybeWrapped<PageResponse<Product>>>(
      API_ENDPOINTS.PRODUCTS.PUBLISHED,
      { params: toQueryParams(params) }
    );
    return unwrapApiSuccess(response);
  },

  getProductsByCategory: async (
    categoryId: string,
    params?: ProductListParams
  ): Promise<PageResponse<Product>> => {
    const response = await apiClient.get<MaybeWrapped<PageResponse<Product>>>(
      API_ENDPOINTS.PRODUCTS.BY_CATEGORY(categoryId),
      { params: toQueryParams(params) }
    );
    return unwrapApiSuccess(response);
  },

  getProductsByBrand: async (
    brandId: string,
    params?: ProductListParams
  ): Promise<PageResponse<Product>> => {
    const response = await apiClient.get<MaybeWrapped<PageResponse<Product>>>(
      API_ENDPOINTS.PRODUCTS.BY_BRAND(brandId),
      { params: toQueryParams(params) }
    );
    return unwrapApiSuccess(response);
  },

  getFeaturedProductsPage: getFeaturedPage,

  /** Same contract as other paged product endpoints: `PageResponse<Product>`. */
  getFeaturedProducts: getFeaturedPage,

  getProductsByPriceRange: async (
    minPrice: number,
    maxPrice: number,
    params?: ProductListParams
  ): Promise<PageResponse<Product>> => {
    const response = await apiClient.get<MaybeWrapped<PageResponse<Product>>>(
      API_ENDPOINTS.PRODUCTS.PRICE_RANGE,
      {
        params: {
          ...toQueryParams(params),
          minPrice,
          maxPrice,
        },
      }
    );
    return unwrapApiSuccess(response);
  },

  searchProducts: async (
    filters: SearchProductsParams
  ): Promise<PageResponse<ProductDocument>> => {
    const response = await apiClient.get<MaybeWrapped<PageResponse<ProductDocument>>>(
      API_ENDPOINTS.PRODUCTS.SEARCH,
      { params: toQueryParams(filters) }
    );
    return unwrapApiSuccess(response);
  },

  createProduct: async (payload: CreateProductRequest): Promise<Product> => {
    const response = await apiClient.post<MaybeWrapped<Product>>(
      API_ENDPOINTS.PRODUCTS.CREATE,
      payload
    );
    return unwrapApiSuccess(response);
  },

  updateProduct: async (
    id: string,
    payload: UpdateProductRequest
  ): Promise<Product> => {
    const response = await apiClient.put<MaybeWrapped<Product>>(
      API_ENDPOINTS.PRODUCTS.UPDATE(id),
      payload
    );
    return unwrapApiSuccess(response);
  },

  deleteProduct: async (id: string): Promise<void> => {
    const response = await apiClient.delete<MaybeWrapped<unknown>>(
      API_ENDPOINTS.PRODUCTS.DELETE(id)
    );
    if (response === undefined || response === null || response === '') return;
    unwrapApiSuccess(response);
  },

  uploadProductImage: async (id: string, file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<MaybeWrapped<string>>(
      API_ENDPOINTS.PRODUCTS.UPLOAD_IMAGE(id),
      formData
    );
    return unwrapApiSuccess(response);
  },

  syncAllProductsToElasticsearch: async (): Promise<void> => {
    const response = await apiClient.post<MaybeWrapped<unknown>>(
      API_ENDPOINTS.PRODUCTS.SYNC_ELASTICSEARCH
    );
    if (response === undefined || response === null || response === '') return;
    unwrapApiSuccess(response);
  },
};
