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

/** Root category IDs for quick Men/Women segment (until tree filter on API). */
export const EXPLORE_SEGMENT_CATEGORY_IDS = {
  men: '650e8400-e29b-41d4-a716-446655440001',
  women: '650e8400-e29b-41d4-a716-446655440002',
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

export const CATEGORY_SELECT_OPTIONS = EXPLORE_MOCK_CATEGORIES.map(({ value, label }) => ({
  value: value || ALL_OPTION,
  label,
}));

export const BRAND_SELECT_OPTIONS = EXPLORE_MOCK_BRANDS.map(({ value, label }) => ({
  value: value || ALL_OPTION,
  label,
}));
