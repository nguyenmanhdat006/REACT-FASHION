import { CartItemListSection } from "./CartItemListSection";
import { OrderSummarySection } from "./OrderSummarySection";

export const FrameScreen = (): JSX.Element => {
  return (
    <main className="relative flex min-h-screen items-start justify-center gap-4 p-8 bg-grayscalewhite">
      <h1 className="sr-only">Shopping cart</h1>
      <section aria-label="Cart items" className="shrink-0">
        <CartItemListSection />
      </section>
      <aside aria-label="Order summary" className="shrink-0">
        <OrderSummarySection />
      </aside>
    </main>
  );
};

export default FrameScreen;
