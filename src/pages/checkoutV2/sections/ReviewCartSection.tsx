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
  shippingFee?: number | null;
  estimatedDays?: number | null;
  isLoading?: boolean;
  isCalculatingShipping?: boolean;
  isSubmitting?: boolean;
};

const formatVND = (value: number | null | undefined): string => {
  if (value == null) return '—';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
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
      <h2 className="text-h3-semi text-gray-900">Đơn hàng của bạn</h2>

      {/* Cart Items */}
      <div className="flex max-h-80 w-full flex-col items-start gap-3 overflow-y-auto">
        {isLoading ? (
          <p className="text-body-regular text-gray-600">Đang tải giỏ hàng...</p>
        ) : items.length === 0 ? (
          <p className="text-body-regular text-gray-600">Giỏ hàng trống.</p>
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
                    {formatVND(item.price)}
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

      {/* Summary */}
      <div className="flex w-full flex-col items-start gap-3 border-t border-gray-200 pt-4">
        <div className="flex w-full items-center justify-between">
          <span className="text-body-regular text-gray-600">Tạm tính</span>
          <span className="text-body-medium font-medium text-gray-900">
            {formatVND(subtotal)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex w-full items-center justify-between">
            <span className="text-body-regular text-gray-600">Giảm giá</span>
            <span className="text-body-medium font-medium text-destructive">
              -{formatVND(discount)}
            </span>
          </div>
        )}

        <div className="flex w-full items-center justify-between">
          <span className="text-body-regular text-gray-600">
            Phí vận chuyển
            {estimatedDays != null && (
              <span className="ml-1 text-caption-sm-regular text-gray-500">
                (dự kiến {estimatedDays} ngày)
              </span>
            )}
          </span>
          <span className="text-body-medium font-medium text-gray-900">
            {isCalculatingShipping ? (
              <span className="animate-pulse text-gray-400">Đang tính...</span>
            ) : shippingFee != null ? (
              formatVND(shippingFee)
            ) : (
              <span className="text-gray-400">—</span>
            )}
          </span>
        </div>

        <div className="flex w-full items-center justify-between border-t border-gray-200 pt-3">
          <span className="text-body-medium font-medium text-gray-900">Tổng cộng</span>
          <span className="text-h4-semi text-gray-900">{formatVND(total)}</span>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || isLoading}
        className="h-12 w-full rounded-3xl !bg-primary-600 text-body-medium font-medium text-white hover:!bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng'}
      </Button>
    </div>
  );
};
