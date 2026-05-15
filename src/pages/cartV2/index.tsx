import { JSX } from 'react';
import { CartItemListSection } from './sections/CartItemListSection';
import { OrderSummarySection } from './sections/OrderSummarySection';
import { useCart } from './useCart';

export const FrameScreen = (): JSX.Element => {
  const { items, selectedIds, toggleSelected, updateQuantity, removeItem } = useCart();

  return (
    <main className="relative min-h-screen w-full bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="sr-only">Shopping cart</h1>
      <div className="mx-auto flex w-full max-w-[1140px] flex-col gap-4 lg:flex-row lg:items-start">
        <section aria-label="Cart items" className="min-w-0 flex-1">
          <CartItemListSection
            items={items}
            selectedIds={selectedIds}
            onToggleSelected={toggleSelected}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
          />
        </section>
        <aside aria-label="Order summary" className="w-full lg:max-w-[348px] lg:shrink-0 lg:sticky lg:top-8">
          <OrderSummarySection />
        </aside>
      </div>
    </main>
  );
};

export default FrameScreen;
