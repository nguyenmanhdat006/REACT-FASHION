import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  cancelOrderThunk,
  createOrderThunk,
  fetchOrderByIdThunk,
  fetchOrdersThunk,
} from '@/store/thunks/orderThunks';
import type { CreateOrderRequest } from '@/types/order/order';
import type { PaginationParams } from '@/types/common/common';

export const useOrders = () => {
  const dispatch = useAppDispatch();
  const { items, selectedOrder, page, size, totalElements, totalPages, isLoading, error } =
    useAppSelector((state) => state.orders);

  const fetchOrders = useCallback(
    async (params?: PaginationParams) => {
      return dispatch(fetchOrdersThunk(params || { page: 0, size: 20 }));
    },
    [dispatch]
  );

  const fetchOrderById = useCallback(
    async (id: string) => {
      return dispatch(fetchOrderByIdThunk(id));
    },
    [dispatch]
  );

  const createOrder = useCallback(
    async (payload: CreateOrderRequest) => {
      return dispatch(createOrderThunk(payload));
    },
    [dispatch]
  );

  const cancelOrder = useCallback(
    async (id: string, reason: string) => {
      return dispatch(cancelOrderThunk({ id, reason }));
    },
    [dispatch]
  );

  return {
    items,
    selectedOrder,
    page,
    size,
    totalElements,
    totalPages,
    isLoading,
    error,
    fetchOrders,
    fetchOrderById,
    createOrder,
    cancelOrder,
  };
};
