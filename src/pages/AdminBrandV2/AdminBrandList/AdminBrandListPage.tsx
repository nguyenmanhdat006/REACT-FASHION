import { Helmet } from 'react-helmet-async';
import { Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, type JSX } from 'react';

import { IconButton } from '@/components/buttons/IconButton';
import { LabelButton } from '@/components/buttons/LabelButton';
import { useAdminCatalog } from '@/hooks/product/useAdminCatalog';
import AdminBrandList from '@/pages/AdminBrandV2/AdminBrandList/sections/AdminBrandList';
import { brandToAdminBrandRow } from '@/pages/AdminBrandV2/AdminBrandList/brandDisplayMappers';
import { useAppSelector } from '@/store/hooks';

import type { AdminBrandRow } from './sections/AdminBrandList';

const PAGE_SIZE = 10;

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function AdminBrandListPage(): JSX.Element {
  const { fetchBrands, createBrand, deleteBrand } = useAdminCatalog();
  const { brands, brandsLoading, brandsError } = useAppSelector((s) => s.products);

  useEffect(() => {
    void fetchBrands();
  }, [fetchBrands]);

  const allRows: AdminBrandRow[] = useMemo(
    () => brands.map(brandToAdminBrandRow),
    [brands],
  );

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(allRows.length / PAGE_SIZE)),
    [allRows.length],
  );

  const onAddBrand = useCallback(async () => {
    const name = window.prompt('Brand name:');
    if (!name?.trim()) return;
    const slugInput = window.prompt('Slug (optional):', slugify(name));
    if (slugInput === null) return;
    const slug = slugInput.trim() || slugify(name);
    await createBrand({ name: name.trim(), slug, active: true });
  }, [createBrand]);

  const onDeleteBrand = useCallback(
    async (row: AdminBrandRow) => {
      if (!window.confirm(`Delete brand “${row.name}”?`)) return;
      await deleteBrand(row.id);
    },
    [deleteBrand],
  );

  return (
    <>
      <Helmet>
        <title>Brands — Admin</title>
      </Helmet>
      <div className="mb-4 flex justify-start gap-3">
        <LabelButton
          label="Filters"
          type="button"
          className="bg-gray-white hover:bg-gray-100"
          ariaLabel="Open brand filters"
        />
        <IconButton
          icon={Plus}
          ariaLabel="Add brand"
          onClick={() => void onAddBrand()}
          className="bg-primary hover:bg-primary/90"
          iconClassName="text-white"
        />
      </div>
      <AdminBrandList
        brands={allRows}
        pageSize={PAGE_SIZE}
        totalPages={totalPages}
        onDeleteBrand={(row) => void onDeleteBrand(row)}
      />
      {brandsLoading && allRows.length === 0 ? (
        <p className="mt-4 text-center text-caption-lg-regular text-muted-foreground">
          Loading…
        </p>
      ) : null}
      {brandsError && !brandsLoading ? (
        <p className="mt-4 text-center text-caption-sm-regular text-destructive">
          {brandsError}
        </p>
      ) : null}
    </>
  );
}
