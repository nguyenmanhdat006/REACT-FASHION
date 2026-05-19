import { ProductStatus } from '@/types/product/product';

export const ALL_OPTION = '__all__';

export type AdminActiveFilter = 'all' | 'active' | 'inactive';

export type AdminPublishedFilter = 'all' | 'published' | 'unpublished';

export type AdminListFilters = {
  q?: string;
  active?: AdminActiveFilter;
  categoryId?: string;
  brandId?: string;
  published?: AdminPublishedFilter;
  status?: string;
  role?: string;
};

export const DEFAULT_ADMIN_LIST_FILTERS: AdminListFilters = {
  active: 'all',
  published: 'all',
  status: ALL_OPTION,
  role: ALL_OPTION,
};

export type AdminListFilterPreset = 'category' | 'brand' | 'product' | 'user';

export const ADMIN_ACTIVE_OPTIONS: { value: AdminActiveFilter; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export const ADMIN_PUBLISHED_OPTIONS: { value: AdminPublishedFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'unpublished', label: 'Unpublished' },
];

export const ADMIN_PRODUCT_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: ALL_OPTION, label: 'All statuses' },
  { value: ProductStatus.DRAFT, label: 'Draft' },
  { value: ProductStatus.PUBLISHED, label: 'Published' },
  { value: ProductStatus.ARCHIVED, label: 'Archived' },
  { value: ProductStatus.OUT_OF_STOCK, label: 'Out of stock' },
];

export const ADMIN_USER_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: ALL_OPTION, label: 'All statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'PENDING', label: 'Pending' },
];

export const ADMIN_USER_ROLE_OPTIONS: { value: string; label: string }[] = [
  { value: ALL_OPTION, label: 'All roles' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'USER', label: 'Customer' },
];
