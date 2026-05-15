import { useCallback } from 'react';
import toast from 'react-hot-toast';

import { useAppDispatch } from '@/store/hooks';
import {
  createBrandThunk,
  createCategoryThunk,
  deleteBrandThunk,
  deleteCategoryThunk,
  fetchBrandsThunk,
  fetchCategoriesThunk,
} from '@/store/thunks';
import type { BrandPayload, CategoryPayload } from '@/types/product/product';

const payloadMessage = (payload: unknown, fallback: string) =>
  typeof payload === 'string' && payload ? payload : fallback;

export function useAdminCatalog() {
  const dispatch = useAppDispatch();

  const fetchCategories = useCallback(async () => {
    const result = await dispatch(fetchCategoriesThunk());
    if (fetchCategoriesThunk.rejected.match(result)) {
      toast.error(payloadMessage(result.payload, 'Could not load categories'));
    }
  }, [dispatch]);

  const fetchBrands = useCallback(async () => {
    const result = await dispatch(fetchBrandsThunk());
    if (fetchBrandsThunk.rejected.match(result)) {
      toast.error(payloadMessage(result.payload, 'Could not load brands'));
    }
  }, [dispatch]);

  const createCategory = useCallback(
    async (payload: CategoryPayload): Promise<boolean> => {
      const result = await dispatch(createCategoryThunk(payload));
      if (createCategoryThunk.fulfilled.match(result)) {
        toast.success('Category created');
        await dispatch(fetchCategoriesThunk());
        return true;
      }
      toast.error(payloadMessage(result.payload, 'Could not create category'));
      return false;
    },
    [dispatch],
  );

  const deleteCategory = useCallback(
    async (id: string): Promise<boolean> => {
      const result = await dispatch(deleteCategoryThunk(id));
      if (deleteCategoryThunk.fulfilled.match(result)) {
        toast.success('Category deleted');
        await dispatch(fetchCategoriesThunk());
        return true;
      }
      toast.error(payloadMessage(result.payload, 'Could not delete category'));
      return false;
    },
    [dispatch],
  );

  const createBrand = useCallback(
    async (payload: BrandPayload): Promise<boolean> => {
      const result = await dispatch(createBrandThunk(payload));
      if (createBrandThunk.fulfilled.match(result)) {
        toast.success('Brand created');
        await dispatch(fetchBrandsThunk());
        return true;
      }
      toast.error(payloadMessage(result.payload, 'Could not create brand'));
      return false;
    },
    [dispatch],
  );

  const deleteBrand = useCallback(
    async (id: string): Promise<boolean> => {
      const result = await dispatch(deleteBrandThunk(id));
      if (deleteBrandThunk.fulfilled.match(result)) {
        toast.success('Brand deleted');
        await dispatch(fetchBrandsThunk());
        return true;
      }
      toast.error(payloadMessage(result.payload, 'Could not delete brand'));
      return false;
    },
    [dispatch],
  );

  return {
    fetchCategories,
    fetchBrands,
    createCategory,
    deleteCategory,
    createBrand,
    deleteBrand,
  };
}
