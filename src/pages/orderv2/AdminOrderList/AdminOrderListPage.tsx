import { Helmet } from 'react-helmet-async';
import { useCallback, useEffect, useMemo, useState, type JSX } from 'react';

import { LabelButton } from '@/components/buttons/LabelButton';
import { useOrders } from '@/hooks/order/useOrders';
import AdminOrderList from '@/pages/orderv2/AdminOrderList/sections/AdminOrderList';
import { orderToAdminOrderRow } from '@/pages/orderv2/AdminOrderList/orderDisplayMappers';
import { useAppSelector } from '@/store/hooks';

import type { AdminOrderRow } from './sections/AdminOrderList';

const PAGE_SIZE = 10;

export default function AdminOrderListPage(): JSX.Element {
  const [page, setPage] = useState(1);
  const { fetchOrdersPage, cancelOrder } = useOrders();
  const { items, totalPages, isLoading, error } = useAppSelector((s) => s.orders);

  const listParams = useMemo(
    () => ({
      page: page - 1,
      size: PAGE_SIZE,
    }),
    [page],
  );

  useEffect(() => {
    void fetchOrdersPage(listParams);
  }, [fetchOrdersPage, listParams]);

  const rows: AdminOrderRow[] = useMemo(
    () => items.map(orderToAdminOrderRow),
    [items],
  );

  const safeTotalPages = useMemo(() => Math.max(1, totalPages || 1), [totalPages]);

  const onCancelOrder = useCallback(
    async (row: AdminOrderRow) => {
      const reason = window.prompt(`Cancel order “${row.orderNumber}”? Enter reason:`);
      if (reason === null) return;
      const trimmed = reason.trim();
      if (!trimmed) return;
      await cancelOrder(row.id, trimmed, listParams);
    },
    [cancelOrder, listParams],
  );

  return (
    <>
      <Helmet>
        <title>Orders — Admin</title>
      </Helmet>
      <div className="mb-4 flex justify-end gap-3">
        <LabelButton
          label="Filters"
          type="button"
          className="bg-gray-white hover:bg-gray-100"
          ariaLabel="Open order filters"
        />
      </div>
      <AdminOrderList
        orders={rows}
        page={page}
        totalPages={safeTotalPages}
        onPageChange={setPage}
        onCancelOrder={(row) => void onCancelOrder(row)}
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
    </>
  );
}
