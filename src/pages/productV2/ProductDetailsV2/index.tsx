import { type JSX } from 'react';

import ProductDetailsHeaderSection from './sections/ProductDetailsHeaderSection';
import { cn } from '@/lib/utils';
import ProductDetailsLeftSection from './sections/ProductDetailsLeftSection';
import ProductDetailsRightSection from './sections/ProductDetailsRightSection';

export function ProductDetails(): JSX.Element {
  return (
    <main
      className={cn(
        'mx-auto box-border flex w-[912px] max-w-full flex-col items-center gap-4 overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-0'
      )}
    >
      <ProductDetailsHeaderSection />

      <section className="flex w-full min-w-0 items-start gap-4 self-stretch">
        <ProductDetailsLeftSection />
        <ProductDetailsRightSection />
      </section>
    </main>
  );
}

export default ProductDetails;
