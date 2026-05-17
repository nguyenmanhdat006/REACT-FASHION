
import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { AUTH_ENDPOINTS } from '@/constants';
import type { ApiResponse, PageMeta, PaginationParams } from '@/types/common/common';
import type {
  CreateOrderRequest,
  Order,
  CancelOrderRequest,
} from '@/types/order/order';
import type { ConfirmPaymentRequest } from '@/types/payment/payment';
import { getAccessToken, getRefreshToken, setAuthTokens, clearAuthTokens } from '@/utils/authStorage';
import type { AuthResponse } from '@/types/auth/auth';

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

class OrderApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: '/api',
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Attach JWT for every request (Order Service requires auth)
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Handle 401 → refresh token
    this.client.interceptors.response.use(
      response => response,
      async error => {
        if (error.response?.status === 401) {
          const originalRequest = error.config as RetryConfig | undefined;
          const refreshToken = getRefreshToken();

          if (refreshToken && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
              const refreshResponse = await axios.post<ApiResponse<AuthResponse>>(
                `/api${AUTH_ENDPOINTS.REFRESH}`,
                { refreshToken }
              );
              const envelope = refreshResponse.data;
              if (!envelope.success || !envelope.data) {
                throw new Error('Refresh failed');
              }

              setAuthTokens(envelope.data.accessToken, envelope.data.refreshToken);
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${envelope.data.accessToken}`;
              }
              return this.client(originalRequest);
            } catch {
              clearAuthTokens();
              window.location.href = '/v2/login';
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  public async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get<T, AxiosResponse<T>>(url, config).then(r => r.data);
  }

  public async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.client.post<T, AxiosResponse<T>>(url, data, config).then(r => r.data);
  }

  public async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.client.put<T, AxiosResponse<T>>(url, data, config).then(r => r.data);
  }

  public async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.delete<T, AxiosResponse<T>>(url, config).then(r => r.data);
  }
}

const orderApiClient = new OrderApiClient();

/**
 * Normalize backend response: Order Service có thể trả về:
 *   1. ApiResponse<Order>  { success: true, data: {...} }
 *   2. Order trực tiếp     { id: "...", orderNumber: "...", ... }
 * Hàm này chuẩn hóa về dạng ApiResponse<Order>.
 */
function normalizeOrderResp(raw: unknown): ApiResponse<Order> {
  const r = raw as Record<string, unknown>;
  // Nếu đã là ApiResponse wrapper
  if (typeof r.success === 'boolean') {
    return raw as ApiResponse<Order>;
  }
  // Bare Order object (Spring trả 201 trực tiếp)
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
  // /my-orders trả về: { content, page, size, totalElements, totalPages, first, last, numberOfElements }
  // Spring Page chuẩn trả về: { content, number, size, totalElements, totalPages, first, last }
  const content = Array.isArray(r.content) ? (r.content as Order[]) : (Array.isArray(raw) ? (raw as Order[]) : []);
  // BE mới dùng field "page", Spring chuẩn dùng "number"
  const pageNum = typeof r.page === 'number' ? r.page : (typeof r.number === 'number' ? r.number : 0);
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
  /** POST /api/orders — Tạo đơn hàng mới (requires JWT, returns 201) */
  createOrder: async (payload: CreateOrderRequest): Promise<ApiResponse<Order>> => {
    const raw = await orderApiClient.post<unknown>('/orders', payload);
    return normalizeOrderResp(raw);
  },

  /** GET /api/orders/my-orders — Danh sách đơn hàng của user hiện tại (lấy userId từ JWT) */
  getOrders: async (params?: PaginationParams): Promise<ApiResponse<Order[], PageMeta>> => {
    const raw = await orderApiClient.get<unknown>('/orders/my-orders', { params });
    return normalizeOrderListResp(raw);
  },

  /** GET /api/orders/{id} — Chi tiết đơn hàng (UUID) */
  getOrderById: async (id: string): Promise<ApiResponse<Order>> => {
    const raw = await orderApiClient.get<unknown>(`/orders/${id}`);
    return normalizeOrderResp(raw);
  },

  /** GET /api/orders/number/{orderNumber} */
  getOrderByNumber: async (orderNumber: string): Promise<ApiResponse<Order>> => {
    const raw = await orderApiClient.get<unknown>(`/orders/number/${orderNumber}`);
    return normalizeOrderResp(raw);
  },

  /**
   * PUT /api/orders/{id}/payment-confirmed
   * FE calls after VNPAY redirect back to return URL.
   */
  confirmPayment: async (
    id: string,
    payload: ConfirmPaymentRequest
  ): Promise<ApiResponse<Order>> => {
    const raw = await orderApiClient.put<unknown>(`/orders/${id}/payment-confirmed`, payload);
    return normalizeOrderResp(raw);
  },

  /**
   * PUT /api/orders/{id}/status
   * General status update endpoint (e.g., to CANCELLED, PROCESSING, SHIPPED).
   */
  updateOrderStatus: async (id: string, status: string, notes?: string): Promise<ApiResponse<Order>> => {
    const body = { status, notes };
    const raw = await orderApiClient.put<unknown>(`/orders/${id}/status`, body);
    return normalizeOrderResp(raw);
  },

  /**
   * PUT /api/orders/{id}/status  (CANCELLED)
   * Only allowed when status is PENDING or CONFIRMED.
   */
  cancelOrder: async (id: string, notes?: string): Promise<ApiResponse<Order>> => {
    const body: CancelOrderRequest = { status: 'CANCELLED', notes };
    const raw = await orderApiClient.put<unknown>(`/orders/${id}/status`, body);
    return normalizeOrderResp(raw);
  },

  /**
   * PUT /api/orders/{id}/confirm
   * Manual confirmation (admin / for COD post-delivery).
   */
  confirmOrder: async (id: string): Promise<ApiResponse<Order>> => {
    const raw = await orderApiClient.put<unknown>(`/orders/${id}/confirm`);
    return normalizeOrderResp(raw);
  },

  markDelivered: async (id: string): Promise<ApiResponse<Order>> => {
    const raw = await orderApiClient.put<unknown>(`/orders/${id}/delivered`);
    return normalizeOrderResp(raw);
  },

  /**
   * PUT /api/orders/{id}/shipping-status
   * Keep shipping status in sync in order-service.
   */
  updateShippingStatus: async (id: string, status: string): Promise<ApiResponse<Order>> => {
    const raw = await orderApiClient.put<unknown>(`/orders/${id}/shipping-status`, { status });
    return normalizeOrderResp(raw);
  },
};
