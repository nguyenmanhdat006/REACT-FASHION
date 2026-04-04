import { createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '@/services/cart/cartService';
import type { AddToCartRequest } from '@/types/cart/cart';

const getErrorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } })?.response?.data
    ?.message || fallback;

export const fetchCartThunk = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      return await cartService.getCart();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch cart'));
    }
  }
);

export const addToCartThunk = createAsyncThunk(
  'cart/addToCart',
  async (payload: AddToCartRequest, { rejectWithValue }) => {
    try {
      return await cartService.addToCart(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to add item'));
    }
  }
);

export const updateCartItemThunk = createAsyncThunk(
  'cart/updateCartItem',
  async (
    payload: { itemId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      return await cartService.updateQuantity(payload.itemId, {
        quantity: payload.quantity,
      });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to update item'));
    }
  }
);

export const removeCartItemThunk = createAsyncThunk(
  'cart/removeCartItem',
  async (itemId: string, { rejectWithValue }) => {
    try {
      return await cartService.removeItem(itemId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to remove item'));
    }
  }
);

export const clearCartThunk = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await cartService.clearCart();
      return true;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to clear cart'));
    }
  }
);
