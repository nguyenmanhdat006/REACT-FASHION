import { Helmet } from 'react-helmet-async';
import { Controller, useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';

import { FormField, type SelectOption } from '@/components/FormField';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { IMAGES } from '@/constants/images';
import { cn } from '@/lib/utils';

const STATUS_OPTIONS: SelectOption[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

const BRAND_OPTIONS: SelectOption[] = [
  { value: 'aura', label: 'Aura' },
  { value: 'northwind', label: 'Northwind' },
  { value: 'studio', label: 'Studio' },
];

const CATEGORY_OPTIONS: SelectOption[] = [
  { value: 'skincare', label: 'Skincare' },
  { value: 'makeup', label: 'Makeup' },
  { value: 'fragrance', label: 'Fragrance' },
];

const SUBCATEGORY_OPTIONS: SelectOption[] = [
  { value: 'moisturizers', label: 'Moisturizers' },
  { value: 'cleansers', label: 'Cleansers' },
  { value: 'serums', label: 'Serums' },
];

export type AdminAddProductFormValues = {
  name: string;
  status: string;
  brand: string;
  category: string;
  subcategory: string;
  price: string;
  discount: string;
  description: string;
  visible: boolean;
};

const COVER_IMAGE = IMAGES.PRODUCT_DEMO_1;
const GALLERY_IMAGES = [IMAGES.PRODUCT_DEMO_2, IMAGES.PRODUCT_DEMO_1, IMAGES.PRODUCT_DEMO_2];

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
          className="grid grid-cols-12 gap-6 lg:gap-8"
        >
          <div className="col-span-12 flex flex-col gap-6 lg:col-span-5">
            <Card className="gap-0 overflow-hidden rounded-2xl border border-gray-200 bg-white py-0 shadow-md dark:border-gray-700 dark:bg-gray-800">
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-2xl bg-muted sm:max-w-[48%]">
                    <img
                      src={COVER_IMAGE}
                      alt=""
                      className="size-full object-cover"
                    />
                    <Badge className="absolute left-3 top-3 rounded-md bg-primary text-primary-foreground">
                      Cover
                    </Badge>
                  </div>

                  <div className="grid flex-1 grid-cols-2 gap-2">
                    {GALLERY_IMAGES.map((src, index) => (
                      <div
                        key={`gallery-slot-${index}`}
                        className="aspect-square overflow-hidden rounded-xl bg-muted ring-1 ring-border"
                      >
                        <img src={src} alt="" className="size-full object-cover" />
                      </div>
                    ))}
                    <button
                      type="button"
                      className={cn(
                        'flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-primary-900 bg-primary/5 transition-colors hover:bg-primary/10',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                      )}
                      aria-label="Add gallery image"
                    >
                      <Plus className="size-8 text-primary-900" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="gap-0 overflow-hidden rounded-2xl border border-gray-200 bg-white py-0 shadow-md dark:border-gray-700 dark:bg-gray-800">
              <CardHeader className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">
                <CardTitle className="text-body-bold text-foreground">Visibility</CardTitle>
                <CardDescription>
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

            <Card className="gap-0 overflow-hidden rounded-2xl border border-gray-200 bg-white py-0 shadow-md dark:border-gray-700 dark:bg-gray-800">
              <CardHeader className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">
                <CardTitle className="text-body-bold text-foreground">Preview</CardTitle>
                <CardDescription>
                  Want to see how your product will look like?
                </CardDescription>
              </CardHeader>
              <CardContent className="px-5 py-5">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 rounded-2xl border-secondary-900 px-6 text-body-regular"
                >
                  Preview
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-12 lg:col-span-7">
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
                        options={BRAND_OPTIONS}
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
                        options={CATEGORY_OPTIONS}
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
                  >
                    Publish
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </>
  );
}
