import type { ExploreFilterState, ExploreSortOption } from './types';

export const DEFAULT_EXPLORE_FILTERS: ExploreFilterState = {
  segment: 'all',
  categoryId: undefined,
  brandId: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  featured: false,
  sort: 'newest',
};

/** Placeholder options until catalog APIs are wired. */
export const EXPLORE_MOCK_CATEGORIES = [
  { value: '', label: 'All categories' },
  { value: '650e8400-e29b-41d4-a716-446655440001', label: "Men's Fashion" },
  { value: '650e8400-e29b-41d4-a716-446655440002', label: "Women's Fashion" },
  { value: '650e8400-e29b-41d4-a716-446655440011', label: "Men's Shirts" },
  { value: '650e8400-e29b-41d4-a716-446655440021', label: "Women's Dresses" },
] as const;

export const EXPLORE_MOCK_BRANDS = [
  { value: '', label: 'All brands' },
  { value: '550e8400-e29b-41d4-a716-446655440001', label: 'Nike' },
  { value: '550e8400-e29b-41d4-a716-446655440002', label: 'Adidas' },
  { value: '550e8400-e29b-41d4-a716-446655440003', label: 'Zara' },
  { value: '550e8400-e29b-41d4-a716-446655440004', label: 'H&M' },
] as const;

export const EXPLORE_SORT_OPTIONS: { value: ExploreSortOption; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];
