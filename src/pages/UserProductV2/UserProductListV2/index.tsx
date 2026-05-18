import { useMemo, type JSX } from 'react';

import { ProductCard } from '@/components/cards/ProductCard';
import { useAppSelector } from '@/store/hooks';

import { useProductDetailsModal } from '@/pages/UserProductV2/ProductDetailsModalContext';
import { ExploreActiveFilterChipsRow } from '@/pages/UserProductV2/exploreFilters';
import { productToExploreProductTile } from '@/pages/UserProductV2/userProductDisplayMappers';

import type { ExploreProductTile } from './productsExploreData';

export default function UserProductListV2(): JSX.Element {
  const { openProductDetails } = useProductDetailsModal();
  const { explorePublishedProducts, exploreTilesLoading } = useAppSelector((s) => s.products);

  const tiles: ExploreProductTile[] = useMemo(
    () => explorePublishedProducts.map(productToExploreProductTile),
    [explorePublishedProducts],
  );

  return (
    <main className="relative flex w-full flex-col gap-6 self-stretch pb-12">
      <ExploreActiveFilterChipsRow />

      {exploreTilesLoading && tiles.length === 0 ? (
        <p className="text-center text-caption-lg-regular text-muted-foreground">Loading…</p>
      ) : null}

      {!exploreTilesLoading && tiles.length === 0 ? (
        <p className="text-center text-caption-lg-regular text-muted-foreground">
          No products match your filters.
        </p>
      ) : null}

      <div className="relative grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((product) => (
          <ProductCard
            key={product.id}
            productId={product.id}
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
