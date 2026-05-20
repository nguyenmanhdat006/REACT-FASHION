export interface StatisticCard {
  title: string;
  value: number | null;
  formattedValue: string;
  percentageChange: number;
  changeDirection: 'up' | 'down';
  changeText: string;
  icon: string;
  iconColor: string;
}

export interface DashboardStatsResponse {
  totalPending: StatisticCard;
  totalSales: StatisticCard;
  totalOrders: StatisticCard;
  totalUsers: StatisticCard;
}

export interface SalesDataPoint {
  date: string;
  label: string;
  sales: number;
  orderCount: number;
}

export interface SalesChartResponse {
  data: SalesDataPoint[];
  period: string;
  totalSales: number;
  averageSales: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  size: string | null;
  imageUrl: string;
  price: number;
  stock: number;
  category: string;
  totalSold: number;
  totalRevenue: number;
}

export interface TopProductsResponse {
  products: TopProduct[];
}

export interface ClearCacheResponse {
  message: string;
}

export type { StatisticCard as DashboardStatisticCard };
