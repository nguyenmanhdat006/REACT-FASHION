import { createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from '@/services/order/orderService';
import type { CreateOrderRequest } from '@/types/order/order';
import type { ApiResponse, PageMeta, PaginationParams } from '@/types/common/common';
import type { Order } from '@/types/order/order';
import { apiFailureMessage } from '@/utils/apiEnvelope';

const getErrorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
  fallback;

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

export const cancelOrderThunk = createAsyncThunk<
  ApiResponse<Order>,
  { id: string; reason: string },
  { rejectValue: string }
>('orders/cancelOrder', async (payload, { rejectWithValue }) => {
  try {
    const res = await orderService.cancelOrder(payload.id, payload.reason);
    if (!res.success || res.data === undefined || res.data === null) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to cancel order'));
  }
});
