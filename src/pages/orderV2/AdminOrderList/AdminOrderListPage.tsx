import { Helmet } from 'react-helmet-async';
import { useCallback, useEffect, useMemo, useState, type JSX } from 'react';

import AdminOrderList from '@/pages/orderV2/AdminOrderList/sections/AdminOrderList';
import { orderToAdminOrderRow } from '@/pages/orderV2/orderDisplayMappers';
import { useOrders } from '@/hooks/order/useOrders';
import { useAppSelector } from '@/store/hooks';

import type { AdminOrderRow } from './sections/AdminOrderList';

const PAGE_SIZE = 10;

/** Admin orders page — fetches from API via Redux + useOrders hook. */
export default function AdminOrderListPage(): JSX.Element {
  const [page, setPage] = useState(1);
  const { fetchOrders } = useOrders();
  const { items, totalPages, isLoading, error } = useAppSelector(s => s.orders);

  const listFilters = useMemo(
    () => ({
      page: page - 1,
      size: PAGE_SIZE,
    }),
    [page]
  );

  useEffect(() => {
    void fetchOrders(listFilters);
  }, [fetchOrders, listFilters]);

  const rows: AdminOrderRow[] = useMemo(
    () => items.map(orderToAdminOrderRow),
    [items]
  );

  const safeTotalPages = useMemo(() => Math.max(1, totalPages || 1), [totalPages]);

  return (
    <>
      <Helmet>
        <title>Orders — Admin</title>
      </Helmet>
      <AdminOrderList
        orders={rows}
        page={page}
        totalPages={safeTotalPages}
        onPageChange={setPage}
      />
      {isLoading && rows.length === 0 ? (
        <p className="mt-4 text-center text-caption-lg-regular text-muted-foreground">
          Loading…
        </p>
      ) : null}
      {error && !isLoading ? (
        <p className="mt-4 text-center text-caption-sm-regular text-destructive">{error}</p>
      ) : null}
    </>
  );
}
