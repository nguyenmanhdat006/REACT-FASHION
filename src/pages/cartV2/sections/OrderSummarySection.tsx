const summaryItems: {
  label: string;
  value: string;
  valueClassName: string;
}[] = [
  {
    label: 'Subtotal',
    value: '$560',
    valueClassName: 'text-black',
  },
  {
    label: 'Discount (-20%)',
    value: '-$113',
    valueClassName: 'text-red-500',
  },
  {
    label: 'Delivery Fee',
    value: '$15',
    valueClassName: 'text-black',
  },
];

export const OrderSummarySection = (): JSX.Element => {
  return (
    <section
      aria-labelledby="order-summary-heading"
      className="flex flex-col w-full max-w-[446px] items-start gap-[15px] p-8 relative bg-white rounded-2xl border border-solid border-gray-200"
    >
      <h2
        id="order-summary-heading"
        className="relative self-stretch mt-[-1px] font-semibold text-black text-xl leading-7"
      >
        Order Summary
      </h2>

      <dl className="flex flex-col items-center justify-center gap-2 pt-0 pb-4 px-0 relative self-stretch w-full flex-[0_0_auto] border-b border-solid border-gray-200">
        {summaryItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]"
          >
            <dt className="relative w-fit mt-[-1px] font-normal text-[#666666] text-base leading-6 whitespace-nowrap">
              {item.label}
            </dt>
            <dd
              className={`relative w-fit mt-[-1px] font-normal text-base leading-6 whitespace-nowrap ${item.valueClassName}`}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
        <div className="relative w-fit mt-[-0.5px] font-normal text-black text-base leading-6 whitespace-nowrap">
          Total
        </div>
        <div className="mt-[-1px] text-xl leading-7 relative w-fit font-semibold text-black whitespace-nowrap">
          $400
        </div>
      </div>

      <button
        type="button"
        aria-label="Go to checkout"
        className="flex items-center justify-center gap-2.5 px-8 py-3 relative self-stretch w-full flex-[0_0_auto] bg-black rounded-[32px] overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black hover:opacity-90 transition-opacity"
      >
        <span className="relative w-fit mt-[-1px] font-normal text-white text-base leading-6 whitespace-nowrap">
          Go to Checkout
        </span>
      </button>
    </section>
  );
};
