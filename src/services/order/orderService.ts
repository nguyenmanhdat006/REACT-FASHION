
import apiClient from '@/utils/api';
import type { ApiResponse, PageMeta, PaginationParams } from '@/types/common/common';
import { API_ENDPOINTS } from '@/constants';
import type {
  CreateOrderRequest,
  Order,
  CancelOrderRequest,
  OrderFilters,
} from '@/types/order/order';
import { toQueryParams } from '@/utils/queryParams';
import type { ConfirmPaymentRequest } from '@/types/payment/payment';

function normalizeOrderResp(raw: unknown): ApiResponse<Order> {
  const r = raw as Record<string, unknown>;
  if (typeof r.success === 'boolean') {
    return raw as ApiResponse<Order>;
  }

  return {
    success: true,
    data: raw as Order,
    error: null,
    message: null,
    timestamp: new Date().toISOString(),
  };
}

function normalizeOrderListResp(raw: unknown): ApiResponse<Order[], PageMeta> {
  const r = raw as Record<string, unknown>;
  if (typeof r.success === 'boolean') {
    return raw as ApiResponse<Order[], PageMeta>;
  }

  const content = Array.isArray(r.content)
    ? (r.content as Order[])
    : Array.isArray(raw)
    ? (raw as Order[])
    : [];

  const pageNum = typeof r.page === 'number' ? r.page : typeof r.number === 'number' ? r.number : 0;

  return {
    success: true,
    data: content,
    meta: {
      page: pageNum,
      size: typeof r.size === 'number' ? r.size : 10,
      totalElements: typeof r.totalElements === 'number' ? r.totalElements : content.length,
      totalPages: typeof r.totalPages === 'number' ? r.totalPages : 1,
      first: typeof r.first === 'boolean' ? r.first : true,
      last: typeof r.last === 'boolean' ? r.last : true,
    },
    error: null,
    message: null,
    timestamp: new Date().toISOString(),
  };
}

export const orderService = {
  createOrder: async (payload: CreateOrderRequest): Promise<ApiResponse<Order>> => {
    const raw = await apiClient.post<unknown>('/orders', payload);
    return normalizeOrderResp(raw);
  },

  /** Admin: all orders with optional filters (mirrors GET /api/products). */
  getOrders: async (filters?: OrderFilters): Promise<ApiResponse<Order[], PageMeta>> => {
    const raw = await apiClient.get<unknown>(API_ENDPOINTS.ORDERS.ROOT, {
      params: toQueryParams(filters),
    });
    return normalizeOrderListResp(raw);
  },

  /** User: current user's orders only. */
  getMyOrders: async (params?: PaginationParams): Promise<ApiResponse<Order[], PageMeta>> => {
    const raw = await apiClient.get<unknown>(API_ENDPOINTS.ORDERS.MY_ORDERS, { params });
    return normalizeOrderListResp(raw);
  },

  getOrderById: async (id: string): Promise<ApiResponse<Order>> => {
    const raw = await apiClient.get<unknown>(`/orders/${id}`);
    return normalizeOrderResp(raw);
  },

  getOrderByNumber: async (orderNumber: string): Promise<ApiResponse<Order>> => {
    const raw = await apiClient.get<unknown>(`/orders/number/${orderNumber}`);
    return normalizeOrderResp(raw);
  },

  confirmPayment: async (id: string, payload: ConfirmPaymentRequest): Promise<ApiResponse<Order>> => {
    const raw = await apiClient.put<unknown>(`/orders/${id}/payment-confirmed`, payload);
    return normalizeOrderResp(raw);
  },

  updateOrderStatus: async (id: string, status: string, notes?: string): Promise<ApiResponse<Order>> => {
    const body = { status, notes };
    const raw = await apiClient.put<unknown>(`/orders/${id}/status`, body);
    return normalizeOrderResp(raw);
  },

  cancelOrder: async (id: string, notes?: string): Promise<ApiResponse<Order>> => {
    const body: CancelOrderRequest = { status: 'CANCELLED', notes };
    const raw = await apiClient.put<unknown>(`/orders/${id}/status`, body);
    return normalizeOrderResp(raw);
  },

  confirmOrder: async (id: string): Promise<ApiResponse<Order>> => {
    const raw = await apiClient.put<unknown>(`/orders/${id}/confirm`);
    return normalizeOrderResp(raw);
  },

  markDelivered: async (id: string): Promise<ApiResponse<Order>> => {
    const raw = await apiClient.put<unknown>(`/orders/${id}/delivered`);
    return normalizeOrderResp(raw);
  },

  updateShippingStatus: async (id: string, status: string): Promise<ApiResponse<Order>> => {
    const raw = await apiClient.put<unknown>(`/orders/${id}/shipping-status`, { status });
    return normalizeOrderResp(raw);
  },
};

