import { createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from '@/services/order/orderService';
import type { CreateOrderRequest } from '@/types/order/order';
import type { PaginationParams } from '@/types/common/common';

const getErrorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } })?.response?.data
    ?.message || fallback;

export const fetchOrdersThunk = createAsyncThunk(
  'orders/fetchOrders',
  async (params: PaginationParams | undefined, { rejectWithValue }) => {
    try {
      return await orderService.getOrders(params);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch orders'));
    }
  }
);

export const fetchOrderByIdThunk = createAsyncThunk(
  'orders/fetchOrderById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await orderService.getOrderById(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch order'));
    }
  }
);

export const createOrderThunk = createAsyncThunk(
  'orders/createOrder',
  async (payload: CreateOrderRequest, { rejectWithValue }) => {
    try {
      return await orderService.createOrder(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to create order'));
    }
  }
);

export const cancelOrderThunk = createAsyncThunk(
  'orders/cancelOrder',
  async (payload: { id: string; reason: string }, { rejectWithValue }) => {
    try {
      return await orderService.cancelOrder(payload.id, payload.reason);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to cancel order'));
    }
  }
);
