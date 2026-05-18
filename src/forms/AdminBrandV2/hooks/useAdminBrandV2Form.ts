import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { useAdminCatalog } from '@/hooks/product/useAdminCatalog';
import { useAppSelector } from '@/store/hooks';

import {
  adminBrandFormToCreateRequest,
  adminBrandFormToUpdateRequest,
  brandToAdminBrandFormValues,
} from '../mapper';
import { adminBrandSubmitSchema, emptyAdminBrandFormValues } from '../schema';
import type { AdminBrandV2FormMode, AdminBrandV2FormValues } from '../types';

export type UseAdminBrandV2FormOptions = {
  mode: AdminBrandV2FormMode;
  brandId?: string;
  onSuccess?: () => void;
};

export function useAdminBrandV2Form({
  mode,
  brandId,
  onSuccess,
}: UseAdminBrandV2FormOptions) {
  const {
    fetchBrandById,
    clearBrandDetailState,
    createBrand,
    updateBrand,
  } = useAdminCatalog();
  const { brandDetail, brandDetailLoading } = useAppSelector(s => s.brands);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AdminBrandV2FormValues>({
    resolver: zodResolver(adminBrandSubmitSchema),
    defaultValues: emptyAdminBrandFormValues(),
    mode: 'onSubmit',
  });

  const { register, control, handleSubmit, reset, formState: { errors } } = form;

  useEffect(() => {
    if (mode === 'create' || !brandId) {
      clearBrandDetailState();
      reset(emptyAdminBrandFormValues());
      return;
    }
    void fetchBrandById(brandId);
  }, [mode, brandId, fetchBrandById, clearBrandDetailState, reset]);

  useEffect(() => {
    if (mode === 'create' || !brandId || !brandDetail || brandDetail.id !== brandId) {
      return;
    }
    reset(brandToAdminBrandFormValues(brandDetail));
  }, [mode, brandId, brandDetail, reset]);

  const onSubmit = useCallback(
    async (values: AdminBrandV2FormValues) => {
      setIsSubmitting(true);
      let ok = false;
      if (mode === 'update') {
        if (!brandId) {
          toast.error('Brand id is missing');
        } else {
          ok = await updateBrand(brandId, adminBrandFormToUpdateRequest(values));
        }
      } else {
        ok = await createBrand(adminBrandFormToCreateRequest(values));
      }
      setIsSubmitting(false);
      if (ok) onSuccess?.();
    },
    [mode, brandId, createBrand, updateBrand, onSuccess],
  );

  const busy = isSubmitting || brandDetailLoading;

  return {
    mode,
    register,
    control,
    errors,
    handleSubmit: handleSubmit(onSubmit),
    busy,
  };
}
