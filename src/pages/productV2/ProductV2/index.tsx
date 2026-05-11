import { type JSX } from 'react';

import { ProductCard } from '@/components/cards/ProductCard';

import { EXPLORE_PRODUCTS } from './productsExploreData';

export default function Products(): JSX.Element {
  return (
    <main className="relative mx-auto flex w-full max-w-[1212px] flex-col gap-6 self-stretch px-8 pb-12 pt-2">
      <div className="relative grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {EXPLORE_PRODUCTS.map((product) => (
          <ProductCard
            key={product.id}
            imageUrl={product.imageUrl}
            title={product.title}
            price={product.price}
          />
        ))}
      </div>
    </main>
  );
}
