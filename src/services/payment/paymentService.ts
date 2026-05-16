/**
 * Payment Service client — port 8085, context-path /api
 *
 * The Vite dev proxy maps /payment-api/** → http://localhost:8085/api/**
 * In production set VITE_PAYMENT_BASE_URL.
 *
 * NOTE: Payment Service currently does NOT require Auth headers.
 */
import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import { PAYMENT_BASE_URL } from '@/constants';
import type { ApiResponse } from '@/types/common/common';
import type {
  CreatePaymentRequest,
  PaymentResponse,
} from '@/types/payment/payment';

class PaymentApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: PAYMENT_BASE_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
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
}

const paymentApiClient = new PaymentApiClient();

export const paymentService = {
  /**
   * POST /api/payments/create
   * Called internally by Order Service; exposed here for admin / debugging.
   */
  createPayment: (payload: CreatePaymentRequest): Promise<ApiResponse<PaymentResponse>> =>
    paymentApiClient.post<ApiResponse<PaymentResponse>>('/payments/create', payload),

  /**
   * GET /api/payments/{id} — Lấy chi tiết giao dịch theo numeric ID
   */
  getPaymentById: (id: number | string): Promise<ApiResponse<PaymentResponse>> =>
    paymentApiClient.get<ApiResponse<PaymentResponse>>(`/payments/${id}`),

  /**
   * GET /api/payments/order/{orderNumber} — Lấy giao dịch theo mã đơn hàng
   * Note: orderNumber is the string like "ORD-20260516-0001", NOT the UUID.
   */
  getPaymentByOrderNumber: (orderNumber: string): Promise<ApiResponse<PaymentResponse>> =>
    paymentApiClient.get<ApiResponse<PaymentResponse>>(`/payments/order/${orderNumber}`),

  /**
   * PUT /api/payments/order/{orderNumber}/success
   * Marks payment as PAID (used internally by Order Service after COD delivery).
   * Exposed here for admin tools.
   */
  markOrderPaymentSuccess: (orderNumber: string): Promise<ApiResponse<PaymentResponse>> =>
    paymentApiClient.put<ApiResponse<PaymentResponse>>(
      `/payments/order/${orderNumber}/success`
    ),
};
