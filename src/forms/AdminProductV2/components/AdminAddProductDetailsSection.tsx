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
} from '@/forms/AdminProductV2/constants';
import type { AdminProductV2FormMode, AdminProductV2FormValues } from '@/forms/AdminProductV2/types';

const SUBMIT_LABEL: Record<Exclude<AdminProductV2FormMode, 'read'>, string> = {
  create: 'Publish',
  update: 'Save changes',
};

const SUBMIT_PENDING_LABEL: Record<Exclude<AdminProductV2FormMode, 'read'>, string> = {
  create: 'Publishing…',
  update: 'Saving…',
};

type AdminAddProductDetailsSectionProps = {
  mode?: AdminProductV2FormMode;
  register: UseFormRegister<AdminProductV2FormValues>;
  control: Control<AdminProductV2FormValues>;
  errors: FieldErrors<AdminProductV2FormValues>;
  brandOptions?: SelectOption[];
  categoryOptions?: SelectOption[];
  readOnly?: boolean;
  isSubmitting?: boolean;
};

export default function AdminAddProductDetailsSection({
  mode = 'create',
  register,
  control,
  errors,
  brandOptions = BRAND_OPTIONS,
  categoryOptions = CATEGORY_OPTIONS,
  readOnly = false,
  isSubmitting = false,
}: AdminAddProductDetailsSectionProps) {
  const fieldsDisabled = readOnly || isSubmitting;
  const nameRegister = register('name', readOnly ? { disabled: true } : undefined);
  const priceRegister = register('price', readOnly ? { disabled: true } : undefined);
  const discountRegister = register('discount', readOnly ? { disabled: true } : undefined);
  const skuRegister = register('sku', readOnly ? { disabled: true } : undefined);
  const stockRegister = register('stockQuantity', readOnly ? { disabled: true } : undefined);
  const shortDescRegister = register('shortDescription', readOnly ? { disabled: true } : undefined);
  const descRegister = register('description', readOnly ? { disabled: true } : undefined);
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
            register={nameRegister}
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
                  disabled={fieldsDisabled}
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
                  disabled={fieldsDisabled}
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
                  disabled={fieldsDisabled}
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
                  disabled={fieldsDisabled}
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
              register={priceRegister}
              error={errors.price}
            />
            <FormField
              id="product-discount"
              label="Discount"
              type="text"
              placeholder="e.g. 15%"
              register={discountRegister}
              error={errors.discount}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              id="product-sku"
              label="SKU"
              type="text"
              placeholder="Optional product SKU"
              register={skuRegister}
              error={errors.sku}
            />
            <FormField
              id="product-stock"
              label="Stock quantity"
              type="text"
              placeholder="e.g. 100"
              register={stockRegister}
              error={errors.stockQuantity}
            />
          </div>

          <FormField
            variant="paragraph"
            id="product-short-description"
            label="Short description"
            placeholder="One-line summary for listings (optional)"
            register={shortDescRegister}
            error={errors.shortDescription}
            rows={3}
          />

          <FormField
            variant="paragraph"
            id="product-description"
            label="Description"
            placeholder="Write description highlighting key benefits and features"
            register={descRegister}
            error={errors.description}
          />

          {!readOnly && mode !== 'read' ? (
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                className="h-12 rounded-2xl px-8 text-body-regular"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? SUBMIT_PENDING_LABEL[mode]
                  : SUBMIT_LABEL[mode]}
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
