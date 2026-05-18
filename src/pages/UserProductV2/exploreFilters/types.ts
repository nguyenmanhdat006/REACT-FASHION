export type ExploreQuickSegment = 'all' | 'men' | 'women';

export type ExploreSortOption =
  | 'newest'
  | 'oldest'
  | 'price-asc'
  | 'price-desc';

export type ExploreFilterState = {
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
