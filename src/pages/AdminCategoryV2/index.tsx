import { Helmet } from 'react-helmet-async';
import { useCallback, useEffect, useMemo, useState, type JSX } from 'react';

import AdminListPageLayout from '@/components/admin/AdminListPageLayout';
import {
  AdminListFilterPanel,
  filterCategoryRows,
  toCategoryFetchParams,
  useAdminListFilters,
} from '@/components/admin/filters';
import type { AdminEntityPanelState } from '@/components/admin/types';
import TableView, { type TableColumn } from '@/components/TableView';
import { Badge } from '@/components/ui/badge';
import AdminCategoryV2Form, {
  ADMIN_CATEGORY_V2_FORM_ID,
} from '@/forms/AdminCategoryV2';
import type { AdminCategoryV2FormMode } from '@/forms/AdminCategoryV2/types';
import { useAdminCatalog } from '@/hooks/product/useAdminCatalog';
import {
  categoryToAdminCategoryRow,
  type AdminCategoryRow,
} from '@/pages/AdminCategoryV2/categoryDisplayMappers';
import { useAppSelector } from '@/store/hooks';
import { cn } from '@/lib/utils';

const LIST_PAGE_SIZE = 10;
const RESOURCE_LABEL = 'category';

function panelToFormMode(panel: AdminEntityPanelState): AdminCategoryV2FormMode {
  if (panel.open && panel.mode === 'edit') return 'update';
  return 'create';
}

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
  const [formBusy, setFormBusy] = useState(false);
  const listFilters = useAdminListFilters('category');
  const { fetchCategories, deleteCategory, clearCategoryDetailState } = useAdminCatalog();
  const {
    items: categories,
    page,
    size,
    totalPages,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useAppSelector((s) => s.categories);

  const listQuery = useMemo(
    () =>
      toCategoryFetchParams(listFilters.applied, {
        page,
        size: size || LIST_PAGE_SIZE,
      }),
    [listFilters.applied, page, size],
  );

  useEffect(() => {
    void fetchCategories(listQuery);
  }, [fetchCategories, listQuery]);

  const handleApplyFilters = useCallback(() => {
    const nextApplied = listFilters.draft;
    listFilters.applyDraft();
    void fetchCategories(
      toCategoryFetchParams(nextApplied, { page: 0, size: size || LIST_PAGE_SIZE }),
    );
  }, [fetchCategories, listFilters, size]);

  useEffect(() => {
    if (!panel.open) {
      clearCategoryDetailState();
    }
  }, [panel.open, clearCategoryDetailState]);

  const rows: AdminCategoryRow[] = useMemo(() => {
    const mapped = categories.map(categoryToAdminCategoryRow);
    return filterCategoryRows(mapped, listFilters.applied);
  }, [categories, listFilters.applied]);

  const currentPage = page + 1;
  const safeTotalPages = Math.max(1, totalPages || 1);

  const onPageChange = useCallback(
    (nextPage: number) => {
      void fetchCategories(
        toCategoryFetchParams(listFilters.applied, {
          page: nextPage - 1,
          size: size || LIST_PAGE_SIZE,
        }),
      );
    },
    [fetchCategories, listFilters.applied, size],
  );

  const openCreatePanel = useCallback(() => {
    setPanel({ open: true, mode: 'create' });
  }, []);

  const openEditPanel = useCallback((row: AdminCategoryRow) => {
    setPanel({ open: true, mode: 'edit', entityId: row.id });
  }, []);

  const closePanel = useCallback(() => {
    setPanel({ open: false });
  }, []);

  const onFormSuccess = useCallback(() => {
    closePanel();
    void fetchCategories(listQuery);
  }, [closePanel, fetchCategories, listQuery]);

  const onDeleteCategory = useCallback(
    async (row: AdminCategoryRow) => {
      if (!window.confirm(`Delete category “${row.name}”?`)) return;
      const ok = await deleteCategory(row.id);
      if (ok) {
        void fetchCategories(listQuery);
      }
    },
    [deleteCategory, fetchCategories, listQuery],
  );

  const columns = useMemo(() => buildCategoryColumns(), []);

  const panelFormKey = panel.open
    ? `${panel.mode}-${panel.entityId ?? 'new'}`
    : 'closed';

  return (
    <>
      <Helmet>
        <title>Categories — Admin</title>
      </Helmet>

      <AdminListPageLayout
        resourceLabel={RESOURCE_LABEL}
        panel={panel}
        onPanelChange={setPanel}
        onFiltersClick={listFilters.openPanel}
        activeFilterCount={listFilters.activeFilterCount}
        onAddClick={openCreatePanel}
        loading={categoriesLoading && rows.length === 0}
        error={categoriesError}
        formId={ADMIN_CATEGORY_V2_FORM_ID}
        busy={formBusy}
        panelChildren={
          panel.open ? (
            <AdminCategoryV2Form
              key={panelFormKey}
              mode={panelToFormMode(panel)}
              categoryId={panel.mode === 'edit' ? panel.entityId : undefined}
              onSuccess={onFormSuccess}
              onBusyChange={setFormBusy}
            />
          ) : null
        }
      >
        <TableView
          rows={rows}
          columns={columns}
          currentPage={currentPage}
          totalPages={safeTotalPages}
          onPageChange={onPageChange}
          onEdit={openEditPanel}
          onDelete={onDeleteCategory}
        />
      </AdminListPageLayout>

      <AdminListFilterPanel
        preset="category"
        open={listFilters.isOpen}
        draft={listFilters.draft}
        onClose={listFilters.closePanel}
        onDraftChange={listFilters.patchDraft}
        onApply={handleApplyFilters}
        onClearAll={() => {
          listFilters.clearAll();
          void fetchCategories({ page: 0, size: size || LIST_PAGE_SIZE });
        }}
      />
    </>
  );
}
