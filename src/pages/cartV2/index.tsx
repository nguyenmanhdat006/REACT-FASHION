import { JSX } from 'react';
import { CartItemListSection } from './sections/CartItemListSection';
import { OrderSummarySection } from './sections/OrderSummarySection';
import { useCart } from './useCart';

export const FrameScreen = (): JSX.Element => {
  const { items, selectedIds, toggleSelected, updateQuantity, removeItem } = useCart();

  return (
    <main className="relative flex min-h-screen items-start justify-center gap-4 p-8 bg-grayscalewhite">
      <h1 className="sr-only">Shopping cart</h1>
      <section aria-label="Cart items" className="shrink-0">
        <CartItemListSection
          items={items}
          selectedIds={selectedIds}
          onToggleSelected={toggleSelected}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
        />
      </section>
      <aside aria-label="Order summary" className="shrink-0">
        <OrderSummarySection />
      </aside>
    </main>
  );
};

export default FrameScreen;
