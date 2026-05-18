import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import type { SelectOption } from '@/components/FormField';
import { useAdminCatalog } from '@/hooks/product/useAdminCatalog';
import { useAppSelector } from '@/store/hooks';
import type { Category } from '@/types/product/product';

import { ADMIN_CATEGORY_NO_PARENT } from '../constants';
import {
  adminCategoryFormToCreateRequest,
  adminCategoryFormToUpdateRequest,
  categoryToAdminCategoryFormValues,
} from '../mapper';
import { adminCategorySubmitSchema, emptyAdminCategoryFormValues } from '../schema';
import type { AdminCategoryV2FormMode, AdminCategoryV2FormValues } from '../types';

function flattenCategories(nodes: Category[], excludeId?: string): SelectOption[] {
  const out: SelectOption[] = [{ value: ADMIN_CATEGORY_NO_PARENT, label: 'None (root)' }];
  const walk = (list: Category[]) => {
    for (const c of list) {
      if (excludeId && c.id === excludeId) continue;
      out.push({ value: c.id, label: c.name });
      if (c.children?.length) walk(c.children);
    }
  };
  walk(nodes);
  return out;
}

export type UseAdminCategoryV2FormOptions = {
  mode: AdminCategoryV2FormMode;
  categoryId?: string;
  onSuccess?: () => void;
};

export function useAdminCategoryV2Form({
  mode,
  categoryId,
  onSuccess,
}: UseAdminCategoryV2FormOptions) {
  const {
    fetchCategories,
    fetchCategoryById,
    clearCategoryDetailState,
    createCategory,
    updateCategory,
  } = useAdminCatalog();
  const {
    items: categories,
    isLoading: categoriesLoading,
    categoryDetail,
    categoryDetailLoading,
  } = useAppSelector(s => s.categories);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AdminCategoryV2FormValues>({
    resolver: zodResolver(adminCategorySubmitSchema),
    defaultValues: emptyAdminCategoryFormValues(),
    mode: 'onSubmit',
  });

  const { register, control, handleSubmit, reset, formState: { errors } } = form;

  useEffect(() => {
    void fetchCategories({ page: 0, size: 200 });
  }, [fetchCategories]);

  useEffect(() => {
    if (mode === 'create' || !categoryId) {
      clearCategoryDetailState();
      reset(emptyAdminCategoryFormValues());
      return;
    }
    void fetchCategoryById(categoryId);
    return () => clearCategoryDetailState();
  }, [
    mode,
    categoryId,
    fetchCategoryById,
    clearCategoryDetailState,
    reset,
  ]);

  useEffect(() => {
    if (mode === 'create' || !categoryId || !categoryDetail || categoryDetail.id !== categoryId) {
      return;
    }
    reset(categoryToAdminCategoryFormValues(categoryDetail));
  }, [mode, categoryId, categoryDetail, reset]);

  const parentOptions = useMemo(
    () => flattenCategories(categories, categoryId),
    [categories, categoryId],
  );

  const onSubmit = useCallback(
    async (values: AdminCategoryV2FormValues) => {
      setIsSubmitting(true);
      let ok = false;
      if (mode === 'update') {
        if (!categoryId) {
          toast.error('Category id is missing');
        } else {
          ok = await updateCategory(categoryId, adminCategoryFormToUpdateRequest(values));
        }
      } else {
        ok = await createCategory(adminCategoryFormToCreateRequest(values));
      }
      setIsSubmitting(false);
      if (ok) onSuccess?.();
    },
    [mode, categoryId, createCategory, updateCategory, onSuccess],
  );

  const busy = isSubmitting || categoriesLoading || categoryDetailLoading;

  return {
    mode,
    register,
    control,
    errors,
    handleSubmit: handleSubmit(onSubmit),
    parentOptions,
    busy,
  };
}
