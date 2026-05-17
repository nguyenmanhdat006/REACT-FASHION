import { Helmet } from 'react-helmet-async';
import { Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';

import { IconButton } from '@/components/buttons/IconButton';
import { LabelButton } from '@/components/buttons/LabelButton';
import ConfirmDialog from '@/components/ConfirmDialog';
import { ROUTESV2 } from '@/constants';
import { useProducts } from '@/hooks/product/useProducts';
import AdminProductList from '@/pages/AdminProductV2/AdminProductList/sections/AdminProductList';
import { productToAdminProductRow } from '@/pages/AdminProductV2/adminProductDisplayMappers';
import { useAppSelector } from '@/store/hooks';

import type { AdminProductRow } from './sections/AdminProductList';

const PAGE_SIZE = 10;

export default function AdminProductListPage(): JSX.Element {
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<AdminProductRow | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();
  const { fetchProductsPage, deleteProduct } = useProducts();
  const { items, totalPages, isLoading, error } = useAppSelector(s => s.products);

  const goToAddProduct = useCallback(() => {
    navigate(ROUTESV2.ADMIN_PRODUCT_ADD);
  }, [navigate]);

  const goToProductDetail = useCallback(
    (row: AdminProductRow) => {
      navigate(ROUTESV2.ADMIN_PRODUCT_DETAIL(row.id));
    },
    [navigate]
  );

  const goToEditProduct = useCallback(
    (row: AdminProductRow) => {
      navigate(ROUTESV2.ADMIN_PRODUCT_EDIT(row.id));
    },
    [navigate]
  );

  const listFilters = useMemo(
    () => ({
      page: page - 1,
      size: PAGE_SIZE,
      sortBy: 'createdAt',
      sortDirection: 'desc' as const,
    }),
    [page]
  );

  useEffect(() => {
    void fetchProductsPage(listFilters);
  }, [fetchProductsPage, listFilters]);

  const rows: AdminProductRow[] = useMemo(
    () => items.map(productToAdminProductRow),
    [items]
  );

  const safeTotalPages = useMemo(() => Math.max(1, totalPages || 1), [totalPages]);

  const onDeleteProduct = useCallback((row: AdminProductRow) => {
    setDeleteTarget(row);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    const ok = await deleteProduct(deleteTarget.id, listFilters);
    setDeleteLoading(false);
    if (ok) setDeleteTarget(null);
  }, [deleteProduct, deleteTarget, listFilters]);

  return (
    <>
      <Helmet>
        <title>Products — Admin</title>
      </Helmet>
      <div className="mb-4 flex justify-start gap-3">
        <LabelButton label="Filters" type="button" className="bg-gray-white hover:bg-gray-100" ariaLabel="Open product filters" />
        <IconButton
          icon={Plus}
          ariaLabel="Add product"
          onClick={goToAddProduct}
          className="bg-primary hover:bg-primary/90"
          iconClassName="text-white"
        />
      </div>
      <AdminProductList
        products={rows}
        page={page}
        totalPages={safeTotalPages}
        onPageChange={setPage}
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
        <p className="mt-4 text-center text-caption-lg-regular text-muted-foreground">Loading…</p>
      ) : null}
      {error && !isLoading ? (
        <p className="mt-4 text-center text-caption-sm-regular text-destructive">{error}</p>
      ) : null}
    </>
  );
}
