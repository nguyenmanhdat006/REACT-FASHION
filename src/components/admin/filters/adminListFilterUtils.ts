import type { FetchBrandsParams } from '@/store/thunks/brandThunks';
import type { FetchCategoriesParams } from '@/store/thunks/categoryThunks';
import { ProductStatus } from '@/types/product/product';
import type { ProductFilters } from '@/types/product/product';
import type { ListQueryParams } from '@/types/common/common';

import {
  ALL_OPTION,
  DEFAULT_ADMIN_LIST_FILTERS,
  type AdminListFilterPreset,
  type AdminListFilters,
} from './constants';
import type { AdminBrandRow } from '@/pages/AdminBrandV2/brandDisplayMappers';
import type { AdminCategoryRow } from '@/pages/AdminCategoryV2/categoryDisplayMappers';
import type { AdminUserRow } from '@/pages/AdminUserV2/userDisplayMappers';

function normalizeQ(q?: string): string {
  return q?.trim().toLowerCase() ?? '';
}

export function countAdminListFilters(
  preset: AdminListFilterPreset,
  applied: AdminListFilters,
): number {
  let count = 0;
  if (normalizeQ(applied.q)) count += 1;

  switch (preset) {
    case 'category':
    case 'brand':
      if (applied.active && applied.active !== 'all') count += 1;
      break;
    case 'product':
      if (applied.categoryId) count += 1;
      if (applied.brandId) count += 1;
      if (applied.published && applied.published !== 'all') count += 1;
      if (applied.status && applied.status !== ALL_OPTION) count += 1;
      break;
    case 'user':
      if (applied.role && applied.role !== ALL_OPTION) count += 1;
      if (applied.status && applied.status !== ALL_OPTION) count += 1;
      break;
    default:
      break;
  }

  return count;
}

export function matchesCatalogRowSearch(
  row: { name: string; slug: string },
  q?: string,
): boolean {
  const needle = normalizeQ(q);
  if (!needle) return true;
  return (
    row.name.toLowerCase().includes(needle) || row.slug.toLowerCase().includes(needle)
  );
}

export function filterCategoryRows(
  rows: AdminCategoryRow[],
  applied: AdminListFilters,
): AdminCategoryRow[] {
  return rows.filter(row => {
    if (applied.active === 'active' && !row.active) return false;
    if (applied.active === 'inactive' && row.active) return false;
    return matchesCatalogRowSearch(row, applied.q);
  });
}

export function filterBrandRows(
  rows: AdminBrandRow[],
  applied: AdminListFilters,
): AdminBrandRow[] {
  return rows.filter(row => {
    if (applied.active === 'active' && !row.active) return false;
    if (applied.active === 'inactive' && row.active) return false;
    return matchesCatalogRowSearch(row, applied.q);
  });
}

export function filterUserRows(
  rows: AdminUserRow[],
  applied: AdminListFilters,
): AdminUserRow[] {
  const q = normalizeQ(applied.q);
  return rows.filter(row => {
    if (applied.role && applied.role !== ALL_OPTION && !row.roles.includes(applied.role)) {
      return false;
    }
    if (applied.status && applied.status !== ALL_OPTION && row.status !== applied.status) {
      return false;
    }
    if (!q) return true;
    return (
      row.fullName.toLowerCase().includes(q) ||
      row.email.toLowerCase().includes(q) ||
      row.phone.toLowerCase().includes(q)
    );
  });
}

export function paginateRows<T>(rows: T[], page: number, size: number): T[] {
  const start = page * size;
  return rows.slice(start, start + size);
}

export function totalPagesForRows(length: number, size: number): number {
  return Math.max(1, Math.ceil(length / size) || 1);
}

export function toCategoryFetchParams(
  applied: AdminListFilters,
  base: ListQueryParams,
): FetchCategoriesParams {
  return {
    ...base,
    ...(applied.active === 'active' ? { activeOnly: true as const } : {}),
  };
}

export function toBrandFetchParams(
  applied: AdminListFilters,
  base: ListQueryParams,
): FetchBrandsParams {
  return {
    ...base,
    ...(applied.active === 'active' ? { activeOnly: true as const } : {}),
  };
}

export function toProductFetchParams(
  applied: AdminListFilters,
  base: ListQueryParams,
): ProductFilters {
  const q = applied.q?.trim();
  const filters: ProductFilters = {
    ...base,
    sortBy: base.sortBy ?? 'createdAt',
    sortDirection: base.sortDirection ?? 'desc',
    ...(q ? { keyword: q } : {}),
    ...(applied.categoryId ? { categoryId: applied.categoryId } : {}),
    ...(applied.brandId ? { brandId: applied.brandId } : {}),
  };

  if (applied.published === 'published') filters.published = true;
  if (applied.published === 'unpublished') filters.published = false;

  if (applied.status && applied.status !== ALL_OPTION) {
    filters.status = applied.status as ProductStatus;
  }

  return filters;
}

export function clearAdminListFilters(): AdminListFilters {
  return { ...DEFAULT_ADMIN_LIST_FILTERS };
}

export function toSelectOptions(
  items: { id: string; name: string }[],
  allLabel: string,
): { value: string; label: string }[] {
  return [
    { value: ALL_OPTION, label: allLabel },
    ...items.map(item => ({ value: item.id, label: item.name })),
  ];
}
