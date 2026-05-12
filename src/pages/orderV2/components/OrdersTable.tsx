import { JSX, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { OrderTableRow } from './OrderTableRow';
import type { Order } from '@/types/order/order';

interface OrdersTableProps {
  orders: Order[];
  selectedRowIds: Set<string>;
  onSelectRow: (orderId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onViewDetails: (order: Order) => void;
  onDelete: (orderId: string) => void;
}

export const OrdersTable = ({
  orders,
  selectedRowIds,
  onSelectRow,
  onSelectAll,
  onViewDetails,
  onDelete,
}: OrdersTableProps): JSX.Element => {
  const allSelected = useMemo(
    () => orders.length > 0 && selectedRowIds.size === orders.length,
    [orders.length, selectedRowIds.size]
  );

  const someSelected = useMemo(
    () => selectedRowIds.size > 0 && !allSelected,
    [selectedRowIds.size, allSelected]
  );

  const handleSelectAll = (checked: boolean) => {
    onSelectAll(checked);
  };

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
      <Table>
        <TableHeader className="bg-white border-b border-gray-200">
          <TableRow>
            <TableHead className="w-[62px] py-4 px-5">
              <Checkbox
                checked={allSelected || someSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Select all orders"
              />
            </TableHead>
            <TableHead className="py-4 px-5 font-medium text-gray-700">ID</TableHead>
            <TableHead className="py-4 px-5 font-medium text-gray-700">Name</TableHead>
            <TableHead className="py-4 px-5 font-medium text-gray-700">Address</TableHead>
            <TableHead className="py-4 px-5 font-medium text-gray-700">Date</TableHead>
            <TableHead className="py-4 px-5 font-medium text-gray-700 text-center">
              Status
            </TableHead>
            <TableHead className="py-4 px-5 w-16">
              <span className="sr-only">Info</span>
            </TableHead>
            <TableHead className="py-4 px-5 w-16">
              <span className="sr-only">Delete</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <OrderTableRow
                key={order.id}
                order={order}
                isSelected={selectedRowIds.has(order.id)}
                onSelectChange={(selected) => onSelectRow(order.id, selected)}
                onViewDetails={onViewDetails}
                onDelete={onDelete}
                isShaded={index % 2 === 0}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                No orders found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
