import { Helmet } from 'react-helmet-async';
import { useCallback, useEffect, useMemo, useState, type JSX } from 'react';

import AdminFormFooter from '@/components/admin/AdminFormFooter';
import AdminListPageLayout from '@/components/admin/AdminListPageLayout';
import {
  adminEntityPanelTitle,
  type AdminEntityPanelState,
} from '@/components/admin/types';
import { useAdminCatalog } from '@/hooks/product/useAdminCatalog';
import AdminCategoryList from '@/pages/AdminCategoryV2/AdminCategoryList/sections/AdminCategoryList';
import { categoryToAdminCategoryRow } from '@/pages/AdminCategoryV2/AdminCategoryList/categoryDisplayMappers';
import { useAppSelector } from '@/store/hooks';

import type { AdminCategoryRow } from './sections/AdminCategoryList';

const PAGE_SIZE = 10;
const RESOURCE_LABEL = 'category';

export default function AdminCategoryListPage(): JSX.Element {
  const [page, setPage] = useState(1);
  const [panel, setPanel] = useState<AdminEntityPanelState>({ open: false });
  const { fetchCategories, deleteCategory } = useAdminCatalog();
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

  const closePanel = useCallback(() => {
    setPanel({ open: false });
  }, []);

  const openCreatePanel = useCallback(() => {
    setPanel({ open: true, mode: 'create' });
  }, []);

  const openEditPanel = useCallback((row: AdminCategoryRow) => {
    setPanel({ open: true, mode: 'edit', entityId: row.id });
  }, []);

  const onDeleteCategory = useCallback(
    async (row: AdminCategoryRow) => {
      if (!window.confirm(`Delete category “${row.name}”?`)) return;
      await deleteCategory(row.id);
    },
    [deleteCategory],
  );

  const panelTitle = adminEntityPanelTitle(RESOURCE_LABEL, panel) ?? '';
  const submitLabel =
    panel.open && panel.mode === 'create' ? 'Create category' : 'Save changes';

  return (
    <>
      <Helmet>
        <title>Categories — Admin</title>
      </Helmet>

      <AdminListPageLayout
        onAddClick={openCreatePanel}
        panelOpen={panel.open}
        panelTitle={panelTitle}
        onPanelClose={closePanel}
        loading={categoriesLoading && allRows.length === 0}
        error={categoriesError}
        panelFooter={
          <AdminFormFooter
            cancelLabel="Cancel"
            submitLabel={submitLabel}
            onCancel={closePanel}
            submitDisabled
          />
        }
        panelChildren={
          <p className="text-body-regular text-muted-foreground">
            Category form will be added here.
            {panel.open && panel.mode === 'edit' && panel.entityId
              ? ` (id: ${panel.entityId})`
              : null}
          </p>
        }
      >
        <AdminCategoryList
          categories={rows}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onEditCategory={openEditPanel}
          onDeleteCategory={(row) => void onDeleteCategory(row)}
        />
      </AdminListPageLayout>
    </>
  );
}
