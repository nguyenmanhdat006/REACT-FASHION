import { Controller, type Control } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

import type { ProductV2FormValues } from '@/forms/ProductV2/types';

type AdminAddProductQuickActionsSectionProps = {
  control: Control<ProductV2FormValues>;
  visible: boolean;
  featured: boolean;
  readOnly?: boolean;
};

export default function AdminAddProductQuickActionsSection({
  control,
  visible,
  featured,
  readOnly = false,
}: AdminAddProductQuickActionsSectionProps) {
  return (
    <>
      <Card className="gap-0 overflow-hidden rounded-2xl bg-white py-0 dark:bg-gray-800">
        <CardHeader className="px-5 py-4">
          <CardTitle className="text-h6-medium text-foreground">Visibility</CardTitle>
          <CardDescription className="text-body-regular text-gray-500">
            You can change the visibility of this product for customers
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 px-5 py-5">
          <div className="flex flex-row flex-wrap items-center gap-3">
            <Controller
              name="visible"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={readOnly}
                  id="product-visible"
                  aria-labelledby="product-visible-label"
                />
              )}
            />
            <label
              id="product-visible-label"
              htmlFor="product-visible"
              className="cursor-pointer text-body-regular text-foreground"
            >
              Visible
            </label>
            <span className="sr-only" aria-live="polite">
              {visible ? 'Product is visible' : 'Product is hidden'}
            </span>
          </div>
          <div className="flex flex-row flex-wrap items-center gap-3 border-t border-border pt-4">
            <Controller
              name="featured"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={readOnly}
                  id="product-featured"
                  aria-labelledby="product-featured-label"
                />
              )}
            />
            <label
              id="product-featured-label"
              htmlFor="product-featured"
              className="cursor-pointer text-body-regular text-foreground"
            >
              Featured
            </label>
            <span className="sr-only" aria-live="polite">
              {featured ? 'Product is featured' : 'Product is not featured'}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="gap-0 overflow-hidden rounded-2xl bg-white py-0 dark:bg-gray-800">
        <CardHeader className="px-5 py-4">
          <CardTitle className="text-h6-medium">Preview</CardTitle>
          <CardDescription className="text-body-regular text-gray-500">Want to see how your product will look like?</CardDescription>
        </CardHeader>
        <CardContent className="px-5 py-5">
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-2xl border-[1px] border-secondary-500 px-6 text-body-regular hover:bg-secondary-50 hover:text-secondary-800"
          >
            Preview
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
