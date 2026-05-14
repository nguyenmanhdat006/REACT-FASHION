import { API_ENDPOINTS } from '@/constants';
import type { ApiResponse, PageMeta, PaginationParams } from '@/types/common/common';
import type { CreateOrderRequest, Order } from '@/types/order/order';
import apiClient from '@/utils/api';

export const orderService = {
  createOrder: (payload: CreateOrderRequest): Promise<ApiResponse<Order>> =>
    apiClient.post<ApiResponse<Order>>(API_ENDPOINTS.ORDERS.ROOT, payload),

  getOrders: (params?: PaginationParams): Promise<ApiResponse<Order[], PageMeta>> =>
    apiClient.get<ApiResponse<Order[], PageMeta>>(API_ENDPOINTS.ORDERS.ROOT, { params }),

  getOrderById: (id: string): Promise<ApiResponse<Order>> =>
    apiClient.get<ApiResponse<Order>>(API_ENDPOINTS.ORDERS.DETAIL(id)),

  getOrderByNumber: (orderNumber: string): Promise<ApiResponse<Order>> =>
    apiClient.get<ApiResponse<Order>>(API_ENDPOINTS.ORDERS.NUMBER(orderNumber)),

  cancelOrder: (id: string, reason: string): Promise<ApiResponse<Order>> =>
    apiClient.post<ApiResponse<Order>>(API_ENDPOINTS.ORDERS.CANCEL(id), { reason }),
};
