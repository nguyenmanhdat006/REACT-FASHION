import { Controller, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';

import type { SelectOption } from '@/components/FormField';
import { FormField } from '@/components/FormField';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  BRAND_OPTIONS,
  CATEGORY_OPTIONS,
  STATUS_OPTIONS,
  SUBCATEGORY_OPTIONS,
} from '../constants';
import type { AdminAddProductFormValues } from '../types';

type AdminAddProductDetailsSectionProps = {
  register: UseFormRegister<AdminAddProductFormValues>;
  control: Control<AdminAddProductFormValues>;
  errors: FieldErrors<AdminAddProductFormValues>;
  brandOptions?: SelectOption[];
  categoryOptions?: SelectOption[];
  isSubmitting?: boolean;
};

export default function AdminAddProductDetailsSection({
  register,
  control,
  errors,
  brandOptions = BRAND_OPTIONS,
  categoryOptions = CATEGORY_OPTIONS,
  isSubmitting = false,
}: AdminAddProductDetailsSectionProps) {
  return (
    <div className="col-span-12 lg:col-span-6">
      <Card className="gap-4 overflow-hidden rounded-2xl bg-white p-4">
        <CardHeader className="p-0">
          <CardTitle className="text-h6-medium">Product Details</CardTitle>
          <CardDescription className="text-body-regular text-gray-500">
            Key info to describe & display your product.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-0">
          <FormField
            id="product-name"
            label="Product Name"
            type="text"
            placeholder="e.g. Natural Glow Face Moisturizer"
            register={register('name')}
            error={errors.name}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormField
                  variant="selection"
                  id="product-status"
                  label="Status"
                  placeholder="Choose product status"
                  options={STATUS_OPTIONS}
                  value={field.value}
                  onValueChange={field.onChange}
                  error={errors.status}
                />
              )}
            />
            <Controller
              name="brand"
              control={control}
              render={({ field }) => (
                <FormField
                  variant="selection"
                  id="product-brand"
                  label="Brand"
                  placeholder="Select the brand name"
                  options={brandOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  error={errors.brand}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <FormField
                  variant="selection"
                  id="product-category"
                  label="Category"
                  placeholder="Select category"
                  options={categoryOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  error={errors.category}
                />
              )}
            />
            <Controller
              name="subcategory"
              control={control}
              render={({ field }) => (
                <FormField
                  variant="selection"
                  id="product-subcategory"
                  label="Subcategory"
                  placeholder="Select subcategory"
                  options={SUBCATEGORY_OPTIONS}
                  value={field.value}
                  onValueChange={field.onChange}
                  error={errors.subcategory}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              id="product-price"
              label="Price"
              type="text"
              placeholder="e.g. $29.99"
              register={register('price')}
              error={errors.price}
            />
            <FormField
              id="product-discount"
              label="Discount"
              type="text"
              placeholder="e.g. 15%"
              register={register('discount')}
              error={errors.discount}
            />
          </div>

          <FormField
            variant="paragraph"
            id="product-description"
            label="Description"
            placeholder="Write description highlighting key benefits and features"
            register={register('description')}
            error={errors.description}
          />

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              className="h-12 rounded-2xl px-8 text-body-regular"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publishing…' : 'Publish'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
