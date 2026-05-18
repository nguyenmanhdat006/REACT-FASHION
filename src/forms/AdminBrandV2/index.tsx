import { Controller } from 'react-hook-form';
import { useEffect, type JSX } from 'react';

import { FormField } from '@/components/FormField';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

import type { AdminBrandV2FormMode } from './types';
import { useAdminBrandV2Form } from './hooks/useAdminBrandV2Form';

export const ADMIN_BRAND_V2_FORM_ID = 'admin-brand-v2-form';

export type AdminBrandV2FormProps = {
  mode: AdminBrandV2FormMode;
  brandId?: string;
  formId?: string;
  onSuccess?: () => void;
  onBusyChange?: (busy: boolean) => void;
  className?: string;
};

export default function AdminBrandV2Form({
  mode,
  brandId,
  formId = ADMIN_BRAND_V2_FORM_ID,
  onSuccess,
  onBusyChange,
  className,
}: AdminBrandV2FormProps): JSX.Element {
  const { register, control, errors, handleSubmit, busy } = useAdminBrandV2Form({
    mode,
    brandId,
    onSuccess,
  });

  useEffect(() => {
    onBusyChange?.(busy);
  }, [busy, onBusyChange]);

  const fieldsDisabled = busy;
  const nameRegister = register('name', fieldsDisabled ? { disabled: true } : undefined);
  const slugRegister = register('slug', fieldsDisabled ? { disabled: true } : undefined);
  const descRegister = register('description', fieldsDisabled ? { disabled: true } : undefined);
  const logoRegister = register('logoUrl', fieldsDisabled ? { disabled: true } : undefined);
  const websiteRegister = register('websiteUrl', fieldsDisabled ? { disabled: true } : undefined);

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      noValidate
      className={className ?? 'flex flex-col gap-4'}
    >
      <Card className="gap-4 overflow-hidden rounded-2xl bg-white p-4">
        <CardContent className="flex flex-col gap-4 p-0">
          <FormField
            id="brand-name"
            label="Name"
            type="text"
            placeholder="e.g. Acme"
            register={nameRegister}
            error={errors.name}
          />

          <FormField
            id="brand-slug"
            label="Slug"
            type="text"
            placeholder="e.g. acme"
            register={slugRegister}
            error={errors.slug}
          />

          <FormField
            variant="paragraph"
            id="brand-description"
            label="Description"
            placeholder="Optional description for this brand"
            register={descRegister}
            error={errors.description}
            rows={4}
          />

          <FormField
            id="brand-logo-url"
            label="Logo URL"
            type="text"
            placeholder="https://…"
            register={logoRegister}
            error={errors.logoUrl}
          />

          <FormField
            id="brand-website-url"
            label="Website"
            type="text"
            placeholder="https://…"
            register={websiteRegister}
            error={errors.websiteUrl}
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
                  id="brand-active"
                  aria-labelledby="brand-active-label"
                />
              )}
            />
            <label
              id="brand-active-label"
              htmlFor="brand-active"
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
