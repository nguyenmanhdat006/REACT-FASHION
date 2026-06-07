import {
  MOCK_DASHBOARD_CLEAR_CACHE,
  MOCK_DASHBOARD_SALES_CHART,
  MOCK_DASHBOARD_STATS,
  MOCK_DASHBOARD_TOP_PRODUCTS,
} from '@/mocks/dashboard/dashboardMockData';
import type { ApiResponse } from '@/types/common/common';
import type {
  DashboardStatsResponse,
  SalesChartResponse,
  TopProductsResponse,
  ClearCacheResponse,
} from '@/types/dashboard';
export const dashboardService = {
  getStats: (): Promise<ApiResponse<DashboardStatsResponse>> =>
    // apiClient.get<ApiResponse<DashboardStatsResponse>>(API_ENDPOINTS.DASHBOARD.STATS)
    Promise.resolve(MOCK_DASHBOARD_STATS),

  getSalesChart: (
    year?: number,
    month?: number,
  ): Promise<ApiResponse<SalesChartResponse>> => {
    // apiClient.get<ApiResponse<SalesChartResponse>>(API_ENDPOINTS.DASHBOARD.SALES_CHART, {
    //   params: { year, month },
    // })
    void year;
    void month;
    return Promise.resolve(MOCK_DASHBOARD_SALES_CHART);
  },

  getTopProducts: (limit?: number): Promise<ApiResponse<TopProductsResponse>> =>
    // apiClient.get<ApiResponse<TopProductsResponse>>(API_ENDPOINTS.DASHBOARD.TOP_PRODUCTS, {
    //   params: { limit },
    // })
    Promise.resolve({
      ...MOCK_DASHBOARD_TOP_PRODUCTS,
      data: {
        products:
          typeof limit === 'number' && limit >= 0
            ? MOCK_DASHBOARD_TOP_PRODUCTS.data.products.slice(0, limit)
            : MOCK_DASHBOARD_TOP_PRODUCTS.data.products,
      },
    }),

  clearCache: (): Promise<ApiResponse<ClearCacheResponse>> =>
    // apiClient.post<ApiResponse<ClearCacheResponse>>(API_ENDPOINTS.DASHBOARD.CLEAR_CACHE)
    Promise.resolve(MOCK_DASHBOARD_CLEAR_CACHE),
};

export default dashboardService;
