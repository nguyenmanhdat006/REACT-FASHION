import { createSlice } from '@reduxjs/toolkit';
import type { Cart } from '@/types/cart/cart';
import {
  addToCartThunk,
  clearCartThunk,
  fetchCartThunk,
  removeCartItemThunk,
  updateCartItemThunk,
} from '@/store/thunks/cartThunks';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
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
        state.cart = action.payload;
      })
      .addCase(fetchCartThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch cart';
      })
      .addCase(addToCartThunk.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(updateCartItemThunk.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(removeCartItemThunk.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(clearCartThunk.fulfilled, state => {
        if (state.cart) {
          state.cart.items = [];
          state.cart.totalItems = 0;
          state.cart.subtotal = 0;
          state.cart.discount = 0;
          state.cart.total = 0;
        }
      });
  },
});

export default cartSlice.reducer;
