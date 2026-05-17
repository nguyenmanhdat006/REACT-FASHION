import { Helmet } from 'react-helmet-async';
import { Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState, type JSX } from 'react';

import { IconButton } from '@/components/buttons/IconButton';
import { LabelButton } from '@/components/buttons/LabelButton';
import { useAdminCatalog } from '@/hooks/product/useAdminCatalog';
import AdminCategoryList from '@/pages/AdminCategoryV2/AdminCategoryList/sections/AdminCategoryList';
import { categoryToAdminCategoryRow } from '@/pages/AdminCategoryV2/AdminCategoryList/categoryDisplayMappers';
import { useAppSelector } from '@/store/hooks';

import type { AdminCategoryRow } from './sections/AdminCategoryList';

const PAGE_SIZE = 10;

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function AdminCategoryListPage(): JSX.Element {
  const [page, setPage] = useState(1);
  const { fetchCategories, createCategory, deleteCategory } = useAdminCatalog();
  const { categories, categoriesLoading, categoriesError } = useAppSelector(
    (s) => s.products,
  );

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const allRows: AdminCategoryRow[] = useMemo(
    () => categories.map(categoryToAdminCategoryRow),
    [categories],
  );

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(allRows.length / PAGE_SIZE)),
    [allRows.length],
  );

  const rows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return allRows.slice(start, start + PAGE_SIZE);
  }, [allRows, page]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const onAddCategory = useCallback(async () => {
    const name = window.prompt('Category name:');
    if (!name?.trim()) return;
    const slugInput = window.prompt('Slug (optional):', slugify(name));
    if (slugInput === null) return;
    const slug = slugInput.trim() || slugify(name);
    await createCategory({ name: name.trim(), slug, active: true });
  }, [createCategory]);

  const onDeleteCategory = useCallback(
    async (row: AdminCategoryRow) => {
      if (!window.confirm(`Delete category “${row.name}”?`)) return;
      await deleteCategory(row.id);
    },
    [deleteCategory],
  );

  return (
    <>
      <Helmet>
        <title>Categories — Admin</title>
      </Helmet>
      <div className="mb-4 flex justify-start gap-3">
        <LabelButton
          label="Filters"
          type="button"
          className="bg-gray-white hover:bg-gray-100"
          ariaLabel="Open category filters"
        />
        <IconButton
          icon={Plus}
          ariaLabel="Add category"
          onClick={() => void onAddCategory()}
          className="bg-primary hover:bg-primary/90"
          iconClassName="text-white"
        />
      </div>
      <AdminCategoryList
        categories={rows}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onDeleteCategory={(row) => void onDeleteCategory(row)}
      />
      {categoriesLoading && allRows.length === 0 ? (
        <p className="mt-4 text-center text-caption-lg-regular text-muted-foreground">
          Loading…
        </p>
      ) : null}
      {categoriesError && !categoriesLoading ? (
        <p className="mt-4 text-center text-caption-sm-regular text-destructive">
          {categoriesError}
        </p>
      ) : null}
    </>
  );
}
