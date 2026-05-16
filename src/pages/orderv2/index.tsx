import { useEffect, useState } from 'react';
import { OrderDetailsListSection } from "./OrderDetailsListSection";
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchOrdersThunk } from '@/store/thunks/orderThunks';
import { OrderStatus as GlobalOrderStatus } from '@/types/order/order';

type OrderStatus = 'all' | 'pending' | 'shipping' | 'arrived' | 'cancelled';

const ORDER_FILTERS = [
  { id: 'all', label: 'Tất cả', count: 0 },
  { id: 'pending', label: 'Chờ xử lý', count: 0 },
  { id: 'shipping', label: 'Đang giao', count: 0 },
  { id: 'arrived', label: 'Đã giao', count: 0 },
  { id: 'cancelled', label: 'Đã hủy', count: 0 },
];

export const Frame = (): JSX.Element => {
  const [activeStatus, setActiveStatus] = useState<OrderStatus>('all');
  const dispatch = useAppDispatch();
  const { items: orders, isLoading } = useAppSelector((state) => state.orders);

  useEffect(() => {
    // Fetch orders on mount
    void dispatch(fetchOrdersThunk({ page: 0, size: 20 }));
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

  return (
    <main className="relative w-full bg-white px-4 py-6 sm:px-6">
      <div className="mx-auto w-full max-w-[1140px]">
        {/* Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {filtersWithCounts.map((filter) => (
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
              <span className="text-caption-sm-regular text-gray-500">{filter.count}</span>
            </button>
          ))}
        </div>

        {/* Order Details List */}
        <section aria-label="Order details" className="w-full">
          {isLoading && orders.length === 0 ? (
            <div className="text-center py-10">Đang tải đơn hàng...</div>
          ) : (
            <OrderDetailsListSection orders={filteredOrders} />
          )}
        </section>
      </div>
    </main>
  );
};

export default Frame;
