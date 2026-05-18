import { useEffect, useMemo, type JSX } from 'react';

import { ProductCard } from '@/components/cards/ProductCard';
import { useProducts } from '@/hooks/product/useProducts';
import { useAppSelector } from '@/store/hooks';

import { useProductDetailsModal } from '@/pages/UserProductV2/ProductDetailsModalContext';
import { productToProductTile } from '@/pages/UserProductV2/userProductDisplayMappers';
import type { ProductTile } from '@/pages/HomeV2/homeDemoData';

export function HomeProductCardsSection(): JSX.Element {
  const { openProductDetails } = useProductDetailsModal();
  const { fetchHomePublished } = useProducts();
  const { homePublishedProducts, homeTilesLoading } = useAppSelector(s => s.products);

  useEffect(() => {
    void fetchHomePublished();
  }, [fetchHomePublished]);

  const tiles: ProductTile[] = useMemo(
    () => homePublishedProducts.map(productToProductTile),
    [homePublishedProducts]
  );

  return (
    <div className="relative flex flex-[3] w-full flex-col items-center justify-center gap-4">
      {homeTilesLoading && tiles.length === 0 ? (
        <p className="text-caption-lg-regular text-muted-foreground">Loading…</p>
      ) : null}
      <div className="flex w-full items-center justify-center gap-4">
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
    </div>
  );
}
