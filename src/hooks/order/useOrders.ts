import { useCallback } from 'react';
import toast from 'react-hot-toast';

import {
  cancelOrderThunk,
  fetchOrdersThunk,
} from '@/store/thunks';
import { useAppDispatch } from '@/store/hooks';
import type { PaginationParams } from '@/types/common/common';

const payloadMessage = (payload: unknown, fallback: string) =>
  typeof payload === 'string' && payload ? payload : fallback;

export function useOrders() {
  const dispatch = useAppDispatch();

  const fetchOrdersPage = useCallback(
    async (params: PaginationParams) => {
      const result = await dispatch(fetchOrdersThunk(params));
      if (fetchOrdersThunk.rejected.match(result)) {
        toast.error(payloadMessage(result.payload, 'Could not load orders'));
      }
    },
    [dispatch],
  );

  const cancelOrder = useCallback(
    async (
      id: string,
      reason: string,
      refetchParams: PaginationParams,
    ): Promise<boolean> => {
      const result = await dispatch(cancelOrderThunk({ id, reason }));
      if (cancelOrderThunk.fulfilled.match(result)) {
        toast.success('Order cancelled');
        await dispatch(fetchOrdersThunk(refetchParams));
        return true;
      }
      toast.error(payloadMessage(result.payload, 'Could not cancel order'));
      return false;
    },
    [dispatch],
  );

  return {
    fetchOrdersPage,
    cancelOrder,
  };
}
