import { useCallback } from 'react';
import toast from 'react-hot-toast';

import { useAppDispatch } from '@/store/hooks';
import { createProductThunk, fetchAdminProductMetaThunk } from '@/store/thunks';
import type { CreateProductRequest } from '@/types/product/product';

const payloadMessage = (payload: unknown, fallback: string) =>
  typeof payload === 'string' && payload ? payload : fallback;

export function useAdminAddProduct() {
  const dispatch = useAppDispatch();

  const loadMeta = useCallback(async () => {
    const result = await dispatch(fetchAdminProductMetaThunk());
    if (fetchAdminProductMetaThunk.rejected.match(result)) {
      toast.error(payloadMessage(result.payload, 'Could not load categories and brands'));
    }
  }, [dispatch]);

  const createProduct = useCallback(
    async (payload: CreateProductRequest): Promise<boolean> => {
      const result = await dispatch(createProductThunk(payload));
      if (createProductThunk.fulfilled.match(result)) {
        toast.success('Product created');
        return true;
      }
      toast.error(payloadMessage(result.payload, 'Could not create product'));
      return false;
    },
    [dispatch]
  );

  return { loadMeta, createProduct };
}
