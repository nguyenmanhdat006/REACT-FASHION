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

      <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="sr-only">Checkout</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-8 lg:gap-12">
            {/* Left: Shipping Information */}
            <div className="flex-1 min-w-0">
              <ShippingInformationSection form={form} />
            </div>

            {/* Right: Review Cart */}
            <div className="hidden lg:block lg:w-96">
              <ReviewCartSection
                items={mockCartItems}
                isSubmitting={isSubmitting}
                onSubmit={() => handleSubmit(onSubmit)()}
              />
            </div>

            {/* Mobile: Review Cart below */}
            <div className="lg:hidden w-full mt-8 pt-8 border-t border-gray-200">
              <ReviewCartSection
                items={mockCartItems}
                isSubmitting={isSubmitting}
                onSubmit={() => handleSubmit(onSubmit)()}
              />
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
