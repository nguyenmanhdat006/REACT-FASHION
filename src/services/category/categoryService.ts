import { API_ENDPOINTS } from '@/constants';
import type { ApiResponse, ListQueryParams, PageMeta } from '@/types/common/common';
import type {
  Category,
  CategoryPayload,
  UpdateCategoryRequest,
} from '@/types/product/product';
import apiClient from '@/utils/api';
import { toQueryParams } from '@/utils/queryParams';

export const categoryService = {
  getCategories: (params?: ListQueryParams): Promise<ApiResponse<Category[], PageMeta>> =>
    apiClient.get<ApiResponse<Category[], PageMeta>>(API_ENDPOINTS.CATEGORIES.LIST, {
      params: toQueryParams(params),
    }),

  getActiveCategories: (
    params?: ListQueryParams,
  ): Promise<ApiResponse<Category[], PageMeta>> =>
    apiClient.get<ApiResponse<Category[], PageMeta>>(API_ENDPOINTS.CATEGORIES.ACTIVE, {
      params: toQueryParams(params),
    }),

  getCategoryTree: (): Promise<ApiResponse<Category[]>> =>
    apiClient.get<ApiResponse<Category[]>>(API_ENDPOINTS.CATEGORIES.TREE),

  getCategoryById: (id: string): Promise<ApiResponse<Category>> =>
    apiClient.get<ApiResponse<Category>>(API_ENDPOINTS.CATEGORIES.DETAIL(id)),

  getCategoryBySlug: (slug: string): Promise<ApiResponse<Category>> =>
    apiClient.get<ApiResponse<Category>>(API_ENDPOINTS.CATEGORIES.SLUG(slug)),

  createCategory: (payload: CategoryPayload): Promise<ApiResponse<Category>> =>
    apiClient.post<ApiResponse<Category>>(API_ENDPOINTS.CATEGORIES.LIST, payload),

  updateCategory: (
    id: string,
    payload: UpdateCategoryRequest,
  ): Promise<ApiResponse<Category>> =>
    apiClient.put<ApiResponse<Category>>(API_ENDPOINTS.CATEGORIES.DETAIL(id), payload),

  deleteCategory: (id: string): Promise<ApiResponse<unknown>> =>
    apiClient.delete<ApiResponse<unknown>>(API_ENDPOINTS.CATEGORIES.DETAIL(id)),
};
