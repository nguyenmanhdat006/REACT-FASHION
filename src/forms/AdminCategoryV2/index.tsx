import { Controller } from 'react-hook-form';
import { useEffect, type JSX } from 'react';

import { FormField } from '@/components/FormField';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

import type { AdminCategoryV2FormMode } from './types';
import { useAdminCategoryV2Form } from './hooks/useAdminCategoryV2Form';

export const ADMIN_CATEGORY_V2_FORM_ID = 'admin-category-v2-form';

export type AdminCategoryV2FormProps = {
  mode: AdminCategoryV2FormMode;
  categoryId?: string;
  formId?: string;
  onSuccess?: () => void;
  onBusyChange?: (busy: boolean) => void;
  className?: string;
};

export default function AdminCategoryV2Form({
  mode,
  categoryId,
  formId = ADMIN_CATEGORY_V2_FORM_ID,
  onSuccess,
  onBusyChange,
  className,
}: AdminCategoryV2FormProps): JSX.Element {
  const { register, control, errors, handleSubmit, parentOptions, busy } =
    useAdminCategoryV2Form({ mode, categoryId, onSuccess });

  useEffect(() => {
    onBusyChange?.(busy);
  }, [busy, onBusyChange]);

  const fieldsDisabled = busy;
  const nameRegister = register('name', fieldsDisabled ? { disabled: true } : undefined);
  const slugRegister = register('slug', fieldsDisabled ? { disabled: true } : undefined);
  const orderRegister = register('displayOrder', fieldsDisabled ? { disabled: true } : undefined);
  const descRegister = register('description', fieldsDisabled ? { disabled: true } : undefined);

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      noValidate
      className={className ?? 'flex flex-col gap-4'}
    >
      <Card className="gap-4 overflow-hidden rounded-2xl bg-white p-4">
        <CardHeader className="p-0">
          <CardTitle className="text-h6-medium">Category details</CardTitle>
          <CardDescription className="text-body-regular text-gray-500">
            Name, slug, hierarchy, and visibility for the catalog.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-0">
          <FormField
            id="category-name"
            label="Name"
            type="text"
            placeholder="e.g. Skincare"
            register={nameRegister}
            error={errors.name}
          />

          <FormField
            id="category-slug"
            label="Slug"
            type="text"
            placeholder="e.g. skincare"
            register={slugRegister}
            error={errors.slug}
          />

          <Controller
            name="parentId"
            control={control}
            render={({ field }) => (
              <FormField
                variant="selection"
                id="category-parent"
                label="Parent category"
                placeholder="Choose parent"
                options={parentOptions}
                value={field.value || parentOptions[0]?.value || ''}
                onValueChange={field.onChange}
                disabled={fieldsDisabled}
                error={errors.parentId}
              />
            )}
          />

          <FormField
            id="category-display-order"
            label="Display order"
            type="text"
            placeholder="0"
            register={orderRegister}
            error={errors.displayOrder}
          />

          <FormField
            variant="paragraph"
            id="category-description"
            label="Description"
            placeholder="Optional description for this category"
            register={descRegister}
            error={errors.description}
            rows={4}
          />

          <div className="flex flex-row flex-wrap items-center gap-3 border-t border-border pt-4">
            <Controller
              name="active"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={fieldsDisabled}
                  id="category-active"
                  aria-labelledby="category-active-label"
                />
              )}
            />
            <label
              id="category-active-label"
              htmlFor="category-active"
              className="cursor-pointer text-body-regular text-foreground"
            >
              Active
            </label>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
