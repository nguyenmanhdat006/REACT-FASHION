import { API_ENDPOINTS } from '@/constants';
import type { ApiResponse } from '@/types/common/common';
import type {
  DashboardStatsResponse,
  SalesChartResponse,
  TopProductsResponse,
  ClearCacheResponse,
} from '@/types/dashboard';
import apiClient from '@/utils/api';

export const dashboardService = {
  getStats: (): Promise<ApiResponse<DashboardStatsResponse>> =>
    apiClient.get<ApiResponse<DashboardStatsResponse>>(API_ENDPOINTS.DASHBOARD.STATS),

  getSalesChart: (
    year?: number,
    month?: number,
  ): Promise<ApiResponse<SalesChartResponse>> =>
    apiClient.get<ApiResponse<SalesChartResponse>>(API_ENDPOINTS.DASHBOARD.SALES_CHART, {
      params: { year, month },
    }),

  getTopProducts: (limit?: number): Promise<ApiResponse<TopProductsResponse>> =>
    apiClient.get<ApiResponse<TopProductsResponse>>(API_ENDPOINTS.DASHBOARD.TOP_PRODUCTS, {
      params: { limit },
    }),

  clearCache: (): Promise<ApiResponse<ClearCacheResponse>> =>
    apiClient.post<ApiResponse<ClearCacheResponse>>(API_ENDPOINTS.DASHBOARD.CLEAR_CACHE),
};

export default dashboardService;
