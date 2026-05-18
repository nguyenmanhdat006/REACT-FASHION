import type { Category, ProductFilters } from '@/types/product/product';

import {
  ALL_OPTION,
  DEFAULT_EXPLORE_FILTERS,
  EXPLORE_SEGMENT_CATEGORY_SLUGS,
} from './constants';
import type { ExploreFilterChip, ExploreFilters, ExploreSortOption } from './constants';

export type ExploreSegmentCategoryIds = {
  men?: string;
  women?: string;
};

export function resolveSegmentCategoryIds(categories: Category[]): ExploreSegmentCategoryIds {
  return {
    men: categories.find((c) => c.slug === EXPLORE_SEGMENT_CATEGORY_SLUGS.men)?.id,
    women: categories.find((c) => c.slug === EXPLORE_SEGMENT_CATEGORY_SLUGS.women)?.id,
  };
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

export const EXPLORE_LIST_PAGE_SIZE = 12;

export function mapExploreToProductFilters(
  explore: ExploreFilters,
  segmentIds: ExploreSegmentCategoryIds,
  page = 0,
): ProductFilters {
  const filters: ProductFilters = {
    published: true,
    page,
    size: EXPLORE_LIST_PAGE_SIZE,
    ...sortToApi(explore.sort),
  };

  if (explore.categoryId) {
    filters.categoryId = explore.categoryId;
  } else if (explore.segment === 'men' && segmentIds.men) {
    filters.categoryId = segmentIds.men;
  } else if (explore.segment === 'women' && segmentIds.women) {
    filters.categoryId = segmentIds.women;
  }

  if (explore.brandId) filters.brandId = explore.brandId;
  if (explore.featured) filters.featured = true;

  const min = explore.minPrice?.trim();
  const max = explore.maxPrice?.trim();
  if (min) filters.minPrice = Number(min);
  if (max) filters.maxPrice = Number(max);

  return filters;
}

export type ExploreFilterLabels = {
  categoryName: (id: string) => string | undefined;
  brandName: (id: string) => string | undefined;
};

export function buildExploreFilterChips(
  applied: ExploreFilters,
  labels: ExploreFilterLabels,
): ExploreFilterChip[] {
  const chips: ExploreFilterChip[] = [];

  if (applied.segment === 'men') chips.push({ id: 'segment', label: 'Men' });
  else if (applied.segment === 'women') chips.push({ id: 'segment', label: 'Women' });

  if (applied.categoryId) {
    const name = labels.categoryName(applied.categoryId);
    if (name) chips.push({ id: 'categoryId', label: name });
  }

  if (applied.brandId) {
    const name = labels.brandName(applied.brandId);
    if (name) chips.push({ id: 'brandId', label: name });
  }

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

export function toSelectOptions(
  items: { id: string; name: string }[],
  allLabel = 'All',
): { value: string; label: string }[] {
  return [
    { value: ALL_OPTION, label: allLabel },
    ...items.map((item) => ({ value: item.id, label: item.name })),
  ];
}
