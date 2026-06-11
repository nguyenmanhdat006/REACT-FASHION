import type { ApiResponse } from '@/types/common/common';
import type {
  ClearCacheResponse,
  DashboardStatsResponse,
  SalesChartResponse,
  TopProductsResponse,
} from '@/types/dashboard';
import { MOCK_PRODUCTS } from '@/mocks/product/productSeedData';

const timestamp = '2026-06-07T00:00:00.000Z';

const topProductsFromCatalog = MOCK_PRODUCTS.filter(product => product.featured)
  .slice(0, 5)
  .map((product, index) => ({
    productId: product.id,
    productName: product.name,
    size: index % 2 === 0 ? 'M' : 'L',
    imageUrl: product.images?.[0]?.imageUrl ?? '',
    price: Math.round((product.salePrice ?? product.price) * 1000),
    stock: product.stockQuantity ?? 0,
    category: product.category?.name ?? 'Fashion',
    totalSold: 28 - index * 3,
    totalRevenue: Math.round((product.salePrice ?? product.price) * 1000 * (28 - index * 3)),
  }));

export const MOCK_DASHBOARD_STATS: ApiResponse<DashboardStatsResponse> = {
  success: true,
  data: {
    totalPending: {
      title: 'Total Pending',
      value: 18,
      formattedValue: '18',
      percentageChange: 4.2,
      changeDirection: 'up',
      changeText: 'vs last month',
      icon: 'package',
      iconColor: 'text-orange-500',
    },
    totalSales: {
      title: 'Total Sales',
      value: 84500,
      formattedValue: '$84.5K',
      percentageChange: 6.8,
      changeDirection: 'up',
      changeText: 'vs last month',
      icon: 'line-chart',
      iconColor: 'text-blue-500',
    },
    totalOrders: {
      title: 'Total Orders',
      value: 240,
      formattedValue: '240',
      percentageChange: 5.1,
      changeDirection: 'up',
      changeText: 'vs last month',
      icon: 'shopping-cart',
      iconColor: 'text-yellow-500',
    },
    totalUsers: {
      title: 'Total Users',
      value: 80,
      formattedValue: '80',
      percentageChange: 15.1,
      changeDirection: 'up',
      changeText: 'vs last month',
      icon: 'users',
      iconColor: 'text-purple-500',
    },
  },
  meta: null,
  error: null,
  message: 'Mock dashboard stats',
  timestamp,
};

export const MOCK_DASHBOARD_SALES_CHART: ApiResponse<SalesChartResponse> = {
  success: true,
  data: {
    period: 'Jan 2026 - Dec 2026',
    totalSales: 84500,
    averageSales: 7042,
    data: [
      { date: '2026-01-01', label: 'Jan', sales: 4200, orderCount: 14 },
      { date: '2026-02-01', label: 'Feb', sales: 5100, orderCount: 16 },
      { date: '2026-03-01', label: 'Mar', sales: 5600, orderCount: 18 },
      { date: '2026-04-01', label: 'Apr', sales: 6100, orderCount: 20 },
      { date: '2026-05-01', label: 'May', sales: 6500, orderCount: 21 },
      { date: '2026-06-01', label: 'Jun', sales: 6900, orderCount: 22 },
      { date: '2026-07-01', label: 'Jul', sales: 7200, orderCount: 23 },
      { date: '2026-08-01', label: 'Aug', sales: 7600, orderCount: 24 },
      { date: '2026-09-01', label: 'Sep', sales: 8100, orderCount: 25 },
      { date: '2026-10-01', label: 'Oct', sales: 8500, orderCount: 26 },
      { date: '2026-11-01', label: 'Nov', sales: 9100, orderCount: 28 },
      { date: '2026-12-01', label: 'Dec', sales: 9400, orderCount: 29 },
    ],
  },
  meta: null,
  error: null,
  message: 'Mock sales chart',
  timestamp,
};

export const MOCK_DASHBOARD_TOP_PRODUCTS: ApiResponse<TopProductsResponse> = {
  success: true,
  data: {
    products: topProductsFromCatalog,
  },
  meta: null,
  error: null,
  message: 'Mock top products',
  timestamp,
};

export const MOCK_DASHBOARD_CLEAR_CACHE: ApiResponse<ClearCacheResponse> = {
  success: true,
  data: {
    message: 'Dashboard cache cleared in mock mode',
  },
  meta: null,
  error: null,
  message: 'Mock clear cache',
  timestamp,
};
