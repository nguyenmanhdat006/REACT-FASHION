import { Helmet } from 'react-helmet-async';
import { Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';

import { IconButton } from '@/components/buttons/IconButton';
import { LabelButton } from '@/components/buttons/LabelButton';
import { ROUTESV2 } from '@/constants';
import { useProducts } from '@/hooks/product/useProducts';
import AdminProductList from '@/pages/productV2/AdminProductList/sections/AdminProductList';
import { productToAdminProductRow } from '@/pages/productV2/productDisplayMappers';
import { useAppSelector } from '@/store/hooks';

import type { AdminProductRow } from './sections/AdminProductList';

const PAGE_SIZE = 10;

export default function AdminProductListPage(): JSX.Element {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { fetchProductsPage, deleteProduct } = useProducts();
  const { items, totalPages, isLoading, error } = useAppSelector(s => s.products);

  const goToAddProduct = useCallback(() => {
    navigate(ROUTESV2.ADMIN_PRODUCT_ADD);
  }, [navigate]);

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

  const onDeleteProduct = useCallback(
    async (row: AdminProductRow) => {
      if (!window.confirm(`Delete “${row.name}”?`)) return;
      await deleteProduct(row.id, listFilters);
    },
    [deleteProduct, listFilters]
  );

  return (
    <>
      <Helmet>
        <title>Products — Admin</title>
      </Helmet>
      <div className="mb-4 flex justify-end gap-3">
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
        onDeleteProduct={(row) => void onDeleteProduct(row)}
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
