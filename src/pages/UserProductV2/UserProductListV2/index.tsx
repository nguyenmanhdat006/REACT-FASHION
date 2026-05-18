import { useCallback, useMemo, type JSX } from 'react';

import { ProductCard } from '@/components/cards/ProductCard';
import PaginationBar from '@/components/PaginationBar';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setExplorePage } from '@/store/slices/productsSlice';

import { useProductDetailsModal } from '@/pages/UserProductV2/ProductDetailsModalContext';
import { ExploreActiveFilterChipsRow } from '@/pages/UserProductV2/exploreFilters';
import { productToExploreProductTile } from '@/pages/UserProductV2/userProductDisplayMappers';

import type { ExploreProductTile } from './productsExploreData';

export default function UserProductListV2(): JSX.Element {
  const dispatch = useAppDispatch();
  const { openProductDetails } = useProductDetailsModal();
  const {
    explorePublishedProducts,
    exploreTilesLoading,
    explorePage,
    exploreTotalPages,
  } = useAppSelector((s) => s.products);

  const tiles: ExploreProductTile[] = useMemo(
    () => explorePublishedProducts.map(productToExploreProductTile),
    [explorePublishedProducts],
  );

  const currentPage = explorePage + 1;
  const safeTotalPages = Math.max(1, exploreTotalPages || 1);

  const onPageChange = useCallback(
    (nextPage: number) => {
      dispatch(setExplorePage(nextPage - 1));
    },
    [dispatch],
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

      <PaginationBar
        currentPage={currentPage}
        totalPages={safeTotalPages}
        onPageChange={onPageChange}
      />
    </main>
  );
}
