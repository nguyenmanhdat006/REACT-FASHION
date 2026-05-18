import { ROUTES } from '@/constants';

export type ExploreQuickSegment = 'all' | 'men' | 'women';

export type ExploreSortOption =
  | 'newest'
  | 'oldest'
  | 'price-asc'
  | 'price-desc';

export type ExploreFilters = {
  segment: ExploreQuickSegment;
  categoryId?: string;
  brandId?: string;
  minPrice?: string;
  maxPrice?: string;
  featured: boolean;
  sort: ExploreSortOption;
};

export type ExploreFilterChip = {
  id: string;
  label: string;
};

export const ALL_OPTION = '__all__';

/** Root category slugs for Men/Women quick filters (resolved to IDs when catalog loads). */
export const EXPLORE_SEGMENT_CATEGORY_SLUGS = {
  men: 'mens-fashion',
  women: 'womens-fashion',
} as const;

export const DEFAULT_EXPLORE_FILTERS: ExploreFilters = {
  segment: 'all',
  categoryId: undefined,
  brandId: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  featured: false,
  sort: 'newest',
};

export const EXPLORE_PRODUCT_PATHS = [
  ROUTES.PRODUCTS,
  ROUTES.PRODUCTS_CLOTHING,
  ROUTES.PRODUCTS_DEAL,
  ROUTES.PRODUCTS_INSPIRATIONS,
] as const;

export function isExploreProductsPath(pathname: string): boolean {
  return (EXPLORE_PRODUCT_PATHS as readonly string[]).includes(pathname);
}

export const EXPLORE_SORT_OPTIONS: { value: ExploreSortOption; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];
