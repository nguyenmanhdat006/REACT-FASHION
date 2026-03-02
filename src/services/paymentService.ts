import { API_ENDPOINTS } from '@/constants';
import type { ApiResponse } from '@/types/common';
import type {
  ConfirmPaymentRequest,
  CreatePaymentRequest,
  PaymentIntent,
} from '@/types/payment';
import apiClient from '@/utils/api';

export const paymentService = {
  createPayment: async (payload: CreatePaymentRequest): Promise<PaymentIntent> => {
    const response = await apiClient.post<ApiResponse<PaymentIntent>>(
      API_ENDPOINTS.PAYMENTS.ROOT,
      payload
    );
    return response.data;
  },

  confirmPayment: async (
    paymentId: string,
    payload: ConfirmPaymentRequest
  ): Promise<PaymentIntent> => {
    const response = await apiClient.post<ApiResponse<PaymentIntent>>(
      API_ENDPOINTS.PAYMENTS.CONFIRM(paymentId),
      payload
    );
    return response.data;
  },

  getPaymentById: async (id: string): Promise<PaymentIntent> => {
    const response = await apiClient.get<ApiResponse<PaymentIntent>>(
      API_ENDPOINTS.PAYMENTS.DETAIL(id)
    );
    return response.data;
  },

  getPaymentByOrder: async (orderId: string): Promise<PaymentIntent> => {
    const response = await apiClient.get<ApiResponse<PaymentIntent>>(
      API_ENDPOINTS.PAYMENTS.BY_ORDER(orderId)
    );
    return response.data;
  },
};
