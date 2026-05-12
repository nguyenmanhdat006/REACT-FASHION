import { type JSX } from 'react';

import { ProductCard } from '@/components/cards/ProductCard';

import { useProductDetailsModal } from '../ProductDetailsModalContext';
import { EXPLORE_PRODUCTS } from './productsExploreData';

export default function Products(): JSX.Element {
  const { openProductDetails } = useProductDetailsModal();

  return (
    <main className="relative flex w-full flex-col gap-6 self-stretch pb-12">
      <div className="relative grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {EXPLORE_PRODUCTS.map((product) => (
          <ProductCard
            key={product.id}
            imageUrl={product.imageUrl}
            title={product.title}
            price={product.price}
            onOpenDetails={openProductDetails}
          />
        ))}
      </div>
    </main>
  );
}
