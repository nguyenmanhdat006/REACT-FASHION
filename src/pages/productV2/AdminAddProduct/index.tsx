import { Helmet } from 'react-helmet-async';
import { useEffect, useMemo, useState, type JSX } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import type { SelectOption } from '@/components/FormField';
import { ROUTESV2 } from '@/constants';
import { useAdminAddProduct } from '@/hooks/product/useAdminAddProduct';
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
  const { loadMeta, createProduct } = useAdminAddProduct();
  const { activeBrands, activeCategories, metaLoading, metaError } = useAppSelector(
    s => s.products
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    void loadMeta();
  }, [loadMeta]);

  const brandOptions = useMemo((): SelectOption[] => {
    if (activeBrands.length > 0) {
      return activeBrands.map((b) => ({ value: b.id, label: b.name }));
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
      visible: true,
    },
  });

  const visible = watch('visible');

  const onSubmit = async (values: AdminAddProductFormValues) => {
    const parsed = adminAddProductSubmitSchema.safeParse(values);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      toast.error(first?.message ?? 'Validation failed');
      return;
    }
    setIsSubmitting(true);
    const ok = await createProduct(adminAddProductFormToCreateRequest(values));
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
          <AdminAddProductLeftSection control={control} visible={visible} />
          <AdminAddProductDetailsSection
            register={register}
            control={control}
            errors={errors}
            brandOptions={brandOptions}
            categoryOptions={categoryOptions}
            isSubmitting={isSubmitting || metaLoading}
          />
        </form>
      </div>
    </>
  );
}
