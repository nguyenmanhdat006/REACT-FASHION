import { useCallback } from 'react';
import toast from 'react-hot-toast';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  cancelOrderThunk,
  createOrderThunk,
  fetchOrderByIdThunk,
  fetchOrdersThunk,
} from '@/store/thunks/orderThunks';
import type { CreateOrderRequest, PaginationParams } from '@/types';

const payloadMessage = (payload: unknown, fallback: string) =>
  typeof payload === 'string' && payload ? payload : fallback;

export const useOrders = () => {
  const dispatch = useAppDispatch();
  const { items, selectedOrder, page, size, totalElements, totalPages, isLoading, error } =
    useAppSelector((state) => state.orders);

  const fetchOrders = useCallback(
    async (params?: PaginationParams) => {
      const result = await dispatch(
        fetchOrdersThunk(params || { page: 0, size: 20 })
      );
      if (fetchOrdersThunk.rejected.match(result)) {
        toast.error(payloadMessage(result.payload, 'Could not load orders'));
      }
      return result;
    },
    [dispatch]
  );

  const fetchOrderById = useCallback(
    async (id: string) => {
      const result = await dispatch(fetchOrderByIdThunk(id));
      if (fetchOrderByIdThunk.rejected.match(result)) {
        toast.error(payloadMessage(result.payload, 'Could not load order'));
      }
      return result;
    },
    [dispatch]
  );

  const createOrder = useCallback(
    async (payload: CreateOrderRequest): Promise<boolean> => {
      const result = await dispatch(createOrderThunk(payload));
      if (createOrderThunk.fulfilled.match(result)) {
        toast.success('Order created successfully');
        return true;
      }
      toast.error(payloadMessage(result.payload, 'Could not create order'));
      return false;
    },
    [dispatch]
  );

  const cancelOrder = useCallback(
    async (id: string, reason: string): Promise<boolean> => {
      const result = await dispatch(cancelOrderThunk({ id, reason }));
      if (cancelOrderThunk.fulfilled.match(result)) {
        toast.success('Order cancelled successfully');
        return true;
      }
      toast.error(payloadMessage(result.payload, 'Could not cancel order'));
      return false;
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
