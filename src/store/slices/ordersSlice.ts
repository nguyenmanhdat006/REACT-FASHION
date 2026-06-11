import { createSlice } from '@reduxjs/toolkit';
import type { Order } from '@/types/order/order';
import type { ShippingFeeResponse } from '@/services/shipping/shippingService';
import {
  cancelOrderThunk,
  createOrderThunk,
  fetchOrderByIdThunk,
  fetchMyOrdersThunk,
  fetchAdminOrdersThunk,
  confirmOrderPaymentThunk,
  markOrderDeliveredThunk,
  calculateShippingFeeThunk,
} from '@/store/thunks/orderThunks';

interface OrdersState {
  items: Order[];
  selectedOrder: Order | null;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  /** Shipping fee fetched from Shipping Service during checkout */
  shippingFee: number | null;
  /** Estimated delivery days from Shipping Service */
  estimatedDays: number | null;
  isCalculatingShipping: boolean;
}

const initialState: OrdersState = {
  items: [],
  selectedOrder: null,
  page: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,
  isLoading: false,
  error: null,
  shippingFee: null,
  estimatedDays: null,
  isCalculatingShipping: false,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearShippingFee: state => {
      state.shippingFee = null;
      state.estimatedDays = null;
    },
  },
  extraReducers: builder => {
    builder
      // ── fetchMyOrders / fetchAdminOrders ─────────────────────────────────────
      .addCase(fetchMyOrdersThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyOrdersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const { data, meta } = action.payload;
        state.items = Array.isArray(data) ? data : [];
        if (meta) {
          state.page = meta.page;
          state.size = meta.size;
          state.totalElements = meta.totalElements;
          state.totalPages = meta.totalPages;
        }
      })
      .addCase(fetchMyOrdersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch orders';
      })
      .addCase(fetchAdminOrdersThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrdersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const { data, meta } = action.payload;
        state.items = Array.isArray(data) ? data : [];
        if (meta) {
          state.page = meta.page;
          state.size = meta.size;
          state.totalElements = meta.totalElements;
          state.totalPages = meta.totalPages;
        }
      })
      .addCase(fetchAdminOrdersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch admin orders';
      })

      // ── fetchOrderById ────────────────────────────────────────────────────────
      .addCase(fetchOrderByIdThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedOrder = action.payload.data;
      })
      .addCase(fetchOrderByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch order';
      })

      // ── createOrder ───────────────────────────────────────────────────────────
      .addCase(createOrderThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedOrder = action.payload.data;
        state.items = [action.payload.data, ...state.items];
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to create order';
      })

      // ── confirmOrderPayment ────────────────────────────────────────────────────
      .addCase(confirmOrderPaymentThunk.fulfilled, (state, action) => {
        const updated = action.payload.data;
        state.selectedOrder = updated;
        state.items = state.items.map(o => (o.id === updated.id ? updated : o));
      })

      // ── cancelOrder ───────────────────────────────────────────────────────────
      .addCase(cancelOrderThunk.fulfilled, (state, action) => {
        const updated = action.payload.data;
        state.selectedOrder = updated;
        state.items = state.items.map(o => (o.id === updated.id ? updated : o));
      })

      // ── markOrderDelivered ─────────────────────────────────────────────────────
      .addCase(markOrderDeliveredThunk.fulfilled, (state, action) => {
        const updated = action.payload.data;
        state.selectedOrder = updated;
        state.items = state.items.map(o => (o.id === updated.id ? updated : o));
      })

      // ── calculateShippingFee ───────────────────────────────────────────────────
      .addCase(calculateShippingFeeThunk.pending, state => {
        state.isCalculatingShipping = true;
      })
      .addCase(calculateShippingFeeThunk.fulfilled, (state, action) => {
        state.isCalculatingShipping = false;
        const result = action.payload.data as ShippingFeeResponse;
        state.shippingFee = result?.shippingFee ?? null;
        state.estimatedDays = result?.estimatedDays ?? null;
      })
      .addCase(calculateShippingFeeThunk.rejected, state => {
        state.isCalculatingShipping = false;
        state.shippingFee = null;
        state.estimatedDays = null;
      });
  },
});

export const { clearShippingFee } = ordersSlice.actions;
export default ordersSlice.reducer;
