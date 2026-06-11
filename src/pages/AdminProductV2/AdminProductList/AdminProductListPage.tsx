import { Helmet } from 'react-helmet-async';
import { useCallback, useEffect, useMemo, useState, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';

import { AdminListToolbar } from '@/components/admin/AdminListToolbar';
import {
  AdminListFilterPanel,
  toProductFetchParams,
  toSelectOptions,
  useAdminListFilters,
} from '@/components/admin/filters';
import ConfirmDialog from '@/components/ConfirmDialog';
import { ROUTES } from '@/constants';
import { useAdminCatalog } from '@/hooks/product/useAdminCatalog';
import { useProducts } from '@/hooks/product/useProducts';
import AdminProductList from '@/pages/AdminProductV2/AdminProductList/sections/AdminProductList';
import { productToAdminProductRow } from '@/pages/AdminProductV2/adminProductDisplayMappers';
import { useAppSelector } from '@/store/hooks';
import { DEFAULT_LIST_QUERY } from '@/types/common/common';

import type { AdminProductRow } from './sections/AdminProductList';

const LIST_PAGE_SIZE = 10;
const CATALOG_OPTIONS_QUERY = { ...DEFAULT_LIST_QUERY, page: 0, size: 200 };

export default function AdminProductListPage(): JSX.Element {
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState<AdminProductRow | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const listFilters = useAdminListFilters('product');
  const { fetchProductsPage, deleteProduct } = useProducts();
  const { fetchCategories, fetchBrands } = useAdminCatalog();
  const { items, page, totalPages, isLoading, error } = useAppSelector(s => s.products);
  const categories = useAppSelector(s => s.categories.items);
  const brands = useAppSelector(s => s.brands.items);

  const listQuery = useMemo(
    () =>
      toProductFetchParams(listFilters.applied, {
        page,
        size: LIST_PAGE_SIZE,
      }),
    [listFilters.applied, page],
  );

  useEffect(() => {
    void fetchProductsPage(listQuery);
  }, [fetchProductsPage, listQuery]);

  useEffect(() => {
    if (!listFilters.isOpen) return;
    void fetchCategories(CATALOG_OPTIONS_QUERY);
    void fetchBrands(CATALOG_OPTIONS_QUERY);
  }, [listFilters.isOpen, fetchCategories, fetchBrands]);

  const categoryOptions = useMemo(
    () => toSelectOptions(categories, 'All categories'),
    [categories],
  );
  const brandOptions = useMemo(() => toSelectOptions(brands, 'All brands'), [brands]);

  const rows: AdminProductRow[] = useMemo(
    () => items.map(productToAdminProductRow),
    [items],
  );

  const currentPage = page + 1;
  const safeTotalPages = Math.max(1, totalPages || 1);

  const onPageChange = useCallback(
    (nextPage: number) => {
      void fetchProductsPage(
        toProductFetchParams(listFilters.applied, {
          page: nextPage - 1,
          size: LIST_PAGE_SIZE,
        }),
      );
    },
    [fetchProductsPage, listFilters.applied],
  );

  const handleApplyFilters = useCallback(() => {
    const nextApplied = listFilters.draft;
    listFilters.applyDraft();
    void fetchProductsPage(
      toProductFetchParams(nextApplied, { page: 0, size: LIST_PAGE_SIZE }),
    );
  }, [fetchProductsPage, listFilters]);

  const goToAddProduct = useCallback(() => {
    navigate(ROUTES.ADMIN_PRODUCT_ADD);
  }, [navigate]);

  const goToProductDetail = useCallback(
    (row: AdminProductRow) => {
      navigate(ROUTES.ADMIN_PRODUCT_DETAIL(row.id));
    },
    [navigate],
  );

  const goToEditProduct = useCallback(
    (row: AdminProductRow) => {
      navigate(ROUTES.ADMIN_PRODUCT_EDIT(row.id));
    },
    [navigate],
  );

  const onDeleteProduct = useCallback((row: AdminProductRow) => {
    setDeleteTarget(row);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    const ok = await deleteProduct(deleteTarget.id, listQuery);
    setDeleteLoading(false);
    if (ok) setDeleteTarget(null);
  }, [deleteProduct, deleteTarget, listQuery]);

  return (
    <>
      <Helmet>
        <title>Products — Admin</title>
      </Helmet>
      <AdminListToolbar
        onFiltersClick={listFilters.openPanel}
        activeFilterCount={listFilters.activeFilterCount}
        filtersAriaLabel="Open product filters"
        onAddClick={goToAddProduct}
        addAriaLabel="Add product"
      />
      <AdminProductList
        products={rows}
        currentPage={currentPage}
        totalPages={safeTotalPages}
        onPageChange={onPageChange}
        onViewProduct={goToProductDetail}
        onEditProduct={goToEditProduct}
        onDeleteProduct={onDeleteProduct}
      />
      <ConfirmDialog
        open={deleteTarget != null}
        onOpenChange={open => {
          if (!open && !deleteLoading) setDeleteTarget(null);
        }}
        title="Delete product"
        description={
          deleteTarget
            ? `Are you sure you'd like to delete “${deleteTarget.name}”? This cannot be undone.`
            : 'Are you sure you want to delete this product? This cannot be undone.'
        }
        cancelLabel="Cancel"
        confirmVariant="destructive"
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
      />
      {isLoading && rows.length === 0 ? (
        <p className="mt-4 text-center text-caption-lg-regular text-muted-foreground">
          Loading…
        </p>
      ) : null}
      {error && !isLoading ? (
        <p className="mt-4 text-center text-caption-sm-regular text-destructive">
          {error}
        </p>
      ) : null}

      <AdminListFilterPanel
        preset="product"
        open={listFilters.isOpen}
        draft={listFilters.draft}
        categoryOptions={categoryOptions}
        brandOptions={brandOptions}
        onClose={listFilters.closePanel}
        onDraftChange={listFilters.patchDraft}
        onApply={handleApplyFilters}
        onClearAll={() => {
          listFilters.clearAll();
          void fetchProductsPage({ page: 0, size: LIST_PAGE_SIZE });
        }}
      />
    </>
  );
}
