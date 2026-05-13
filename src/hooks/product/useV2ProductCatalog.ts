import { useCallback } from 'react';
import toast from 'react-hot-toast';

import { useAppDispatch } from '@/store/hooks';
import { fetchV2PublishedProductsThunk } from '@/store/thunks';

const payloadMessage = (payload: unknown, fallback: string) =>
  typeof payload === 'string' && payload ? payload : fallback;

export function useV2ProductCatalog() {
  const dispatch = useAppDispatch();

  const fetchHomePublished = useCallback(async () => {
    const result = await dispatch(fetchV2PublishedProductsThunk({ scope: 'home' }));
    if (fetchV2PublishedProductsThunk.rejected.match(result)) {
      toast.error(payloadMessage(result.payload, 'Could not load products'));
    }
  }, [dispatch]);

  const fetchExplorePublished = useCallback(async () => {
    const result = await dispatch(fetchV2PublishedProductsThunk({ scope: 'explore' }));
    if (fetchV2PublishedProductsThunk.rejected.match(result)) {
      toast.error(payloadMessage(result.payload, 'Could not load products'));
    }
  }, [dispatch]);

  return { fetchHomePublished, fetchExplorePublished };
}
