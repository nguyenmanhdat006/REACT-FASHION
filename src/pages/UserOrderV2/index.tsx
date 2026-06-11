import { type JSX, useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import PaginationBar from '@/components/PaginationBar';
import { useOrders } from '@/hooks/order/useOrders';
import { OrderDetailsListSection } from '@/pages/UserOrderV2/OrderDetailsListSection';
import { useAppSelector } from '@/store/hooks';
import { OrderStatus as GlobalOrderStatus } from '@/types/order/order';

type OrderStatus = 'all' | 'pending' | 'shipping' | 'arrived' | 'cancelled';

const LIST_PAGE_SIZE = 10;

const ORDER_FILTERS = [
  { id: 'pending', label: 'Pending', count: 0 },
  { id: 'shipping', label: 'On Shipping', count: 0 },
  { id: 'arrived', label: 'Arrived', count: 0 },
  { id: 'cancelled', label: 'Cancelled', count: 0 },
];

export default function UserOrderV2(): JSX.Element {
  const [activeStatus, setActiveStatus] = useState<OrderStatus>('pending');
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const { fetchMyOrdersPage } = useOrders();
  const { items: orders, page, size, totalPages, isLoading } = useAppSelector(
    state => state.orders,
  );

  const listParams = useMemo(
    () => ({
      page,
      size: size || LIST_PAGE_SIZE,
    }),
    [page, size],
  );

  useEffect(() => {
    void fetchMyOrdersPage({ page: 0, size: LIST_PAGE_SIZE });
    setPortalTarget(document.getElementById('header-actions-portal'));
  }, [fetchMyOrdersPage]);

  const statusMap: Record<string, GlobalOrderStatus[]> = {
    pending: [GlobalOrderStatus.PENDING, GlobalOrderStatus.CONFIRMED],
    shipping: [GlobalOrderStatus.SHIPPED],
    arrived: [GlobalOrderStatus.DELIVERED],
    cancelled: [GlobalOrderStatus.CANCELLED],
  };

  const filteredOrders = orders.filter(order => {
    if (activeStatus === 'all') return true;
    const targetStatuses = statusMap[activeStatus] || [];
    return targetStatuses.includes(order.status);
  });

  const filtersWithCounts = ORDER_FILTERS.map(filter => {
    const count =
      filter.id === 'all'
        ? orders.length
        : orders.filter(o => (statusMap[filter.id] || []).includes(o.status)).length;
    return { ...filter, count };
  });

  const currentPage = listParams.page + 1;
  const safeTotalPages = Math.max(1, totalPages || 1);

  const onPageChange = useCallback(
    (nextPage: number) => {
      void fetchMyOrdersPage({
        page: nextPage - 1,
        size: listParams.size,
      });
    },
    [fetchMyOrdersPage, listParams.size],
  );

  const tabsContent = (
    <div className="flex flex-wrap gap-2">
      {filtersWithCounts.map(filter => (
        <button
          key={filter.id}
          onClick={() => setActiveStatus(filter.id as OrderStatus)}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-body-regular font-medium transition-colors ${
            activeStatus === filter.id
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          {filter.label}
          <span
            className={`inline-flex h-5 w-5 items-center justify-center rounded-sm text-caption-xs-regular ${
              activeStatus === filter.id ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
            }`}
          >
            {filter.count}
          </span>
        </button>
      ))}
    </div>
  );

  return (
    <main className="relative min-h-screen w-full bg-gray-50 px-4 py-6 sm:px-6">
      {portalTarget ? createPortal(tabsContent, portalTarget) : tabsContent}
      <div className="mx-auto w-full max-w-[1140px]">
        <section aria-label="Order details" className="w-full">
          {isLoading && orders.length === 0 ? (
            <div className="py-10 text-center">Loading orders...</div>
          ) : (
            <>
              <OrderDetailsListSection orders={filteredOrders} />
              <PaginationBar
                currentPage={currentPage}
                totalPages={safeTotalPages}
                onPageChange={onPageChange}
              />
            </>
          )}
        </section>
      </div>
    </main>
  );
}
