import { JSX } from 'react';
import { Button } from '@/components/ui/button';
import type { CartSummary as ApiCartSummary } from '@/types/cart/cart';

type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  imageSrc: string;
};

type ReviewCartSectionProps = {
  items: CartItem[];
  summary: ApiCartSummary | null;
  isLoading?: boolean;
  isSubmitting?: boolean;
};

const formatMoney = (value: number | null | undefined): string => `$${value ?? 0}`;

export const ReviewCartSection = ({
  items,
  summary,
  isLoading = false,
  isSubmitting = false,
}: ReviewCartSectionProps): JSX.Element => {
  const subtotal = summary?.subtotal ?? items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = summary?.discount ?? 0;
  const total = summary?.total ?? Math.max(0, subtotal - discount);

  return (
    <div className="flex w-full flex-col items-start gap-6">
      <h2 className="text-h3-semi text-gray-900">Review Your Cart</h2>

      <div className="flex max-h-80 w-full flex-col items-start gap-3 overflow-y-auto">
        {isLoading ? (
          <p className="text-body-regular text-gray-600">Loading cart...</p>
        ) : items.length === 0 ? (
          <p className="text-body-regular text-gray-600">Your cart is empty.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex w-full items-start gap-3 border-b border-gray-200 pb-3 last:border-b-0"
            >
              <div
                className="relative h-20 w-20 shrink-0 rounded-lg bg-gray-200 bg-cover bg-center"
                style={{ backgroundImage: `url(${item.imageSrc})` }}
                aria-hidden="true"
              />

              <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
                <h3 className="line-clamp-1 text-body-medium text-gray-900">
                  {item.title}
                </h3>
                <div className="flex w-full items-center justify-between">
                  <span className="text-body-medium font-medium text-gray-900">
                    {formatMoney(item.price)}
                  </span>
                  <span className="text-caption-sm-regular text-gray-600">
                    ×{item.quantity}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex w-full flex-col items-start gap-3 border-t border-gray-200 pt-4">
        <div className="flex w-full items-center justify-between">
          <span className="text-body-regular text-gray-600">Subtotal</span>
          <span className="text-body-medium font-medium text-gray-900">
            {formatMoney(subtotal)}
          </span>
        </div>

        <div className="flex w-full items-center justify-between">
          <span className="text-body-regular text-gray-600">Discount</span>
          <span className="text-body-medium font-medium text-destructive">
            -{formatMoney(discount)}
          </span>
        </div>

        <div className="flex w-full items-center justify-between">
          <span className="text-body-regular text-gray-600">Delivery Fee</span>
          <span className="text-body-medium font-medium text-gray-900">
            {formatMoney(0)}
          </span>
        </div>

        <div className="flex w-full items-center justify-between border-t border-gray-200 pt-3">
          <span className="text-body-medium font-medium text-gray-900">Total</span>
          <span className="text-h4-semi text-gray-900">{formatMoney(total)}</span>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || isLoading}
        className="h-12 w-full rounded-3xl !bg-primary-600 text-body-medium font-medium text-white hover:!bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? 'Processing...' : 'Pay Now'}
      </Button>
    </div>
  );
};
