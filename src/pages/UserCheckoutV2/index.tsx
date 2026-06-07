/**
 * UserCheckoutV2 — Full flow:
 *
 * 1. Load cart from server.
 * 2. When city/province changes → call POST /api/shipping/calculate-fee.
 * 3. On submit → POST /api/orders (includes items from cart + shippingAddress).
 * 4. If VNPAY: redirect window to paymentUrl.
 * 5. If COD: navigate to order detail page.
 */
import { useEffect, useMemo, useState, useCallback, type JSX } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { ShippingInformationSection } from './sections/ShippingInformationSection';
import { ReviewCartSection } from './sections/ReviewCartSection';
import {
  shippingInfoSchema,
  emptyShippingInfo,
  type ShippingInfoFormValues,
  toCreateOrderRequest,
} from './checkoutForm';
import { useCart } from '@/hooks/cart/useCart';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createOrderThunk, calculateShippingFeeThunk } from '@/store/thunks';
import { ROUTES } from '@/constants';
import type { CartSummary } from '@/types/cart/cart';
import { cartService } from '@/services/cart/cartService';
import { saveVnpayPendingOrderId } from '@/pages/VnpayReturnPage';

// Debounce helper
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function UserCheckoutV2(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { cart, fetchCart, isLoading } = useCart();
  const [summary, setSummary] = useState<CartSummary | null>(null);

  // Shipping fee state from Redux
  const shippingFee = useAppSelector(s => s.orders.shippingFee);
  const estimatedDays = useAppSelector(s => s.orders.estimatedDays);
  const isCalculatingShipping = useAppSelector(s => s.orders.isCalculatingShipping);

  const form = useForm<ShippingInfoFormValues>({
    resolver: zodResolver(shippingInfoSchema),
    defaultValues: emptyShippingInfo(),
    mode: 'onSubmit',
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  // Watch city & province to trigger shipping fee calculation
  const watchedCity = useWatch({ control, name: 'city' });
  const watchedProvince = useWatch({ control, name: 'province' });

  // Debounce to avoid spamming API on every keystroke
  const debouncedCity = useDebounce(watchedCity, 600);
  const debouncedProvince = useDebounce(watchedProvince, 600);

  // Load cart and summary
  useEffect(() => { void fetchCart(); }, [fetchCart]);

  useEffect(() => {
    void cartService.getSummary().then(res => {
      if (res.success && res.data) setSummary(res.data);
    });
  }, []);

  // Calculate total cart weight for shipping fee (fallback: 500g per item)
  const estimatedWeight = useMemo(() => {
    const itemCount = (cart?.items ?? []).reduce((sum, item) => sum + item.quantity, 0);
    return Math.max(500, itemCount * 500);
  }, [cart]);

  // Recalculate shipping fee whenever city/province changes
  useEffect(() => {
    const city = debouncedCity?.trim();
    const province = debouncedProvince?.trim();
    if (!city || !province) return;

    void dispatch(
      calculateShippingFeeThunk({
        city,
        province,
        weight: estimatedWeight,
        orderValue: summary?.subtotal ?? 0,
      })
    );
  }, [debouncedCity, debouncedProvince, estimatedWeight, summary?.subtotal, dispatch]);

  // Cart items mapped to CreateOrderItemRequest shape
  const cartOrderItems = useMemo(
    () =>
      (cart?.items ?? []).map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        productImageUrl: item.productImageUrl,
      })),
    [cart]
  );

  // Cart items for display in ReviewCartSection
  const displayItems = useMemo(
    () =>
      (cart?.items ?? []).map(item => ({
        id: item.id,
        title: item.productName,
        price: item.price,
        quantity: item.quantity,
        imageSrc: item.productImageUrl,
        size: 'XL', // Fallback as requested by design
        color: 'White', // Fallback as requested by design
      })),
    [cart]
  );

  const onSubmit = useCallback(async (data: ShippingInfoFormValues) => {
    if (cartOrderItems.length === 0) {
      toast.error('Cart is empty. Please add items before placing an order.');
      return;
    }

    const payload = toCreateOrderRequest(data, cartOrderItems);
    const result = await dispatch(createOrderThunk(payload));

    if (createOrderThunk.fulfilled.match(result)) {
      const order = result.payload.data;

      if (order?.paymentUrl) {
        // VNPAY: save orderId so VnpayReturnPage can confirm payment
        if (order.id) saveVnpayPendingOrderId(order.id);
        window.location.href = order.paymentUrl;
      } else {
        // COD: go to order list
        toast.success('Order placed successfully!');
        navigate(ROUTES.ORDERS);
      }
    } else {
      const errMsg =
        typeof result.payload === 'string'
          ? result.payload
          : 'Order failed. Please try again.';
      toast.error(errMsg);
    }
  }, [dispatch, navigate, cartOrderItems]);

  return (
    <>
      <Helmet>
        <title>Checkout — Cartify</title>
        <meta name="description" content="Complete your order" />
      </Helmet>

      <main className="relative w-full bg-gray-50 px-4 py-8 sm:px-8 min-h-screen">
        <div className="mx-auto w-full max-w-[1140px]">

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 lg:flex-row lg:gap-8"
          >
            {/* Left — Shipping info */}
            <div className="flex-1 min-w-0 w-full">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <ShippingInformationSection form={form} />
              </div>
            </div>

            {/* Right — Order summary */}
            <div className="w-full lg:w-[480px] lg:shrink-0">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <ReviewCartSection
                  items={displayItems}
                  summary={summary}
                  shippingFee={shippingFee}
                  estimatedDays={estimatedDays}
                  isLoading={isLoading}
                  isCalculatingShipping={isCalculatingShipping}
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
