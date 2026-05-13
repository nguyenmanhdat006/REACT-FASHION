import { createSlice } from '@reduxjs/toolkit';
import type { Order } from '@/types/order/order';
import {
  cancelOrderThunk,
  createOrderThunk,
  fetchOrderByIdThunk,
  fetchOrdersThunk,
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
}

const initialState: OrdersState = {
  items: [],
  selectedOrder: null,
  page: 0,
  size: 20,
  totalElements: 0,
  totalPages: 0,
  isLoading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchOrdersThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrdersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data;
        const meta = action.payload.meta;
        if (meta) {
          state.page = meta.page;
          state.size = meta.size;
          state.totalElements = meta.totalElements;
          state.totalPages = meta.totalPages;
        }
      })
      .addCase(fetchOrdersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch orders';
      })
      .addCase(fetchOrderByIdThunk.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;
        state.items = [action.payload, ...state.items];
      })
      .addCase(cancelOrderThunk.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;
        state.items = state.items.map(order =>
          order.id === action.payload.id ? action.payload : order
        );
      });
  },
});

export default ordersSlice.reducer;
