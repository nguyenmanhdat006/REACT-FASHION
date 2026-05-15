import { useEffect, useMemo, useState, type JSX } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

import { ShippingInformationSection } from './sections/ShippingInformationSection';
import { ReviewCartSection } from './sections/ReviewCartSection';
import {
  shippingInfoSchema,
  emptyShippingInfo,
  type ShippingInfoFormValues,
} from './checkoutForm';
import { useCart } from '@/hooks/cart/useCart';
import { useAppDispatch } from '@/store/hooks';
import { createOrderThunk } from '@/store/thunks';
import { PaymentMethod } from '@/types/order/order';
import { ROUTESV2 } from '@/constants';
import type { CartSummary } from '@/types/cart/cart';
import { cartService } from '@/services/cart/cartService';

export default function CheckoutV2(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { cart, fetchCart, isLoading } = useCart();
  const [summary, setSummary] = useState<CartSummary | null>(null);

  const form = useForm<ShippingInfoFormValues>({
    resolver: zodResolver(shippingInfoSchema),
    defaultValues: emptyShippingInfo(),
    mode: 'onSubmit',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    void fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    const loadSummary = async () => {
      const res = await cartService.getSummary();
      if (res.success && res.data) {
        setSummary(res.data);
      }
    };

    void loadSummary();
  }, []);

  const items = useMemo(
    () =>
      (cart?.items ?? []).map(item => ({
        id: item.id,
        title: item.productName,
        price: item.price,
        quantity: item.quantity,
        imageSrc: item.productImageUrl,
      })),
    [cart]
  );

  const onSubmit = async (data: ShippingInfoFormValues) => {
    const result = await dispatch(
      createOrderThunk({
        paymentMethod: PaymentMethod.CASH_ON_DELIVERY,
        shippingAddress: {
          fullName: data.fullName.trim(),
          phone: data.phone.trim(),
          addressLine1: data.streetAddress.trim(),
          city: data.city.trim(),
          district: data.district.trim() || undefined,
          postalCode: data.zipCode.trim() || undefined,
          country: data.country.trim(),
          addressType: 'SHIPPING',
        },
      })
    );

    if (createOrderThunk.fulfilled.match(result)) {
      navigate(ROUTESV2.ORDERS);
    }
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
            <div className="flex-1 min-w-0">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <ShippingInformationSection form={form} />
              </div>
            </div>

            <div className="w-full lg:max-w-[380px] lg:shrink-0">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <ReviewCartSection
                  items={items}
                  summary={summary}
                  isLoading={isLoading}
                  isSubmitting={isSubmitting}
                />
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
