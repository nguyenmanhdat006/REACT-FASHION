import { Helmet } from 'react-helmet-async';
import { useCallback, useEffect, useMemo, useState, type JSX } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import type { SelectOption } from '@/components/FormField';
import { ROUTESV2 } from '@/constants';
import { useStorage } from '@/hooks/storage/useStorage';
import { useProducts } from '@/hooks/product/useProducts';
import { useAppSelector } from '@/store/hooks';

import AdminAddProductDetailsSection from './sections/AdminAddProductDetailsSection';
import AdminAddProductLeftSection from './sections/AdminAddProductLeftSection';
import {
  adminAddProductFormToCreateRequest,
  adminAddProductSubmitSchema,
} from './adminAddProductPayload';
import { BRAND_OPTIONS, CATEGORY_OPTIONS } from './constants';
import type { AdminAddProductFormValues } from './types';
import type { Category } from '@/types/product/product';

export type { AdminAddProductFormValues };

const EMPTY_SLOTS: (string | null)[] = [null, null, null, null];

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

export default function AdminAddProduct(): JSX.Element {
  const navigate = useNavigate();
  const { loadMeta, createProduct } = useProducts();
  const { uploadFile, isUploading } = useStorage();
  const { activeBrands, activeCategories, metaLoading, metaError } = useAppSelector(
    s => s.products
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slotUrls, setSlotUrls] = useState<(string | null)[]>(() => [...EMPTY_SLOTS]);
  const [coverSlotIndex, setCoverSlotIndex] = useState(0);
  const [uploadingSlotIndex, setUploadingSlotIndex] = useState<number | null>(null);

  useEffect(() => {
    void loadMeta();
  }, [loadMeta]);

  const brandOptions = useMemo((): SelectOption[] => {
    if (activeBrands.length > 0) {
      return activeBrands.map(b => ({ value: b.id, label: b.name }));
    }
    if (metaError) {
      return BRAND_OPTIONS;
    }
    return [];
  }, [activeBrands, metaError]);

  const categoryOptions = useMemo((): SelectOption[] => {
    const fromApi = flattenCategories(activeCategories);
    if (fromApi.length > 0) return fromApi;
    if (metaError) {
      return CATEGORY_OPTIONS;
    }
    return [];
  }, [activeCategories, metaError]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AdminAddProductFormValues>({
    defaultValues: {
      name: '',
      status: '',
      brand: '',
      category: '',
      subcategory: '',
      price: '',
      discount: '',
      description: '',
      shortDescription: '',
      sku: '',
      stockQuantity: '',
      visible: true,
      featured: false,
    },
  });

  const visible = watch('visible');
  const featured = watch('featured');

  const handleFileForSlot = useCallback(
    async (slotIndex: number, file: File) => {
      if (!file.type.startsWith('image/')) {
        toast.error('Please choose an image file');
        return;
      }
      setUploadingSlotIndex(slotIndex);
      const result = await uploadFile(file);
      setUploadingSlotIndex(null);
      if (result?.url) {
        setSlotUrls(prev => {
          const next = [...prev];
          next[slotIndex] = result.url;
          return next;
        });
      }
    },
    [uploadFile]
  );

  const uploadBusy = isUploading || uploadingSlotIndex !== null;
  const formBusy = isSubmitting || metaLoading || uploadBusy;

  const onSubmit = async (values: AdminAddProductFormValues) => {
    const parsed = adminAddProductSubmitSchema.safeParse(values);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      toast.error(first?.message ?? 'Validation failed');
      return;
    }
    setIsSubmitting(true);
    const ok = await createProduct(
      adminAddProductFormToCreateRequest(values, {
        slotUrls: [...slotUrls],
        coverSlotIndex,
      })
    );
    setIsSubmitting(false);
    if (ok) {
      navigate(ROUTESV2.ADMIN_PRODUCTS);
    }
  };

  return (
    <>
      <Helmet>
        <title>Add product — Admin</title>
      </Helmet>

      <div className="w-full text-foreground">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-12 gap-4">
          <AdminAddProductLeftSection
            control={control}
            visible={visible}
            featured={featured}
            slotUrls={slotUrls}
            coverSlotIndex={coverSlotIndex}
            uploadingSlotIndex={uploadingSlotIndex}
            onFileForSlot={handleFileForSlot}
            onSetCoverSlot={setCoverSlotIndex}
          />
          <AdminAddProductDetailsSection
            register={register}
            control={control}
            errors={errors}
            brandOptions={brandOptions}
            categoryOptions={categoryOptions}
            isSubmitting={formBusy}
          />
        </form>
      </div>
    </>
  );
}
