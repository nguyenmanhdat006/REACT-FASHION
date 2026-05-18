import type { Brand } from '@/types/product/product';

export type AdminBrandRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  websiteUrl: string;
  active: boolean;
};

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
