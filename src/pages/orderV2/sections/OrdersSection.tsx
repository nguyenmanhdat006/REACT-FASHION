import { JSX, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchOrdersThunk } from '@/store/thunks/orderThunks';
import { useAuth } from '@/hooks/auth/useAuth';
import { OrdersHeader } from '../components/OrdersHeader';
import { OrdersTable } from '../components/OrdersTable';
import { OrdersPagination } from '../components/OrdersPagination';
import type { Order } from '@/types/order/order';

interface OrdersSectionProps {
  onOrderSelect?: (order: Order) => void;
}

export const OrdersSection = ({ onOrderSelect }: OrdersSectionProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { items, page, totalPages, isLoading } = useAppSelector((state) => state.orders);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(page);

  useEffect(() => {
    void dispatch(fetchOrdersThunk({ page: currentPage - 1, size: 20 }));
  }, [dispatch, currentPage]);

  const handleSelectRow = (orderId: string, selected: boolean) => {
    const newSelected = new Set(selectedRowIds);
    if (selected) {
      newSelected.add(orderId);
    } else {
      newSelected.delete(orderId);
    }
    setSelectedRowIds(newSelected);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedRowIds(new Set(items.map((order) => order.id)));
    } else {
      setSelectedRowIds(new Set());
    }
  };

  const handleViewDetails = (order: Order) => {
    onOrderSelect?.(order);
  };

  const handleDelete = (orderId: string) => {
    // TODO: Implement delete order logic
    console.log('Delete order:', orderId);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <section className="flex flex-col w-full items-start relative self-stretch overflow-y-auto bg-transparent">
      <OrdersHeader
        orderCount={items.length}
        userName={user?.fullName || 'User'}
        userImage={user?.avatarUrl || undefined}
      />

      <div className="flex flex-col items-center gap-4 p-8 relative flex-1 self-stretch w-full">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Loading orders...</div>
        ) : (
          <>
            <OrdersTable
              orders={items}
              selectedRowIds={selectedRowIds}
              onSelectRow={handleSelectRow}
              onSelectAll={handleSelectAll}
              onViewDetails={handleViewDetails}
              onDelete={handleDelete}
            />

            {totalPages > 1 && (
              <OrdersPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
};
