import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addToCartThunk,
  clearCartThunk,
  fetchCartThunk,
  removeCartItemThunk,
  updateCartItemThunk,
} from '@/store/thunks/cartThunks';
import type { AddToCartRequest } from '@/types/cart/cart';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const { cart, isLoading, error } = useAppSelector(state => state.cart);

  const fetchCart = useCallback(async () => {
    return dispatch(fetchCartThunk());
  }, [dispatch]);

  const addToCart = useCallback(
    async (payload: AddToCartRequest) => {
      return dispatch(addToCartThunk(payload));
    },
    [dispatch]
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      return dispatch(updateCartItemThunk({ itemId, quantity }));
    },
    [dispatch]
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      return dispatch(removeCartItemThunk(itemId));
    },
    [dispatch]
  );

  const clearCart = useCallback(async () => {
    return dispatch(clearCartThunk());
  }, [dispatch]);

  return {
    cart,
    isLoading,
    error,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };
};
