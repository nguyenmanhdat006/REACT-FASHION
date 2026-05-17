import { API_ENDPOINTS } from '@/constants';
import type { ApiResponse, ListQueryParams, PageMeta } from '@/types/common/common';
import type { Brand, BrandPayload, UpdateBrandRequest } from '@/types/product/product';
import apiClient from '@/utils/api';
import { toQueryParams } from '@/utils/queryParams';

export const brandService = {
  getBrands: (params?: ListQueryParams): Promise<ApiResponse<Brand[], PageMeta>> =>
    apiClient.get<ApiResponse<Brand[], PageMeta>>(API_ENDPOINTS.BRANDS.LIST, {
      params: toQueryParams(params),
    }),

  getActiveBrands: (params?: ListQueryParams): Promise<ApiResponse<Brand[], PageMeta>> =>
    apiClient.get<ApiResponse<Brand[], PageMeta>>(API_ENDPOINTS.BRANDS.ACTIVE, {
      params: toQueryParams(params),
    }),

  getBrandById: (id: string): Promise<ApiResponse<Brand>> =>
    apiClient.get<ApiResponse<Brand>>(API_ENDPOINTS.BRANDS.DETAIL(id)),

  getBrandBySlug: (slug: string): Promise<ApiResponse<Brand>> =>
    apiClient.get<ApiResponse<Brand>>(API_ENDPOINTS.BRANDS.SLUG(slug)),

  createBrand: (payload: BrandPayload): Promise<ApiResponse<Brand>> =>
    apiClient.post<ApiResponse<Brand>>(API_ENDPOINTS.BRANDS.LIST, payload),

  updateBrand: (id: string, payload: UpdateBrandRequest): Promise<ApiResponse<Brand>> =>
    apiClient.put<ApiResponse<Brand>>(API_ENDPOINTS.BRANDS.DETAIL(id), payload),

  deleteBrand: (id: string): Promise<ApiResponse<unknown>> =>
    apiClient.delete<ApiResponse<unknown>>(API_ENDPOINTS.BRANDS.DETAIL(id)),
};
