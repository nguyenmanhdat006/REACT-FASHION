import { useMemo } from 'react';
import { MoreVertical } from 'lucide-react';

import TableView, { type TableColumn } from '@/components/TableView';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type AdminOrderRow = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  totalFormatted: string;
  status: string;
  itemsCount: number;
  createdAt: string;
  dateFormatted: string;
  paymentStatus: string;
};

export type AdminOrderListProps = {
  orders: AdminOrderRow[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  selectedIds?: string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  className?: string;
};

function buildOrderColumns(): TableColumn<AdminOrderRow>[] {
  return [
    {
      id: 'orderNumber',
      header: 'Order Number',
      cellClassName: 'whitespace-normal py-4',
      cell: (order) => (
        <div className="min-w-0">
          <p className="text-body-regular text-foreground font-semibold">
            {order.orderNumber}
          </p>
        </div>
      ),
    },
    {
      id: 'customer',
      header: 'Customer',
      cellClassName: 'whitespace-normal py-4',
      cell: (order) => (
        <div className="min-w-0">
          <p className="text-body-regular text-foreground">{order.customerName}</p>
          <p className="text-caption-sm-regular text-gray-500">{order.customerEmail}</p>
        </div>
      ),
    },
    {
      id: 'items',
      header: 'Items',
      headerClassName: 'text-center text-body-medium text-foreground',
      cellClassName: 'text-center text-caption-lg-regular text-foreground',
      cell: (order) => order.itemsCount.toString(),
    },
    {
      id: 'total',
      header: 'Total',
      headerClassName: 'text-center text-body-medium text-foreground',
      cellClassName: 'text-center text-caption-lg-medium text-foreground',
      cell: (order) => order.totalFormatted,
    },
    {
      id: 'date',
      header: 'Order Date',
      headerClassName: 'text-center text-body-medium text-foreground',
      cellClassName: 'text-center text-caption-lg-regular text-gray-600',
      cell: (order) => order.dateFormatted,
    },
    {
      id: 'status',
      header: 'Status',
      headerClassName: 'text-center text-body-medium text-foreground',
      cellClassName: 'text-center',
      cell: (order) => {
        const statusColorMap: Record<string, string> = {
          PENDING: 'bg-yellow-100 text-yellow-800',
          CONFIRMED: 'bg-blue-100 text-blue-800',
          PROCESSING: 'bg-purple-100 text-purple-800',
          SHIPPED: 'bg-indigo-100 text-indigo-800',
          DELIVERED: 'bg-green-100 text-green-800',
          CANCELLED: 'bg-red-100 text-red-800',
          REFUNDED: 'bg-gray-100 text-gray-800',
        };

        return (
          <Badge
            variant="outline"
            className={`${statusColorMap[order.status] || 'bg-gray-100 text-gray-800'} text-caption-sm-regular rounded-sm border-none`}
          >
            {order.status}
          </Badge>
        );
      },
    },
    {
      id: 'paymentStatus',
      header: 'Payment',
      headerClassName: 'text-center text-body-medium text-foreground',
      cellClassName: 'text-center',
      cell: (order) => {
        const paymentColorMap: Record<string, string> = {
          PENDING: 'bg-yellow-50 text-yellow-700',
          PAID: 'bg-green-50 text-green-700',
          FAILED: 'bg-red-50 text-red-700',
          REFUNDED: 'bg-gray-50 text-gray-700',
        };

        return (
          <span
            className={`inline-block px-2.5 py-1 rounded-sm text-caption-sm-regular ${paymentColorMap[order.paymentStatus] || 'bg-gray-50 text-gray-700'}`}
          >
            {order.paymentStatus}
          </span>
        );
      },
    },
  ];
}

function AdminOrderList({
  orders,
  page,
  totalPages = 3,
  onPageChange,
  selectedIds,
  onSelectedIdsChange,
  className,
}: AdminOrderListProps) {
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
      getRowSelectionAriaLabel={(o) => `Select ${o.orderNumber}`}
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
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Export</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">Cancel Order</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    />
  );
}

export default AdminOrderList;
