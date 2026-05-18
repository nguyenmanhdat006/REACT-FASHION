import { Helmet } from 'react-helmet-async';
import { useCallback, useEffect, useMemo, useState, type JSX } from 'react';

import AdminListPageLayout from '@/components/admin/AdminListPageLayout';
import type { AdminEntityPanelState } from '@/components/admin/types';
import TableView, { type TableColumn } from '@/components/TableView';
import { Badge } from '@/components/ui/badge';
import AdminBrandV2Form, { ADMIN_BRAND_V2_FORM_ID } from '@/forms/AdminBrandV2';
import type { AdminBrandV2FormMode } from '@/forms/AdminBrandV2/types';
import { useAdminCatalog } from '@/hooks/product/useAdminCatalog';
import {
  brandToAdminBrandRow,
  type AdminBrandRow,
} from '@/pages/AdminBrandV2/brandDisplayMappers';
import { useAppSelector } from '@/store/hooks';
import { cn } from '@/lib/utils';

const LIST_PAGE_SIZE = 10;
const RESOURCE_LABEL = 'brand';

function panelToFormMode(panel: AdminEntityPanelState): AdminBrandV2FormMode {
  if (panel.open && panel.mode === 'edit') return 'update';
  return 'create';
}

function buildBrandColumns(): TableColumn<AdminBrandRow>[] {
  return [
    {
      id: 'name',
      header: 'Brand',
      cellClassName: 'whitespace-normal py-4',
      cell: (brand) => (
        <div className="min-w-0 max-w-xs">
          <p className="line-clamp-2 text-body-regular text-foreground">{brand.name}</p>
          <p className="text-caption-sm-regular text-gray-500">{brand.slug}</p>
        </div>
      ),
    },
    {
      id: 'description',
      header: 'Description',
      cellClassName: 'whitespace-normal py-4',
      cell: (brand) => (
        <p className="line-clamp-2 max-w-md text-caption-lg-regular text-gray-700">
          {brand.description}
        </p>
      ),
    },
    {
      id: 'website',
      header: 'Website',
      headerClassName: 'text-center text-body-medium text-foreground',
      cellClassName: 'text-center text-caption-sm-regular text-gray-500',
      cell: (brand) => <span className="line-clamp-1">{brand.websiteUrl}</span>,
    },
    {
      id: 'status',
      header: 'Status',
      headerClassName: 'text-center text-body-medium',
      cellClassName: 'text-center',
      cell: (brand) => (
        <Badge
          variant="outline"
          className={cn(
            'rounded-sm text-caption-sm-regular',
            brand.active
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-gray-200 bg-gray-100 text-gray-700',
          )}
        >
          {brand.active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];
}

export default function AdminBrandListPage(): JSX.Element {
  const [panel, setPanel] = useState<AdminEntityPanelState>({ open: false });
  const [formBusy, setFormBusy] = useState(false);
  const { fetchBrands, deleteBrand, clearBrandDetailState } = useAdminCatalog();
  const {
    items: brands,
    page,
    size,
    totalPages,
    isLoading: brandsLoading,
    error: brandsError,
  } = useAppSelector(s => s.brands);

  useEffect(() => {
    void fetchBrands({ page: 0, size: LIST_PAGE_SIZE });
  }, [fetchBrands]);

  useEffect(() => {
    if (!panel.open) {
      clearBrandDetailState();
    }
  }, [panel.open, clearBrandDetailState]);

  const rows: AdminBrandRow[] = useMemo(() => brands.map(brandToAdminBrandRow), [brands]);

  const currentPage = page + 1;
  const safeTotalPages = Math.max(1, totalPages || 1);

  const onPageChange = useCallback(
    (nextPage: number) => {
      void fetchBrands({ page: nextPage - 1, size: size || LIST_PAGE_SIZE });
    },
    [fetchBrands, size],
  );

  const openCreatePanel = useCallback(() => {
    setPanel({ open: true, mode: 'create' });
  }, []);

  const openEditPanel = useCallback((row: AdminBrandRow) => {
    setPanel({ open: true, mode: 'edit', entityId: row.id });
  }, []);

  const closePanel = useCallback(() => {
    setPanel({ open: false });
  }, []);

  const onFormSuccess = useCallback(() => {
    closePanel();
    void fetchBrands({ page, size: size || LIST_PAGE_SIZE });
  }, [closePanel, fetchBrands, page, size]);

  const onDeleteBrand = useCallback(
    async (row: AdminBrandRow) => {
      if (!window.confirm(`Delete brand “${row.name}”?`)) return;
      const ok = await deleteBrand(row.id);
      if (ok) {
        void fetchBrands({ page, size: size || LIST_PAGE_SIZE });
      }
    },
    [deleteBrand, fetchBrands, page, size],
  );

  const columns = useMemo(() => buildBrandColumns(), []);

  const panelFormKey = panel.open ? `${panel.mode}-${panel.entityId ?? 'new'}` : 'closed';

  return (
    <>
      <Helmet>
        <title>Brands — Admin</title>
      </Helmet>

      <AdminListPageLayout
        resourceLabel={RESOURCE_LABEL}
        panel={panel}
        onPanelChange={setPanel}
        onAddClick={openCreatePanel}
        loading={brandsLoading && rows.length === 0}
        error={brandsError}
        formId={ADMIN_BRAND_V2_FORM_ID}
        busy={formBusy}
        panelChildren={
          panel.open ? (
            <AdminBrandV2Form
              key={panelFormKey}
              mode={panelToFormMode(panel)}
              brandId={panel.mode === 'edit' ? panel.entityId : undefined}
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
          onDelete={onDeleteBrand}
        />
      </AdminListPageLayout>
    </>
  );
}
