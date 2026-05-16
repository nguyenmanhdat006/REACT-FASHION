import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { OrderDetailsListSection } from "./OrderDetailsListSection";
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchOrdersThunk } from '@/store/thunks/orderThunks';
import { OrderStatus as GlobalOrderStatus } from '@/types/order/order';

type OrderStatus = 'all' | 'pending' | 'shipping' | 'arrived' | 'cancelled';

const ORDER_FILTERS = [
  { id: 'pending', label: 'Pending', count: 0 },
  { id: 'shipping', label: 'On Shipping', count: 0 },
  { id: 'arrived', label: 'Arrived', count: 0 },
  { id: 'cancelled', label: 'Cancelled', count: 0 },
];

export const Frame = (): JSX.Element => {
  const [activeStatus, setActiveStatus] = useState<OrderStatus>('pending');
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const dispatch = useAppDispatch();
  const { items: orders, isLoading } = useAppSelector((state) => state.orders);

  useEffect(() => {
    // Fetch orders on mount
    void dispatch(fetchOrdersThunk({ page: 0, size: 20 }));
    // Set portal target after mount to ensure the layout header is in the DOM
    setPortalTarget(document.getElementById('header-actions-portal'));
  }, [dispatch]);

  // Map local filter status to global order status
  const statusMap: Record<string, GlobalOrderStatus[]> = {
    pending: [GlobalOrderStatus.PENDING, GlobalOrderStatus.CONFIRMED],
    shipping: [GlobalOrderStatus.SHIPPED],
    arrived: [GlobalOrderStatus.DELIVERED],
    cancelled: [GlobalOrderStatus.CANCELLED],
  };

  const filteredOrders = orders.filter((order) => {
    if (activeStatus === 'all') return true;
    const targetStatuses = statusMap[activeStatus] || [];
    return targetStatuses.includes(order.status);
  });

  // Update counts
  const filtersWithCounts = ORDER_FILTERS.map((filter) => {
    const count = filter.id === 'all'
      ? orders.length
      : orders.filter((o) => (statusMap[filter.id] || []).includes(o.status)).length;
    return { ...filter, count };
  });

  const tabsContent = (
    <div className="flex flex-wrap gap-2">
      {filtersWithCounts.map((filter) => (
        <button
          key={filter.id}
          onClick={() => setActiveStatus(filter.id as OrderStatus)}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-body-regular font-medium transition-colors ${activeStatus === filter.id
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50'
            }`}
        >
          {filter.label}
          <span className={`inline-flex items-center justify-center w-5 h-5 rounded-sm text-caption-xs-regular ${activeStatus === filter.id ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
            }`}>
            {filter.count}
          </span>
        </button>
      ))}
    </div>
  );

  return (
    <main className="relative w-full bg-white px-4 py-6 sm:px-6">
      {portalTarget ? createPortal(tabsContent, portalTarget) : tabsContent}
      <div className="mx-auto w-full max-w-[1140px]">

        {/* Order Details List */}
        <section aria-label="Order details" className="w-full">
          {isLoading && orders.length === 0 ? (
            <div className="text-center py-10">Loading orders...</div>
          ) : (
            <OrderDetailsListSection orders={filteredOrders} />
          )}
        </section>
      </div>
    </main>
  );
};

export default Frame;
