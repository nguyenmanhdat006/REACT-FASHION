import { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Helmet } from 'react-helmet-async';

import {
  shippingInfoSchema,
  emptyShippingInfo,
  type ShippingInfoFormValues,
} from './checkoutForm';
import { ShippingInformationSection } from './sections/ShippingInformationSection';
import { ReviewCartSection } from './sections/ReviewCartSection';

const mockCartItems = [
  {
    id: 'item-1',
    title: 'Supper Skinny jogger in brown',
    size: 'XL',
    color: 'White',
    price: '$145',
    quantity: 3,
    imageSrc: '/frame-514.png',
  },
  {
    id: 'item-2',
    title: 'Supper Skinny jogger in brown',
    size: 'XL',
    color: 'White',
    price: '$145',
    quantity: 1,
    imageSrc: '/image.png',
  },
];

export default function CheckoutV2(): JSX.Element {
  const form = useForm<ShippingInfoFormValues>({
    resolver: zodResolver(shippingInfoSchema),
    defaultValues: emptyShippingInfo(),
    mode: 'onSubmit',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: ShippingInfoFormValues) => {
    console.log('Checkout payload:', data);
    // TODO: Call API to create order
  };

  return (
    <>
      <Helmet>
        <title>Checkout</title>
        <meta name="description" content="Checkout your order" />
      </Helmet>

      <main className="relative w-full bg-white px-4 py-6 sm:px-6">
        <div className="mx-auto w-full max-w-[1140px]">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            {/* Left: Shipping Information */}
            <div className="flex-1 min-w-0">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <ShippingInformationSection form={form} />
              </div>
            </div>

            {/* Right: Review Cart */}
            <div className="w-full lg:max-w-[380px] lg:shrink-0">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <ReviewCartSection
                  items={mockCartItems}
                  isSubmitting={isSubmitting}
                  onSubmit={() => handleSubmit(onSubmit)()}
                />
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
