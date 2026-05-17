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
import type { ListQueryParams } from '@/types/common/common';
import { DEFAULT_LIST_QUERY } from '@/types/common/common';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const { cart, isLoading, error, itemsPage, itemsSize, itemsTotalElements, itemsTotalPages } =
    useAppSelector(state => state.cart);

  const fetchCart = useCallback(
    async (params?: ListQueryParams) => {
      return dispatch(fetchCartThunk(params ?? DEFAULT_LIST_QUERY));
    },
    [dispatch],
  );

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
    itemsPage,
    itemsSize,
    itemsTotalElements,
    itemsTotalPages,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };
};
