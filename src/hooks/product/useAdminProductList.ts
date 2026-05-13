import { useCallback } from 'react';
import toast from 'react-hot-toast';

import { useAppDispatch } from '@/store/hooks';
import { deleteProductThunk, fetchProductsThunk } from '@/store/thunks';
import type { ProductFilters } from '@/types/product/product';

const payloadMessage = (payload: unknown, fallback: string) =>
  typeof payload === 'string' && payload ? payload : fallback;

export function useAdminProductList() {
  const dispatch = useAppDispatch();

  const fetchProductsPage = useCallback(
    async (filters: ProductFilters) => {
      const result = await dispatch(fetchProductsThunk(filters));
      if (fetchProductsThunk.rejected.match(result)) {
        toast.error(payloadMessage(result.payload, 'Could not load products'));
      }
    },
    [dispatch]
  );

  const deleteProduct = useCallback(
    async (id: string, refetchFilters: ProductFilters): Promise<boolean> => {
      const result = await dispatch(deleteProductThunk(id));
      if (deleteProductThunk.fulfilled.match(result)) {
        toast.success('Product deleted');
        await dispatch(fetchProductsThunk(refetchFilters));
        return true;
      }
      toast.error(payloadMessage(result.payload, 'Could not delete product'));
      return false;
    },
    [dispatch]
  );

  return { fetchProductsPage, deleteProduct };
}
