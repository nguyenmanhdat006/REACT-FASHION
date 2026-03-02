import { API_ENDPOINTS } from '@/constants';
import type { ApiResponse, PageResponse, PaginationParams } from '@/types/common';
import type { CreateOrderRequest, Order } from '@/types/order';
import apiClient from '@/utils/api';

export const orderService = {
  createOrder: async (payload: CreateOrderRequest): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>(
      API_ENDPOINTS.ORDERS.ROOT,
      payload
    );
    return response.data;
  },

  getOrders: async (params?: PaginationParams): Promise<PageResponse<Order>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Order>>>(
      API_ENDPOINTS.ORDERS.ROOT,
      { params }
    );
    return response.data;
  },

  getOrderById: async (id: string): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(
      API_ENDPOINTS.ORDERS.DETAIL(id)
    );
    return response.data;
  },

  getOrderByNumber: async (orderNumber: string): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(
      API_ENDPOINTS.ORDERS.NUMBER(orderNumber)
    );
    return response.data;
  },

  cancelOrder: async (id: string, reason: string): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>(
      API_ENDPOINTS.ORDERS.CANCEL(id),
      { reason }
    );
    return response.data;
  },
};
