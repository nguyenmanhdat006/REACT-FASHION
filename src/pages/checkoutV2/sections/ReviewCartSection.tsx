import { JSX } from 'react';
import { Button } from '@/components/ui/button';
import type { CartSummary as ApiCartSummary } from '@/types/cart/cart';

type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  imageSrc: string;
  size?: string;
  color?: string;
};

type ReviewCartSectionProps = {
  items: CartItem[];
  summary: ApiCartSummary | null;
  shippingFee?: number | null;
  estimatedDays?: number | null;
  isLoading?: boolean;
  isCalculatingShipping?: boolean;
  isSubmitting?: boolean;
};

const formatUSD = (value: number | null | undefined): string => {
  if (value == null) return '—';
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

export const ReviewCartSection = ({
  items,
  summary,
  shippingFee,
  estimatedDays,
  isLoading = false,
  isCalculatingShipping = false,
  isSubmitting = false,
}: ReviewCartSectionProps): JSX.Element => {
  const subtotal = summary?.subtotal ?? items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = summary?.discount ?? 0;
  const resolvedShipping = shippingFee ?? 0;
  const total = subtotal - discount + resolvedShipping;

  return (
    <div className="flex w-full flex-col items-start gap-6">
      <h2 className="text-lg font-semibold text-gray-900">Review Your Cart</h2>

      {/* Cart Items */}
      <div className="flex max-h-80 w-full flex-col items-start gap-3 overflow-y-auto">
        {isLoading ? (
          <p className="text-body-regular text-gray-600">Loading cart...</p>
        ) : items.length === 0 ? (
          <p className="text-body-regular text-gray-600">Cart is empty.</p>
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
                <h3 className="line-clamp-1 text-body-medium font-medium text-gray-900">
                  {item.title}
                </h3>
                
                {(item.size || item.color) && (
                  <div className="flex flex-col text-caption-sm-regular text-gray-500">
                    {item.size && <span>Size: <span className="font-medium text-gray-600">{item.size}</span></span>}
                    {item.color && <span>Color: <span className="font-medium text-gray-600">{item.color}</span></span>}
                  </div>
                )}

                <div className="flex w-full items-center justify-between mt-2">
                  <span className="text-body-medium font-medium text-gray-900">
                    {formatUSD(item.price)}
                  </span>
                  <span className="text-body-medium font-medium text-gray-900">
                    x{item.quantity}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      <div className="flex w-full flex-col items-start gap-3 border-t border-gray-200 pt-4">
        <div className="flex w-full items-center justify-between">
          <span className="text-body-regular text-gray-600">Subtotal</span>
          <span className="text-body-medium font-medium text-gray-900">
            {formatUSD(subtotal)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex w-full items-center justify-between">
            <span className="text-body-regular text-gray-600">Discount</span>
            <span className="text-body-medium font-medium text-destructive">
              -{formatUSD(discount)}
            </span>
          </div>
        )}

        <div className="flex w-full items-center justify-between">
          <span className="text-body-regular text-gray-600">
            Delivery Fee
            {estimatedDays != null && (
              <span className="ml-1 text-caption-sm-regular text-gray-500">
                (estimated {estimatedDays} days)
              </span>
            )}
          </span>
          <span className="text-body-medium font-medium text-gray-900">
            {isCalculatingShipping ? (
              <span className="animate-pulse text-gray-400">Calculating...</span>
            ) : shippingFee != null ? (
              formatUSD(shippingFee)
            ) : (
              <span className="text-gray-400">—</span>
            )}
          </span>
        </div>

        <div className="flex w-full items-center justify-between border-t border-gray-200 pt-3">
          <span className="text-body-medium font-medium text-gray-900">Total</span>
          <span className="text-h4-semi text-gray-900">{formatUSD(total)}</span>
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
