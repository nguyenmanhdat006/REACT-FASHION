import { createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from '@/services/order/orderService';
import { shippingService } from '@/services/shipping/shippingService';
import type { CreateOrderRequest } from '@/types/order/order';
import type { ConfirmPaymentRequest } from '@/types/payment/payment';
import type { ShippingFeeRequest, ShippingFeeResponse } from '@/services/shipping/shippingService';
import type { ApiResponse, PageMeta, PaginationParams } from '@/types/common/common';
import type { Order } from '@/types/order/order';
import { apiFailureMessage } from '@/utils/apiEnvelope';

const getErrorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
  fallback;

// ─── Orders ───────────────────────────────────────────────────────────────────

export const fetchOrdersThunk = createAsyncThunk<
  ApiResponse<Order[], PageMeta>,
  PaginationParams | undefined,
  { rejectValue: string }
>('orders/fetchOrders', async (params, { rejectWithValue }) => {
  try {
    const res = await orderService.getOrders(params);
    if (!res.success) return rejectWithValue(apiFailureMessage(res));
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch orders'));
  }
});

export const fetchOrderByIdThunk = createAsyncThunk<
  ApiResponse<Order>,
  string,
  { rejectValue: string }
>('orders/fetchOrderById', async (id, { rejectWithValue }) => {
  try {
    const res = await orderService.getOrderById(id);
    if (!res.success || res.data === undefined || res.data === null) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch order'));
  }
});

/** POST /api/orders — Tạo đơn hàng mới */
export const createOrderThunk = createAsyncThunk<
  ApiResponse<Order>,
  CreateOrderRequest,
  { rejectValue: string }
>('orders/createOrder', async (payload, { rejectWithValue }) => {
  try {
    const res = await orderService.createOrder(payload);
    if (!res.success || res.data === undefined || res.data === null) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to create order'));
  }
});

/**
 * PUT /api/orders/{id}/payment-confirmed
 * FE calls after VNPAY redirects back successfully.
 */
export const confirmOrderPaymentThunk = createAsyncThunk<
  ApiResponse<Order>,
  { orderId: string; payload: ConfirmPaymentRequest },
  { rejectValue: string }
>('orders/confirmPayment', async ({ orderId, payload }, { rejectWithValue }) => {
  try {
    const res = await orderService.confirmPayment(orderId, payload);
    if (!res.success || res.data === undefined || res.data === null) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to confirm payment'));
  }
});

/**
 * PUT /api/orders/{id}/status → CANCELLED
 */
export const cancelOrderThunk = createAsyncThunk<
  ApiResponse<Order>,
  { id: string; notes?: string },
  { rejectValue: string }
>('orders/cancelOrder', async ({ id, notes }, { rejectWithValue }) => {
  try {
    const res = await orderService.cancelOrder(id, notes);
    if (!res.success || res.data === undefined || res.data === null) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to cancel order'));
  }
});

/**
 * PUT /api/orders/{id}/delivered
 * Marks order as delivered (for admin / shipper).
 * Order Service internally calls Payment Service to mark PAID (COD).
 */
export const markOrderDeliveredThunk = createAsyncThunk<
  ApiResponse<Order>,
  string,
  { rejectValue: string }
>('orders/markDelivered', async (orderId, { rejectWithValue }) => {
  try {
    const res = await orderService.markDelivered(orderId);
    if (!res.success || res.data === undefined || res.data === null) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to mark order as delivered'));
  }
});

// ─── Shipping ─────────────────────────────────────────────────────────────────

/**
 * POST /api/shipping/calculate-fee
 * Returns shipping fee & estimated days. Used in checkout to show live preview.
 */
export const calculateShippingFeeThunk = createAsyncThunk<
  ApiResponse<ShippingFeeResponse>,
  ShippingFeeRequest,
  { rejectValue: string }
>('orders/calculateShippingFee', async (payload, { rejectWithValue }) => {
  try {
    const res = await shippingService.calculateFee(payload);
    if (!res.success) return rejectWithValue(apiFailureMessage(res));
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to calculate shipping fee'));
  }
});
