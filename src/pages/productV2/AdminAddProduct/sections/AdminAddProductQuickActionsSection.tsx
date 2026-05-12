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

import type { AdminAddProductFormValues } from '../types';

type AdminAddProductQuickActionsSectionProps = {
  control: Control<AdminAddProductFormValues>;
  visible: boolean;
};

export default function AdminAddProductQuickActionsSection({
  control,
  visible,
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
        <CardContent className="flex flex-row flex-wrap items-center gap-3 px-5 py-5">
          <Controller
            name="visible"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
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
