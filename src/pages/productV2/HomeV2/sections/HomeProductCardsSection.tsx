import { type JSX } from 'react';

import { ProductCard } from '@/components/cards/ProductCard';

import { PRODUCT_TILES } from '../homeDemoData';

export function HomeProductCardsSection(): JSX.Element {
  return (
    <div className="relative flex flex-[3] w-full items-center justify-center gap-4">
      {PRODUCT_TILES.map((product) => (
        <ProductCard
          key={product.id}
          imageUrl={product.imageUrl}
          title={product.title}
          price={product.price}
        />
      ))}
    </div>
  );
}
