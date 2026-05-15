import type { AdminBrandRow } from '@/pages/productV2/AdminBrandList/sections/AdminBrandList';
import type { Brand } from '@/types/product/product';

export function brandToAdminBrandRow(brand: Brand): AdminBrandRow {
  return {
    id: brand.id,
    name: brand.name?.trim() || '—',
    slug: brand.slug?.trim() || '—',
    description: brand.description?.trim() || '—',
    websiteUrl: brand.websiteUrl?.trim() || '—',
    active: brand.active !== false,
  };
}
