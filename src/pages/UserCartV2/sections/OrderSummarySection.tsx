import { Button } from '@/components/ui/button';
import { useCart } from '../useCart';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';

const format = (v?: number | null) => (v == null ? '$0' : `$${v}`);

export const OrderSummarySection = (): JSX.Element => {
  const { rawCart, isLoading } = useCart();
  const navigate = useNavigate();

  const subtotal = rawCart?.subtotal ?? 0;
  const discount = rawCart?.discount ?? 0;
  const shipping = (rawCart as any)?.shipping ?? 0;
  const total = rawCart?.total ?? 0;

  return (
    <section
      aria-labelledby="order-summary-heading"
      className="flex w-full flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h2 id="order-summary-heading" className="text-h4-semi text-gray-900">
        Order Summary
      </h2>

      {isLoading ? (
        <p className="text-gray-600">Loading summary...</p>
      ) : (
        <>
          <dl className="flex w-full flex-col gap-2 border-b border-gray-200 pb-4">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-body-regular text-gray-600">Subtotal</dt>
              <dd className="text-body-medium font-medium whitespace-nowrap text-gray-900">
                {format(subtotal)}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4">
              <dt className="text-body-regular text-gray-600">Discount</dt>
              <dd className="text-body-medium font-medium whitespace-nowrap text-destructive">
                -{format(discount)}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4">
              <dt className="text-body-regular text-gray-600">Delivery Fee</dt>
              <dd className="text-body-medium font-medium whitespace-nowrap text-gray-900">
                {format(shipping)}
              </dd>
            </div>
          </dl>

          <div className="flex w-full items-center justify-between pt-1">
            <div className="text-body-regular text-gray-900">Total</div>
            <div className="text-h4-semi text-gray-900 whitespace-nowrap">{format(total)}</div>
          </div>

          <Button
            type="button"
            aria-label="Go to checkout"
            className="h-12 w-full rounded-[32px] text-body-medium font-medium"
            onClick={() => navigate(ROUTES.CHECKOUT)}
          >
            Go to Checkout
          </Button>
        </>
      )}
    </section>
  );
};
