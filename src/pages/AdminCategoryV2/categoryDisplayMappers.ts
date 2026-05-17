import type { Category } from '@/types/product/product';

export type AdminCategoryRow = {
  id: string;
  name: string;
  slug: string;
  parentLabel: string;
  productCount: number;
  displayOrder: number;
  active: boolean;
};

export function categoryToAdminCategoryRow(category: Category): AdminCategoryRow {
  return {
    id: category.id,
    name: category.name?.trim() || '—',
    slug: category.slug?.trim() || '—',
    parentLabel: category.parentName?.trim() || category.parentId || '—',
    productCount: category.productCount ?? 0,
    displayOrder: category.displayOrder ?? 0,
    active: category.active !== false,
  };
}
