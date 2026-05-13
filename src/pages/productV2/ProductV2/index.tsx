import { useEffect, useMemo, type JSX } from 'react';

import { ProductCard } from '@/components/cards/ProductCard';
import { useProducts } from '@/hooks/product/useProducts';
import { useAppSelector } from '@/store/hooks';

import { useProductDetailsModal } from '../ProductDetailsModalContext';
import type { ExploreProductTile } from './productsExploreData';
import { productToExploreProductTile } from '../productDisplayMappers';

export default function Products(): JSX.Element {
  const { openProductDetails } = useProductDetailsModal();
  const { fetchExplorePublished } = useProducts();
  const { explorePublishedProducts, exploreTilesLoading } = useAppSelector(s => s.products);

  useEffect(() => {
    void fetchExplorePublished();
  }, [fetchExplorePublished]);

  const tiles: ExploreProductTile[] = useMemo(
    () => explorePublishedProducts.map(productToExploreProductTile),
    [explorePublishedProducts]
  );

  return (
    <main className="relative flex w-full flex-col gap-6 self-stretch pb-12">
      {exploreTilesLoading && tiles.length === 0 ? (
        <p className="text-center text-caption-lg-regular text-muted-foreground">Loading…</p>
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
