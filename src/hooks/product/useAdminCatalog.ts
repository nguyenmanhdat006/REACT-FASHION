import { useCallback } from 'react';
import toast from 'react-hot-toast';

import { useAppDispatch } from '@/store/hooks';
import { clearCategoryDetail } from '@/store/slices/categoriesSlice';
import {
  createBrandThunk,
  createCategoryThunk,
  deleteBrandThunk,
  deleteCategoryThunk,
  fetchBrandsThunk,
  fetchCategoriesThunk,
  fetchCategoryByIdThunk,
  updateCategoryThunk,
} from '@/store/thunks';
import { DEFAULT_LIST_QUERY } from '@/types/common/common';
import type {
  BrandPayload,
  CategoryPayload,
  UpdateCategoryRequest,
} from '@/types/product/product';
import type { FetchBrandsParams } from '@/store/thunks/brandThunks';
import type { FetchCategoriesParams } from '@/store/thunks/categoryThunks';

const payloadMessage = (payload: unknown, fallback: string) =>
  typeof payload === 'string' && payload ? payload : fallback;

export function useAdminCatalog() {
  const dispatch = useAppDispatch();

  const fetchCategories = useCallback(
    async (params?: FetchCategoriesParams) => {
      const result = await dispatch(
        fetchCategoriesThunk({ ...DEFAULT_LIST_QUERY, ...params }),
      );
      if (fetchCategoriesThunk.rejected.match(result)) {
        toast.error(payloadMessage(result.payload, 'Could not load categories'));
      }
    },
    [dispatch],
  );

  const fetchBrands = useCallback(
    async (params?: FetchBrandsParams) => {
      const result = await dispatch(
        fetchBrandsThunk({ ...DEFAULT_LIST_QUERY, ...params }),
      );
      if (fetchBrandsThunk.rejected.match(result)) {
        toast.error(payloadMessage(result.payload, 'Could not load brands'));
      }
    },
    [dispatch],
  );

  const fetchCategoryById = useCallback(
    async (id: string) => {
      const result = await dispatch(fetchCategoryByIdThunk(id));
      if (fetchCategoryByIdThunk.rejected.match(result)) {
        toast.error(payloadMessage(result.payload, 'Could not load category'));
      }
    },
    [dispatch],
  );

  const clearCategoryDetailState = useCallback(() => {
    dispatch(clearCategoryDetail());
  }, [dispatch]);

  const createCategory = useCallback(
    async (payload: CategoryPayload): Promise<boolean> => {
      const result = await dispatch(createCategoryThunk(payload));
      if (createCategoryThunk.fulfilled.match(result)) {
        toast.success('Category created');
        return true;
      }
      toast.error(payloadMessage(result.payload, 'Could not create category'));
      return false;
    },
    [dispatch],
  );

  const updateCategory = useCallback(
    async (id: string, data: UpdateCategoryRequest): Promise<boolean> => {
      const result = await dispatch(updateCategoryThunk({ id, data }));
      if (updateCategoryThunk.fulfilled.match(result)) {
        toast.success('Category updated');
        return true;
      }
      toast.error(payloadMessage(result.payload, 'Could not update category'));
      return false;
    },
    [dispatch],
  );

  const deleteCategory = useCallback(
    async (id: string): Promise<boolean> => {
      const result = await dispatch(deleteCategoryThunk(id));
      if (deleteCategoryThunk.fulfilled.match(result)) {
        toast.success('Category deleted');
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
    fetchCategoryById,
    clearCategoryDetailState,
    createCategory,
    updateCategory,
    deleteCategory,
    createBrand,
    deleteBrand,
  };
}
