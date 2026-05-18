import { useCallback } from 'react';
import toast from 'react-hot-toast';

import { useAppDispatch } from '@/store/hooks';
import { clearProductDetail } from '@/store/slices/productsSlice';
import {
  createProductThunk,
  deleteProductThunk,
  updateProductThunk,
  fetchBrandsThunk,
  fetchCategoriesThunk,
  fetchProductByIdThunk,
  fetchProductsThunk,
  fetchExploreProductsThunk,
  fetchV2PublishedProductsThunk,
} from '@/store/thunks';
import { DEFAULT_LIST_QUERY } from '@/types/common/common';
import type {
  CreateProductRequest,
  ProductFilters,
  UpdateProductRequest,
} from '@/types/product/product';

const payloadMessage = (payload: unknown, fallback: string) =>
  typeof payload === 'string' && payload ? payload : fallback;

export function useProducts() {
  const dispatch = useAppDispatch();

  const fetchHomePublished = useCallback(async () => {
    const result = await dispatch(fetchV2PublishedProductsThunk({ scope: 'home' }));
    if (fetchV2PublishedProductsThunk.rejected.match(result)) {
      toast.error(payloadMessage(result.payload, 'Could not load products'));
    }
  }, [dispatch]);

  const fetchExplorePublished = useCallback(async () => {
    const result = await dispatch(fetchExploreProductsThunk());
    if (fetchExploreProductsThunk.rejected.match(result)) {
      toast.error(payloadMessage(result.payload, 'Could not load products'));
    }
  }, [dispatch]);

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

  const loadMeta = useCallback(async () => {
    const [categoriesResult, brandsResult] = await Promise.all([
      dispatch(fetchCategoriesThunk({ ...DEFAULT_LIST_QUERY, activeOnly: true })),
      dispatch(fetchBrandsThunk({ ...DEFAULT_LIST_QUERY, activeOnly: true })),
    ]);
    if (fetchCategoriesThunk.rejected.match(categoriesResult)) {
      toast.error(payloadMessage(categoriesResult.payload, 'Could not load categories'));
    }
    if (fetchBrandsThunk.rejected.match(brandsResult)) {
      toast.error(payloadMessage(brandsResult.payload, 'Could not load brands'));
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

  const updateProduct = useCallback(
    async (id: string, payload: UpdateProductRequest): Promise<boolean> => {
      const result = await dispatch(updateProductThunk({ id, payload }));
      if (updateProductThunk.fulfilled.match(result)) {
        toast.success('Product updated');
        return true;
      }
      toast.error(payloadMessage(result.payload, 'Could not update product'));
      return false;
    },
    [dispatch]
  );

  return {
    fetchHomePublished,
    fetchExplorePublished,
    fetchProductById,
    clearDetail,
    fetchProductsPage,
    deleteProduct,
    loadMeta,
    createProduct,
    updateProduct,
  };
}
