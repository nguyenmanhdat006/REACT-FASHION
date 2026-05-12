import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';

import AdminAddProductDetailsSection from './sections/AdminAddProductDetailsSection';
import AdminAddProductLeftSection from './sections/AdminAddProductLeftSection';
import type { AdminAddProductFormValues } from './types';

export type { AdminAddProductFormValues };

export default function AdminAddProduct() {
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

  return (
    <>
      <Helmet>
        <title>Add product — Admin</title>
      </Helmet>

      <div className="w-full text-foreground">
        <form
          onSubmit={handleSubmit(() => {
          })}
          className="grid grid-cols-12 gap-4"
        >
          <AdminAddProductLeftSection control={control} visible={visible} />
          <AdminAddProductDetailsSection
            register={register}
            control={control}
            errors={errors}
          />
        </form>
      </div>
    </>
  );
}
