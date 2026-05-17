import { Helmet } from 'react-helmet-async';
import { useCallback, useEffect, useMemo, useState, type JSX } from 'react';

import AdminFormFooter from '@/components/admin/AdminFormFooter';
import AdminListPageLayout from '@/components/admin/AdminListPageLayout';
import {
  adminEntityPanelTitle,
  type AdminEntityPanelState,
} from '@/components/admin/types';
import TableView, { type TableColumn } from '@/components/TableView';
import { Badge } from '@/components/ui/badge';
import { useAdminCatalog } from '@/hooks/product/useAdminCatalog';
import {
  categoryToAdminCategoryRow,
  type AdminCategoryRow,
} from '@/pages/AdminCategoryV2/AdminCategoryList/categoryDisplayMappers';
import { useAppSelector } from '@/store/hooks';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 10;
const RESOURCE_LABEL = 'category';

function buildCategoryColumns(): TableColumn<AdminCategoryRow>[] {
  return [
    {
      id: 'name',
      header: 'Category',
      cellClassName: 'whitespace-normal py-4',
      cell: (category) => (
        <div className="min-w-0 max-w-xs">
          <p className="line-clamp-2 text-body-regular text-foreground">
            {category.name}
          </p>
          <p className="text-caption-sm-regular text-gray-500">{category.slug}</p>
        </div>
      ),
    },
    {
      id: 'parent',
      header: 'Parent',
      headerClassName: 'text-center text-body-medium text-foreground',
      cellClassName: 'text-center text-caption-lg-regular text-gray-900',
      cell: (category) => category.parentLabel,
    },
    {
      id: 'products',
      header: 'Products',
      headerClassName: 'text-center text-body-medium text-foreground',
      cellClassName: 'text-center text-caption-lg-medium text-foreground',
      cell: (category) => category.productCount.toLocaleString(),
    },
    {
      id: 'order',
      header: 'Order',
      headerClassName: 'text-center text-body-medium text-foreground',
      cellClassName: 'text-center text-caption-lg-regular text-gray-900',
      cell: (category) => category.displayOrder,
    },
    {
      id: 'status',
      header: 'Status',
      headerClassName: 'text-center text-body-medium',
      cellClassName: 'text-center',
      cell: (category) => (
        <Badge
          variant="outline"
          className={cn(
            'rounded-sm text-caption-sm-regular',
            category.active
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-gray-200 bg-gray-100 text-gray-700',
          )}
        >
          {category.active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];
}

export default function AdminCategoryListPage(): JSX.Element {
  const [panel, setPanel] = useState<AdminEntityPanelState>({ open: false });
  const { fetchCategories, deleteCategory } = useAdminCatalog();
  const { items: categories, isLoading: categoriesLoading, error: categoriesError } =
    useAppSelector((s) => s.categories);

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

  const columns = useMemo(() => buildCategoryColumns(), []);

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
        <TableView
          rows={allRows}
          columns={columns}
          pageSize={PAGE_SIZE}
          totalPages={totalPages}
          onEdit={openEditPanel}
          onDelete={onDeleteCategory}
        />
      </AdminListPageLayout>
    </>
  );
}
