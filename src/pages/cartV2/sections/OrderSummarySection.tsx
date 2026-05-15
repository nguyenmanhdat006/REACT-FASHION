import { Button } from '@/components/ui/button';

const summaryItems: {
  label: string;
  value: string;
  valueClassName: string;
}[] = [
  {
    label: 'Subtotal',
    value: '$560',
    valueClassName: 'text-gray-900',
  },
  {
    label: 'Discount (-20%)',
    value: '-$113',
    valueClassName: 'text-destructive',
  },
  {
    label: 'Delivery Fee',
    value: '$15',
    valueClassName: 'text-gray-900',
  },
];

export const OrderSummarySection = (): JSX.Element => {
  return (
    <section
      aria-labelledby="order-summary-heading"
      className="flex w-full flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h2
        id="order-summary-heading"
        className="text-h4-semi text-gray-900"
      >
        Order Summary
      </h2>

      <dl className="flex w-full flex-col gap-2 border-b border-gray-200 pb-4">
        {summaryItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between gap-4"
          >
            <dt className="text-body-regular text-gray-600">
              {item.label}
            </dt>
            <dd
              className={`text-body-medium font-medium whitespace-nowrap ${item.valueClassName}`}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex w-full items-center justify-between pt-1">
        <div className="text-body-regular text-gray-900">
          Total
        </div>
        <div className="text-h4-semi text-gray-900 whitespace-nowrap">
          $400
        </div>
      </div>

      <Button
        type="button"
        aria-label="Go to checkout"
        className="h-12 w-full rounded-[32px] text-body-medium font-medium"
      >
        Go to Checkout
      </Button>
    </section>
  );
};
