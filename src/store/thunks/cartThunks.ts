import { createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '@/services/cart/cartService';
import type { AddToCartRequest } from '@/types/cart/cart';
import type { ApiResponse } from '@/types/common/common';
import type { Cart } from '@/types/cart/cart';
import { apiFailureMessage } from '@/utils/apiEnvelope';

const getErrorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
  fallback;

export const fetchCartThunk = createAsyncThunk<
  ApiResponse<Cart>,
  void,
  { rejectValue: string }
>('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const res = await cartService.getCart();
    if (!res.success) return rejectWithValue(apiFailureMessage(res));
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch cart'));
  }
});

export const addToCartThunk = createAsyncThunk<
  ApiResponse<Cart>,
  AddToCartRequest,
  { rejectValue: string }
>('cart/addToCart', async (payload, { rejectWithValue }) => {
  try {
    const res = await cartService.addToCart(payload);
    if (!res.success) return rejectWithValue(apiFailureMessage(res));
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to add item'));
  }
});

export const updateCartItemThunk = createAsyncThunk<
  ApiResponse<Cart>,
  { itemId: string; quantity: number },
  { rejectValue: string }
>('cart/updateCartItem', async (payload, { rejectWithValue }) => {
  try {
    const res = await cartService.updateQuantity(payload.itemId, {
      quantity: payload.quantity,
    });
    if (!res.success) return rejectWithValue(apiFailureMessage(res));
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to update item'));
  }
});

export const removeCartItemThunk = createAsyncThunk<
  ApiResponse<Cart>,
  string,
  { rejectValue: string }
>('cart/removeCartItem', async (itemId, { rejectWithValue }) => {
  try {
    const res = await cartService.removeItem(itemId);
    if (!res.success) return rejectWithValue(apiFailureMessage(res));
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to remove item'));
  }
});

export const clearCartThunk = createAsyncThunk<
  ApiResponse<null>,
  void,
  { rejectValue: string }
>('cart/clearCart', async (_, { rejectWithValue }) => {
  try {
    await cartService.clearCart();
    return { success: true as const, data: null };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to clear cart'));
  }
});
