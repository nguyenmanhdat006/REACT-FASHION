import { OrderDetailsListSection } from "./OrderDetailsListSection";
import { OrderSummaryCardSection } from "./OrderSummaryCardSection";

export const Frame = (): JSX.Element => {
  return (
    <main className="relative flex h-[784px] w-[1212px] flex-col items-center gap-4 overflow-hidden p-8">
      <section aria-label="Order summary" className="w-full">
        <OrderSummaryCardSection />
      </section>
      <section aria-label="Order details" className="w-full">
        <OrderDetailsListSection />
      </section>
    </main>
  );
};

export default Frame;
