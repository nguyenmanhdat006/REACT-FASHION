import { useMemo } from 'react';

import TableView, { type TableColumn } from '@/components/TableView';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { OrderStatus, PaymentStatus, ShipmentStatus } from '@/types/order/order';
import { OrderStatus as OrderStatusEnum, ShipmentStatus as ShipmentStatusEnum } from '@/types/order/order';

export type AdminOrderRow = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  itemsCount: number;
  totalFormatted: string;
  status: OrderStatus;
  statusLabel: string;
  paymentStatus: PaymentStatus;
  paymentStatusLabel: string;
  orderedAtFormatted: string;
  shipmentId: number | null;
  shipmentStatus?: ShipmentStatus;
  canCancel: boolean;
};

export type AdminOrderListProps = {
  orders: AdminOrderRow[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  selectedIds?: string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  className?: string;
  onEditOrder?: (order: AdminOrderRow) => void;
};

export const ORDER_STATUS_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  [OrderStatusEnum.PENDING]: [OrderStatusEnum.CONFIRMED, OrderStatusEnum.CANCELLED],
  [OrderStatusEnum.CONFIRMED]: [OrderStatusEnum.PROCESSING, OrderStatusEnum.CANCELLED],
  [OrderStatusEnum.PROCESSING]: [OrderStatusEnum.SHIPPED, OrderStatusEnum.CANCELLED],
  [OrderStatusEnum.SHIPPED]: [OrderStatusEnum.DELIVERED],
};

export const SHIPMENT_STATUS_TRANSITIONS: Partial<Record<ShipmentStatus, ShipmentStatus[]>> = {
  [ShipmentStatusEnum.PENDING]: [ShipmentStatusEnum.PICKED_UP, ShipmentStatusEnum.CANCELLED],
  [ShipmentStatusEnum.PICKED_UP]: [ShipmentStatusEnum.IN_TRANSIT],
  [ShipmentStatusEnum.IN_TRANSIT]: [ShipmentStatusEnum.OUT_FOR_DELIVERY],
  [ShipmentStatusEnum.OUT_FOR_DELIVERY]: [ShipmentStatusEnum.DELIVERED, ShipmentStatusEnum.FAILED_DELIVERY],
  [ShipmentStatusEnum.FAILED_DELIVERY]: [ShipmentStatusEnum.OUT_FOR_DELIVERY, ShipmentStatusEnum.CANCELLED],
};

export const formatStatusLabel = (status: string) =>
  status
    .split('_')
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(' ');

export const ORDER_STATUS_BADGE: Partial<Record<OrderStatus, string>> = {
  [OrderStatusEnum.PENDING]: 'border-amber-200 bg-amber-50 text-amber-800',
  [OrderStatusEnum.CONFIRMED]: 'border-blue-200 bg-blue-50 text-blue-800',
  [OrderStatusEnum.PROCESSING]: 'border-indigo-200 bg-indigo-50 text-indigo-800',
  [OrderStatusEnum.SHIPPED]: 'border-violet-200 bg-violet-50 text-violet-800',
  [OrderStatusEnum.DELIVERED]: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  [OrderStatusEnum.CANCELLED]: 'border-gray-200 bg-gray-100 text-gray-700',
  [OrderStatusEnum.REFUNDED]: 'border-rose-200 bg-rose-50 text-rose-800',
};

function buildOrderColumns(): TableColumn<AdminOrderRow>[] {
  return [
    {
      id: 'order',
      header: 'Order',
      headerClassName: 'text-left text-body-medium text-foreground',
      cellClassName: 'whitespace-normal py-4',
      cell: (order) => (
        <div className="min-w-0">
          <p className="text-body-regular text-foreground">{order.orderNumber}</p>
          <p className="text-caption-sm-regular text-muted-foreground mt-0.5">
            {order.orderedAtFormatted}
          </p>
        </div>
      ),
    },
    {
      id: 'customer',
      header: 'Customer',
      headerClassName: 'text-left text-body-medium text-foreground',
      cellClassName: 'whitespace-normal py-4',
      cell: (order) => (
        <div className="min-w-0 max-w-xs">
          <p className="line-clamp-1 text-body-regular text-foreground">
            {order.customerName}
          </p>
          <p className="line-clamp-1 text-caption-sm-regular text-muted-foreground mt-0.5">
            {order.customerEmail}
          </p>
        </div>
      ),
    },
    {
      id: 'items',
      header: 'Items',
      headerClassName: 'text-center text-body-medium text-foreground',
      cellClassName: 'text-center text-caption-lg-regular text-foreground',
      cell: (order) => order.itemsCount.toLocaleString(),
    },
    {
      id: 'total',
      header: 'Total',
      headerClassName: 'text-center text-body-medium text-foreground',
      cellClassName: 'text-center text-caption-lg-medium text-foreground',
      cell: (order) => order.totalFormatted,
    },
    {
      id: 'status',
      header: 'Order Status',
      headerClassName: 'text-center text-body-medium text-foreground',
      cellClassName: 'text-center',
      cell: (order) => (
        <Badge
          variant="outline"
          className={cn(
            'mx-auto rounded-sm text-caption-sm-regular',
            ORDER_STATUS_BADGE[order.status] ?? 'border-primary/40 bg-primary/5 text-primary',
          )}
        >
          {order.statusLabel}
        </Badge>
      ),
    },
    {
      id: 'shippingStatus',
      header: 'Shipping Status',
      headerClassName: 'text-center text-body-medium text-foreground',
      cellClassName: 'text-center',
      cell: (order) => {
        if (!order.shipmentId) {
          return <span className="text-caption-sm-regular text-muted-foreground">No Shipment</span>;
        }

        return (
          <Badge
            variant="outline"
            className="mx-auto rounded-sm border-gray-200 bg-gray-50 text-gray-800 text-caption-sm-regular"
          >
            {formatStatusLabel(order.shipmentStatus || ShipmentStatusEnum.PENDING)}
          </Badge>
        );
      },
    },
    {
      id: 'payment',
      header: 'Payment',
      headerClassName: 'text-center text-body-medium text-foreground',
      cellClassName: 'text-center',
      cell: (order) => (
        <Badge
          variant="outline"
          className="rounded-sm border-gray-200 bg-gray-50 text-gray-800 text-caption-sm-regular"
        >
          {order.paymentStatusLabel}
        </Badge>
      ),
    },
  ];
}

function AdminOrderList({
  orders,
  currentPage,
  totalPages,
  onPageChange,
  selectedIds,
  onSelectedIdsChange,
  className,
  onEditOrder,
}: AdminOrderListProps) {
  const columns = useMemo(() => buildOrderColumns(), []);

  return (
    <TableView
      className={className}
      rows={orders}
      columns={columns}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      selectedIds={selectedIds}
      onSelectedIdsChange={onSelectedIdsChange}
      onEdit={onEditOrder}
      rowActionsMenuClassName="min-w-36"
    />
  );
}

export default AdminOrderList;