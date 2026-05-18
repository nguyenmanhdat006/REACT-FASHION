import type { Product } from '@/types/product/product';

import type { ExploreFilterState } from './types';

function matchesSegment(product: Product, segment: ExploreFilterState['segment']): boolean {
  if (segment === 'all') return true;
  const hay = `${product.category?.name ?? ''} ${product.name} ${product.description ?? ''}`.toLowerCase();
  if (segment === 'women') {
    return (
      hay.includes('women') ||
      hay.includes('woman') ||
      hay.includes('ladies') ||
      hay.includes('female')
    );
  }
  return (
    hay.includes('men') ||
    hay.includes("men's") ||
    hay.includes('male')
  );
}

/** Client-side preview until explore list uses product filter API. */
export function clientFilterExploreProducts(
  products: Product[],
  filters: ExploreFilterState,
): Product[] {
  let result = products.filter((p) => matchesSegment(p, filters.segment));

  if (filters.categoryId) {
    result = result.filter((p) => p.category?.id === filters.categoryId);
  }

  if (filters.brandId) {
    result = result.filter((p) => p.brand?.id === filters.brandId);
  }

  if (filters.featured) {
    result = result.filter((p) => p.featured === true);
  }

  const min = filters.minPrice?.trim();
  const max = filters.maxPrice?.trim();
  if (min) {
    const minN = Number(min);
    result = result.filter((p) => p.price >= minN);
  }
  if (max) {
    const maxN = Number(max);
    result = result.filter((p) => p.price <= maxN);
  }

  const sorted = [...result];
  switch (filters.sort) {
    case 'oldest':
      sorted.sort((a, b) => (a.createdAt ?? '').localeCompare(b.createdAt ?? ''));
      break;
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
    default:
      sorted.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
      break;
  }

  return sorted;
}
