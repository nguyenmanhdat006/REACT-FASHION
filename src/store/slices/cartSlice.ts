import { createSlice } from '@reduxjs/toolkit';

import {
  addToCartThunk,
  clearCartThunk,
  fetchCartThunk,
  removeCartItemThunk,
  updateCartItemThunk,
} from '@/store/thunks/cartThunks';
import type { Cart } from '@/types/cart/cart';

interface CartState {
  cart: Cart | null;
  itemsPage: number;
  itemsSize: number;
  itemsTotalElements: number;
  itemsTotalPages: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  itemsPage: 0,
  itemsSize: 20,
  itemsTotalElements: 0,
  itemsTotalPages: 0,
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCartThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCartThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        const { data, meta } = action.payload;
        state.cart = data;
        if (meta) {
          state.itemsPage = meta.page;
          state.itemsSize = meta.size;
          state.itemsTotalElements = meta.totalElements;
          state.itemsTotalPages = meta.totalPages;
        }
      })
      .addCase(fetchCartThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch cart';
        state.itemsTotalElements = 0;
        state.itemsTotalPages = 0;
      })
      .addCase(addToCartThunk.fulfilled, (state, action) => {
        const { data } = action.payload;
        state.cart = data;
      })
      .addCase(updateCartItemThunk.fulfilled, (state, action) => {
        const { data } = action.payload;
        state.cart = data;
      })
      .addCase(removeCartItemThunk.fulfilled, (state, action) => {
        const { data } = action.payload;
        state.cart = data;
      })
      .addCase(clearCartThunk.fulfilled, state => {
        if (state.cart) {
          state.cart.items = [];
          state.cart.totalItems = 0;
          state.cart.subtotal = 0;
          state.cart.discount = 0;
          state.cart.total = 0;
        }
        state.itemsTotalElements = 0;
        state.itemsTotalPages = 0;
      });
  },
});

export default cartSlice.reducer;
