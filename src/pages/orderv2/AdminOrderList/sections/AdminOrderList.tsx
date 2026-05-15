import { useMemo } from 'react';
import { MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import TableView, { type TableColumn } from '@/components/TableView';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ROUTESV2 } from '@/constants';
import { cn } from '@/lib/utils';
import type { OrderStatus, PaymentStatus } from '@/types/order/order';
import { OrderStatus as OrderStatusEnum } from '@/types/order/order';

export type AdminOrderRow = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  itemsCount: number;
  firstItemImageUrl: string;
  totalFormatted: string;
  status: OrderStatus;
  statusLabel: string;
  paymentStatus: PaymentStatus;
  paymentStatusLabel: string;
  orderedAtFormatted: string;
  canCancel: boolean;
};

export type AdminOrderListProps = {
  orders: AdminOrderRow[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  selectedIds?: string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  className?: string;
  onCancelOrder?: (order: AdminOrderRow) => void;
};

const ORDER_STATUS_BADGE: Partial<Record<OrderStatus, string>> = {
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
      id: 'thumb',
      header: '',
      cellClassName: 'whitespace-normal py-4',
      cell: (order) => (
        <img
          src={order.firstItemImageUrl}
          alt=""
          className="size-12 shrink-0 rounded-md object-cover"
          loading="lazy"
        />
      ),
    },
    {
      id: 'order',
      header: 'Order',
      cellClassName: 'whitespace-normal py-4',
      cell: (order) => (
        <div className="min-w-0">
          <p className="text-body-regular text-foreground">{order.orderNumber}</p>
          <p className="text-caption-sm-regular text-gray-500">
            {order.orderedAtFormatted}
          </p>
        </div>
      ),
    },
    {
      id: 'customer',
      header: 'Customer',
      cellClassName: 'whitespace-normal py-4',
      cell: (order) => (
        <div className="min-w-0 max-w-xs">
          <p className="line-clamp-1 text-body-regular text-foreground">
            {order.customerName}
          </p>
          <p className="line-clamp-1 text-caption-sm-regular text-gray-500">
            {order.customerEmail}
          </p>
        </div>
      ),
    },
    {
      id: 'items',
      header: 'Items',
      headerClassName: 'text-center text-body-medium text-foreground',
      cellClassName: 'text-center text-caption-lg-regular text-gray-900',
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
      header: 'Status',
      headerClassName: 'text-center text-body-medium',
      cellClassName: 'text-center',
      cell: (order) => (
        <Badge
          variant="outline"
          className={cn(
            'rounded-sm text-caption-sm-regular',
            ORDER_STATUS_BADGE[order.status] ??
              'border-primary/40 bg-primary/5 text-primary',
          )}
        >
          {order.statusLabel}
        </Badge>
      ),
    },
    {
      id: 'payment',
      header: 'Payment',
      headerClassName: 'text-center text-body-medium',
      cellClassName: 'text-center',
      cell: (order) => (
        <Badge
          variant="outline"
          className="rounded-sm border-gray-200 bg-gray-50 text-caption-sm-regular text-gray-800"
        >
          {order.paymentStatusLabel}
        </Badge>
      ),
    },
  ];
}

function AdminOrderList({
  orders,
  page,
  totalPages = 1,
  onPageChange,
  selectedIds,
  onSelectedIdsChange,
  className,
  onCancelOrder,
}: AdminOrderListProps) {
  const navigate = useNavigate();
  const columns = useMemo(() => buildOrderColumns(), []);

  return (
    <TableView
      className={className}
      rows={orders}
      columns={columns}
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
      selectedIds={selectedIds}
      onSelectedIdsChange={onSelectedIdsChange}
      selectAllAriaLabel="Select all orders"
      getRowSelectionAriaLabel={(o) => `Select order ${o.orderNumber}`}
      renderRowActions={(order) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground"
              aria-label={`Actions for ${order.orderNumber}`}
            >
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigate(ROUTESV2.ORDER_DETAIL(order.id))}
            >
              View details
            </DropdownMenuItem>
            {order.canCancel ? (
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onCancelOrder?.(order)}
              >
                Cancel order
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    />
  );
}

export default AdminOrderList;
