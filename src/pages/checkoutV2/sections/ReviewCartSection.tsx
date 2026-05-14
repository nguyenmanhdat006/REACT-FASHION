import { JSX } from 'react';
import { Button } from '@/components/ui/button';

type CartItem = {
  id: string;
  title: string;
  size: string;
  color: string;
  price: string;
  quantity: number;
  imageSrc: string;
};

type ReviewCartSectionProps = {
  items: CartItem[];
  isSubmitting?: boolean;
  onSubmit?: () => void;
};

const mockSummary = {
  subtotal: '$560',
  discount: '-$113',
  discountPercent: '20%',
  deliveryFee: '$15',
  total: '$400',
};

export const ReviewCartSection = ({
  items,
  isSubmitting = false,
  onSubmit,
}: ReviewCartSectionProps): JSX.Element => {
  return (
    <div className="flex flex-col items-start gap-6 relative w-full max-w-lg sticky top-8">
      <h2 className="text-h3-semi text-gray-900">Review Your Cart</h2>

      {/* Cart Items List */}
      <div className="flex flex-col items-start gap-4 relative w-full max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 relative w-full pb-4 border-b border-gray-200"
          >
            {/* Product Image */}
            <div
              className="relative w-20 h-20 shrink-0 rounded-lg bg-cover bg-center"
              style={{ backgroundImage: `url(${item.imageSrc})` }}
              aria-hidden="true"
            />

            {/* Product Details */}
            <div className="flex flex-col items-start gap-1 relative flex-1 min-w-0">
              <h3 className="text-body-medium text-gray-900 line-clamp-2">
                {item.title}
              </h3>
              <p className="text-caption-sm-regular text-gray-500">
                Size: {item.size} | Color: {item.color}
              </p>
              <div className="flex items-center justify-between w-full mt-1">
                <span className="text-body-medium font-medium text-gray-900">
                  {item.price}
                </span>
                <span className="text-caption-sm-regular text-gray-600">
                  x{item.quantity}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="flex flex-col items-start gap-4 relative w-full pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between w-full">
          <span className="text-body-regular text-gray-600">Subtotal</span>
          <span className="text-body-medium font-medium text-gray-900">
            {mockSummary.subtotal}
          </span>
        </div>

        <div className="flex items-center justify-between w-full">
          <span className="text-body-regular text-gray-600">
            Discount ({mockSummary.discountPercent})
          </span>
          <span className="text-body-medium font-medium text-red-500">
            {mockSummary.discount}
          </span>
        </div>

        <div className="flex items-center justify-between w-full">
          <span className="text-body-regular text-gray-600">Delivery Fee</span>
          <span className="text-body-medium font-medium text-gray-900">
            {mockSummary.deliveryFee}
          </span>
        </div>

        <div className="flex items-center justify-between w-full pt-4 border-t border-gray-200">
          <span className="text-body-medium font-medium text-gray-900">Total</span>
          <span className="text-h4-semi text-gray-900">{mockSummary.total}</span>
        </div>
      </div>

      {/* Pay Now Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        onClick={onSubmit}
        className="w-full h-12 rounded-[32px] bg-secondary-900 hover:bg-secondary-800 text-white text-body-medium font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Processing...' : 'Pay Now'}
      </Button>
    </div>
  );
};
