import { ROUTES } from '@/constants';

import {
  EXPLORE_MOCK_BRANDS,
  EXPLORE_MOCK_CATEGORIES,
  DEFAULT_EXPLORE_FILTERS,
} from './constants';
import type { ExploreFilterChip, ExploreFilterState } from './types';

export function isExploreProductsPath(pathname: string): boolean {
  return (
    pathname === ROUTES.PRODUCTS ||
    pathname === ROUTES.PRODUCTS_CLOTHING ||
    pathname === ROUTES.PRODUCTS_DEAL ||
    pathname === ROUTES.PRODUCTS_INSPIRATIONS
  );
}

export function cloneExploreFilters(state: ExploreFilterState): ExploreFilterState {
  return { ...state };
}

function categoryLabel(categoryId: string | undefined): string | undefined {
  if (!categoryId) return undefined;
  return EXPLORE_MOCK_CATEGORIES.find((c) => c.value === categoryId)?.label;
}

function brandLabel(brandId: string | undefined): string | undefined {
  if (!brandId) return undefined;
  return EXPLORE_MOCK_BRANDS.find((b) => b.value === brandId)?.label;
}

export function countPanelFilters(state: ExploreFilterState): number {
  let count = 0;
  if (state.categoryId) count += 1;
  if (state.brandId) count += 1;
  if (state.minPrice?.trim()) count += 1;
  if (state.maxPrice?.trim()) count += 1;
  if (state.featured) count += 1;
  if (state.sort !== DEFAULT_EXPLORE_FILTERS.sort) count += 1;
  return count;
}

export function countActiveExploreFilters(state: ExploreFilterState): number {
  let count = countPanelFilters(state);
  if (state.segment !== 'all') count += 1;
  return count;
}

export function buildExploreFilterChips(state: ExploreFilterState): ExploreFilterChip[] {
  const chips: ExploreFilterChip[] = [];

  if (state.segment === 'men') {
    chips.push({ id: 'segment', label: 'Men' });
  } else if (state.segment === 'women') {
    chips.push({ id: 'segment', label: 'Women' });
  }

  const category = categoryLabel(state.categoryId);
  if (category) chips.push({ id: 'categoryId', label: category });

  const brand = brandLabel(state.brandId);
  if (brand) chips.push({ id: 'brandId', label: brand });

  if (state.minPrice?.trim() || state.maxPrice?.trim()) {
    const min = state.minPrice?.trim();
    const max = state.maxPrice?.trim();
    if (min && max) chips.push({ id: 'price', label: `$${min} – $${max}` });
    else if (min) chips.push({ id: 'price', label: `From $${min}` });
    else if (max) chips.push({ id: 'price', label: `Up to $${max}` });
  }

  if (state.featured) chips.push({ id: 'featured', label: 'Featured' });

  if (state.sort !== DEFAULT_EXPLORE_FILTERS.sort) {
    const sortLabels: Record<ExploreFilterState['sort'], string> = {
      newest: 'Newest',
      oldest: 'Oldest',
      'price-asc': 'Price ↑',
      'price-desc': 'Price ↓',
    };
    chips.push({ id: 'sort', label: sortLabels[state.sort] });
  }

  return chips;
}

export function removeExploreFilterChip(
  state: ExploreFilterState,
  chipId: string,
): ExploreFilterState {
  const next = cloneExploreFilters(state);
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
