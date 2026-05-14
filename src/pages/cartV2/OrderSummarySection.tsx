const summaryItems = [
  {
    label: "Subtotal",
    value: "$560",
    valueClassName: "text-black",
  },
  {
    label: "Discount (-20%)",
    value: "-$113",
    valueClassName: "text-error-300",
  },
  {
    label: "Delivery Fee",
    value: "$15",
    valueClassName: "text-black",
  },
];

export const OrderSummarySection = (): JSX.Element => {
  return (
    <section
      aria-labelledby="order-summary-heading"
      className="flex flex-col w-[446px] items-start gap-[15px] p-8 relative bg-grayscalewhite rounded-2xl border border-solid border-grayscale-200"
    >
      <h2
        id="order-summary-heading"
        className="relative self-stretch mt-[-1.00px] font-medium-heading-h6-medium font-[number:var(--medium-heading-h6-medium-font-weight)] text-black text-[length:var(--medium-heading-h6-medium-font-size)] tracking-[var(--medium-heading-h6-medium-letter-spacing)] leading-[var(--medium-heading-h6-medium-line-height)] [font-style:var(--medium-heading-h6-medium-font-style)]"
      >
        Order Summary
      </h2>
      <div className="flex flex-col items-center justify-center gap-2 pt-0 pb-4 px-0 relative self-stretch w-full flex-[0_0_auto] border-b [border-bottom-style:solid] border-grayscale-200">
        {summaryItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]"
          >
            <dt className="relative w-fit mt-[-1.00px] font-regular-body-base-regular font-[number:var(--regular-body-base-regular-font-weight)] text-[#666666] text-[length:var(--regular-body-base-regular-font-size)] tracking-[var(--regular-body-base-regular-letter-spacing)] leading-[var(--regular-body-base-regular-line-height)] whitespace-nowrap [font-style:var(--regular-body-base-regular-font-style)]">
              {item.label}
            </dt>
            <dd
              className={`relative w-fit mt-[-1.00px] font-regular-body-base-regular font-[number:var(--regular-body-base-regular-font-weight)] ${item.valueClassName} text-[length:var(--regular-body-base-regular-font-size)] tracking-[var(--regular-body-base-regular-letter-spacing)] leading-[var(--regular-body-base-regular-line-height)] whitespace-nowrap [font-style:var(--regular-body-base-regular-font-style)]`}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
        <div className="relative w-fit mt-[-0.50px] font-regular-body-base-regular font-[number:var(--regular-body-base-regular-font-weight)] text-black text-[length:var(--regular-body-base-regular-font-size)] tracking-[var(--regular-body-base-regular-letter-spacing)] leading-[var(--regular-body-base-regular-line-height)] whitespace-nowrap [font-style:var(--regular-body-base-regular-font-style)]">
          Total
        </div>
        <div className="mt-[-1.00px] text-[length:var(--medium-heading-h6-medium-font-size)] leading-[var(--medium-heading-h6-medium-line-height)] relative w-fit font-medium-heading-h6-medium font-[number:var(--medium-heading-h6-medium-font-weight)] text-black tracking-[var(--medium-heading-h6-medium-letter-spacing)] whitespace-nowrap [font-style:var(--medium-heading-h6-medium-font-style)]">
          $400
        </div>
      </div>
      <button
        type="button"
        aria-label="Go to checkout"
        className="flex items-center justify-center gap-2.5 px-8 py-3 relative self-stretch w-full flex-[0_0_auto] bg-primary-900 rounded-[32px] overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-900"
      >
        <span className="relative w-fit mt-[-1.00px] font-regular-body-base-regular font-[number:var(--regular-body-base-regular-font-weight)] text-white text-[length:var(--regular-body-base-regular-font-size)] tracking-[var(--regular-body-base-regular-letter-spacing)] leading-[var(--regular-body-base-regular-line-height)] whitespace-nowrap [font-style:var(--regular-body-base-regular-font-style)]">
          Go to Checkout
        </span>
      </button>
    </section>
  );
};
