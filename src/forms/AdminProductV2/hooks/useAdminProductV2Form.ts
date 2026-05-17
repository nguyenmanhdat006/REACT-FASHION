import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import type { SelectOption } from '@/components/FormField';
import { useProducts } from '@/hooks/product/useProducts';
import { useAppSelector } from '@/store/hooks';
import type { Category } from '@/types/product/product';

import { BRAND_OPTIONS, CATEGORY_OPTIONS } from '../constants';
import {
  adminProductFormToCreateRequest,
  adminProductFormToUpdateRequest,
  productImagesFromProduct,
  productToAdminProductFormValues,
} from '../mapper';
import { adminProductSubmitSchema, emptyAdminProductFormValues } from '../schema';
import type { AdminProductV2FormMode, AdminProductV2FormValues } from '../types';
import { useAdminProductFormMedia } from './useAdminProductFormMedia';

function flattenCategories(nodes: Category[]): SelectOption[] {
  const out: SelectOption[] = [];
  const walk = (list: Category[]) => {
    for (const c of list) {
      out.push({ value: c.id, label: c.name });
      if (c.children?.length) walk(c.children);
    }
  };
  walk(nodes);
  return out;
}

export type UseAdminProductV2FormOptions = {
  mode: AdminProductV2FormMode;
  productId?: string;
  onSuccess?: () => void;
};

export function useAdminProductV2Form({
  mode,
  productId,
  onSuccess,
}: UseAdminProductV2FormOptions) {
  const readOnly = mode === 'read';
  const { loadMeta, createProduct, updateProduct, fetchProductById, clearDetail } = useProducts();
  const {
    activeItems: activeBrands,
    activeLoading: brandsMetaLoading,
    activeError: brandsMetaError,
  } = useAppSelector(s => s.brands);
  const {
    activeItems: activeCategories,
    activeLoading: categoriesMetaLoading,
    activeError: categoriesMetaError,
  } = useAppSelector(s => s.categories);
  const { productDetail, productDetailLoading } = useAppSelector(s => s.products);
  const metaLoading = brandsMetaLoading || categoriesMetaLoading;
  const metaError = brandsMetaError ?? categoriesMetaError;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaSeed, setMediaSeed] = useState({ urls: [] as string[], coverIndex: 0 });

  const form = useForm<AdminProductV2FormValues>({
    resolver: zodResolver(adminProductSubmitSchema),
    defaultValues: emptyAdminProductFormValues(),
    mode: 'onSubmit',
  });

  const { register, control, handleSubmit, reset, formState: { errors } } = form;

  const media = useAdminProductFormMedia({
    readOnly,
    initialImageUrls: mediaSeed.urls,
    initialCoverIndex: mediaSeed.coverIndex,
  });

  useEffect(() => {
    void loadMeta();
  }, [loadMeta]);

  useEffect(() => {
    if (mode === 'create' || !productId) {
      clearDetail();
      reset(emptyAdminProductFormValues());
      setMediaSeed({ urls: [], coverIndex: 0 });
      return;
    }
    void fetchProductById(productId);
    return () => clearDetail();
  }, [mode, productId, fetchProductById, clearDetail, reset]);

  useEffect(() => {
    if (mode === 'create' || !productId || !productDetail || productDetail.id !== productId) {
      return;
    }
    reset(productToAdminProductFormValues(productDetail));
    const { imageUrls, coverIndex } = productImagesFromProduct(productDetail);
    setMediaSeed({ urls: imageUrls, coverIndex });
  }, [mode, productId, productDetail, reset]);

  const brandOptions = useMemo((): SelectOption[] => {
    if (activeBrands.length > 0) {
      return activeBrands.map(b => ({ value: b.id, label: b.name }));
    }
    if (metaError) return BRAND_OPTIONS;
    return [];
  }, [activeBrands, metaError]);

  const categoryOptions = useMemo((): SelectOption[] => {
    const fromApi = flattenCategories(activeCategories);
    if (fromApi.length > 0) return fromApi;
    if (metaError) return CATEGORY_OPTIONS;
    return [];
  }, [activeCategories, metaError]);

  const onSubmit = useCallback(
    async (values: AdminProductV2FormValues) => {
      if (readOnly) return;

      const mediaInput = {
        imageUrls: [...media.productImages],
        coverIndex: media.coverIndex,
      };

      setIsSubmitting(true);
      let ok = false;
      if (mode === 'update') {
        if (!productId) {
          toast.error('Product id is missing');
        } else {
          ok = await updateProduct(
            productId,
            adminProductFormToUpdateRequest(values, mediaInput)
          );
        }
      } else {
        ok = await createProduct(adminProductFormToCreateRequest(values, mediaInput));
      }
      setIsSubmitting(false);
      if (ok) onSuccess?.();
    },
    [
      readOnly,
      mode,
      productId,
      createProduct,
      updateProduct,
      media.productImages,
      media.coverIndex,
      onSuccess,
    ]
  );

  const busy =
    isSubmitting || metaLoading || productDetailLoading || media.uploadBusy;

  return {
    mode,
    readOnly,
    register,
    control,
    errors,
    handleSubmit: handleSubmit(onSubmit),
    brandOptions,
    categoryOptions,
    busy,
    media,
  };
}
