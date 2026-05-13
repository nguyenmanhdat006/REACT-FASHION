import { API_ENDPOINTS } from '@/constants';
import type { ApiResponse } from '@/types/common/common';
import type {
  ConfirmPaymentRequest,
  CreatePaymentRequest,
  PaymentIntent,
} from '@/types/payment/payment';
import apiClient from '@/utils/api';

export const paymentService = {
  createPayment: (payload: CreatePaymentRequest): Promise<ApiResponse<PaymentIntent>> =>
    apiClient.post<ApiResponse<PaymentIntent>>(API_ENDPOINTS.PAYMENTS.ROOT, payload),

  confirmPayment: (
    paymentId: string,
    payload: ConfirmPaymentRequest
  ): Promise<ApiResponse<PaymentIntent>> =>
    apiClient.post<ApiResponse<PaymentIntent>>(
      API_ENDPOINTS.PAYMENTS.CONFIRM(paymentId),
      payload
    ),

  getPaymentById: (id: string): Promise<ApiResponse<PaymentIntent>> =>
    apiClient.get<ApiResponse<PaymentIntent>>(API_ENDPOINTS.PAYMENTS.DETAIL(id)),

  getPaymentByOrder: (orderId: string): Promise<ApiResponse<PaymentIntent>> =>
    apiClient.get<ApiResponse<PaymentIntent>>(API_ENDPOINTS.PAYMENTS.BY_ORDER(orderId)),
};
