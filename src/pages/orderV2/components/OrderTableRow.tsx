import { JSX } from 'react';
import { FiInfo, FiTrash2 } from 'react-icons/fi';
import { TableCell, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import type { Order, OrderStatus } from '@/types/order/order';

interface OrderTableRowProps {
  order: Order;
  isSelected: boolean;
  onSelectChange: (selected: boolean) => void;
  onViewDetails: (order: Order) => void;
  onDelete: (orderId: string) => void;
  isShaded?: boolean;
}

const statusColors: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800',
};

export const OrderTableRow = ({
  order,
  isSelected,
  onSelectChange,
  onViewDetails,
  onDelete,
  isShaded = false,
}: OrderTableRowProps): JSX.Element => {
  const statusBadgeClass = statusColors[order.status] || 'bg-gray-100 text-gray-800';

  return (
    <TableRow className={isShaded ? 'bg-grayscale-50' : 'bg-white'}>
      <TableCell className="w-[62px]">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelectChange}
          aria-label={`Select order ${order.orderNumber}`}
        />
      </TableCell>
      <TableCell className="font-body-regular text-gray-600">{order.orderNumber}</TableCell>
      <TableCell className="font-body-regular text-gray-800">{order.customerName}</TableCell>
      <TableCell className="font-body-regular text-gray-800">
        {order.shippingAddress?.addressLine1 || 'N/A'}
      </TableCell>
      <TableCell className="font-body-regular text-gray-600">
        {new Date(order.createdAt).toLocaleDateString('en-US')}
      </TableCell>
      <TableCell className="text-center">
        <Badge className={statusBadgeClass}>{order.status}</Badge>
      </TableCell>
      <TableCell className="text-center">
        <button
          type="button"
          aria-label={`View details for order ${order.orderNumber}`}
          onClick={() => onViewDetails(order)}
          className="inline-flex items-center justify-center w-6 h-6 hover:text-primary-900 transition-colors"
        >
          <FiInfo className="w-5 h-5" />
        </button>
      </TableCell>
      <TableCell className="text-center">
        <button
          type="button"
          aria-label={`Delete order ${order.orderNumber}`}
          onClick={() => onDelete(order.id)}
          className="inline-flex items-center justify-center w-6 h-6 hover:text-red-600 transition-colors"
        >
          <FiTrash2 className="w-5 h-5" />
        </button>
      </TableCell>
    </TableRow>
  );
};
