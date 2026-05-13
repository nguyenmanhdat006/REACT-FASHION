import { useCallback } from 'react';
import toast from 'react-hot-toast';

import { useAppDispatch } from '@/store/hooks';
import { clearProductDetail } from '@/store/slices/productsSlice';
import { fetchProductByIdThunk } from '@/store/thunks';

const payloadMessage = (payload: unknown, fallback: string) =>
  typeof payload === 'string' && payload ? payload : fallback;

export function useV2ProductDetail() {
  const dispatch = useAppDispatch();

  const fetchProductById = useCallback(
    async (id: string) => {
      const result = await dispatch(fetchProductByIdThunk(id));
      if (fetchProductByIdThunk.rejected.match(result)) {
        toast.error(payloadMessage(result.payload, 'Could not load product'));
      }
    },
    [dispatch]
  );

  const clearDetail = useCallback(() => {
    dispatch(clearProductDetail());
  }, [dispatch]);

  return { fetchProductById, clearDetail };
}
