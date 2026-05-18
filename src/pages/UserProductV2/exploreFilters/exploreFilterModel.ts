import type { ProductFilters } from '@/types/product/product';

import {
  DEFAULT_EXPLORE_FILTERS,
  EXPLORE_MOCK_BRANDS,
  EXPLORE_MOCK_CATEGORIES,
  EXPLORE_SEGMENT_CATEGORY_IDS,
} from './constants';
import type { ExploreFilterChip, ExploreFilters, ExploreSortOption } from './constants';

export function isExploreProductsPath(pathname: string, routes: {
  products: string;
  productsClothing: string;
  productsDeal: string;
  productsInspirations: string;
}): boolean {
  return (
    pathname === routes.products ||
    pathname === routes.productsClothing ||
    pathname === routes.productsDeal ||
    pathname === routes.productsInspirations
  );
}

export function validateExploreDraft(draft: ExploreFilters): string | null {
  const min = draft.minPrice?.trim();
  const max = draft.maxPrice?.trim();
  if (min && max && Number(min) > Number(max)) {
    return 'Minimum price must be less than or equal to maximum price';
  }
  if (min && Number(min) < 0) return 'Minimum price cannot be negative';
  if (max && Number(max) < 0) return 'Maximum price cannot be negative';
  return null;
}

function sortToApi(sort: ExploreSortOption): Pick<ProductFilters, 'sortBy' | 'sortDirection'> {
  switch (sort) {
    case 'oldest':
      return { sortBy: 'createdAt', sortDirection: 'asc' };
    case 'price-asc':
      return { sortBy: 'price', sortDirection: 'asc' };
    case 'price-desc':
      return { sortBy: 'price', sortDirection: 'desc' };
    case 'newest':
    default:
      return { sortBy: 'createdAt', sortDirection: 'desc' };
  }
}

export function mapExploreToProductFilters(explore: ExploreFilters): ProductFilters {
  const filters: ProductFilters = {
    published: true,
    page: 0,
    size: 12,
    ...sortToApi(explore.sort),
  };

  if (explore.categoryId) {
    filters.categoryId = explore.categoryId;
  } else if (explore.segment === 'men') {
    filters.categoryId = EXPLORE_SEGMENT_CATEGORY_IDS.men;
  } else if (explore.segment === 'women') {
    filters.categoryId = EXPLORE_SEGMENT_CATEGORY_IDS.women;
  }

  if (explore.brandId) filters.brandId = explore.brandId;
  if (explore.featured) filters.featured = true;

  const min = explore.minPrice?.trim();
  const max = explore.maxPrice?.trim();
  if (min) filters.minPrice = Number(min);
  if (max) filters.maxPrice = Number(max);

  return filters;
}

function categoryLabel(categoryId: string | undefined): string | undefined {
  if (!categoryId) return undefined;
  return EXPLORE_MOCK_CATEGORIES.find((c) => c.value === categoryId)?.label;
}

function brandLabel(brandId: string | undefined): string | undefined {
  if (!brandId) return undefined;
  return EXPLORE_MOCK_BRANDS.find((b) => b.value === brandId)?.label;
}

export function buildExploreFilterChips(applied: ExploreFilters): ExploreFilterChip[] {
  const chips: ExploreFilterChip[] = [];

  if (applied.segment === 'men') chips.push({ id: 'segment', label: 'Men' });
  else if (applied.segment === 'women') chips.push({ id: 'segment', label: 'Women' });

  const category = categoryLabel(applied.categoryId);
  if (category) chips.push({ id: 'categoryId', label: category });

  const brand = brandLabel(applied.brandId);
  if (brand) chips.push({ id: 'brandId', label: brand });

  const min = applied.minPrice?.trim();
  const max = applied.maxPrice?.trim();
  if (min && max) chips.push({ id: 'price', label: `$${min} – $${max}` });
  else if (min) chips.push({ id: 'price', label: `From $${min}` });
  else if (max) chips.push({ id: 'price', label: `Up to $${max}` });

  if (applied.featured) chips.push({ id: 'featured', label: 'Featured' });

  if (applied.sort !== DEFAULT_EXPLORE_FILTERS.sort) {
    const sortLabels: Record<ExploreSortOption, string> = {
      newest: 'Newest',
      oldest: 'Oldest',
      'price-asc': 'Price ↑',
      'price-desc': 'Price ↓',
    };
    chips.push({ id: 'sort', label: sortLabels[applied.sort] });
  }

  return chips;
}

export function countActiveExploreFilters(applied: ExploreFilters): number {
  return buildExploreFilterChips(applied).length;
}

export function removeExploreFilterChip(
  applied: ExploreFilters,
  chipId: string,
): ExploreFilters {
  const next = { ...applied };
  switch (chipId) {
    case 'segment':
      next.segment = 'all';
      break;
    case 'categoryId':
      next.categoryId = undefined;
      break;
    case 'brandId':
      next.brandId = undefined;
      break;
    case 'price':
      next.minPrice = undefined;
      next.maxPrice = undefined;
      break;
    case 'featured':
      next.featured = false;
      break;
    case 'sort':
      next.sort = DEFAULT_EXPLORE_FILTERS.sort;
      break;
    default:
      break;
  }
  return next;
}
