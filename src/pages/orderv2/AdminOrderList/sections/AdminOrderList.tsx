import { useMemo, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { orderService } from '@/services/order/orderService';
import type { Order } from '@/types/order/order';

import TableView, { type TableColumn } from '@/components/TableView';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  selectedIds?: string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  className?: string;
  onCancelOrder?: (order: AdminOrderRow) => void;
  onUpdateStatus?: (order: AdminOrderRow, status: OrderStatus) => void;
  onUpdateShipmentStatus?: (order: AdminOrderRow, status: ShipmentStatus) => void;
};

const ORDER_STATUS_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  [OrderStatusEnum.PENDING]: [OrderStatusEnum.CONFIRMED, OrderStatusEnum.CANCELLED],
  [OrderStatusEnum.CONFIRMED]: [OrderStatusEnum.PROCESSING, OrderStatusEnum.CANCELLED],
  [OrderStatusEnum.PROCESSING]: [OrderStatusEnum.SHIPPED, OrderStatusEnum.CANCELLED],
  [OrderStatusEnum.SHIPPED]: [OrderStatusEnum.DELIVERED],
};

const SHIPMENT_STATUS_TRANSITIONS: Partial<Record<ShipmentStatus, ShipmentStatus[]>> = {
  [ShipmentStatusEnum.PENDING]: [ShipmentStatusEnum.PICKED_UP, ShipmentStatusEnum.CANCELLED],
  [ShipmentStatusEnum.PICKED_UP]: [ShipmentStatusEnum.IN_TRANSIT],
  [ShipmentStatusEnum.IN_TRANSIT]: [ShipmentStatusEnum.OUT_FOR_DELIVERY],
  [ShipmentStatusEnum.OUT_FOR_DELIVERY]: [ShipmentStatusEnum.DELIVERED, ShipmentStatusEnum.FAILED_DELIVERY],
  [ShipmentStatusEnum.FAILED_DELIVERY]: [ShipmentStatusEnum.OUT_FOR_DELIVERY, ShipmentStatusEnum.CANCELLED],
};

const formatStatusLabel = (status: string) =>
  status
    .split('_')
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(' ');

const ORDER_STATUS_BADGE: Partial<Record<OrderStatus, string>> = {
  [OrderStatusEnum.PENDING]: 'border-amber-200 bg-amber-50 text-amber-800',
  [OrderStatusEnum.CONFIRMED]: 'border-blue-200 bg-blue-50 text-blue-800',
  [OrderStatusEnum.PROCESSING]: 'border-indigo-200 bg-indigo-50 text-indigo-800',
  [OrderStatusEnum.SHIPPED]: 'border-violet-200 bg-violet-50 text-violet-800',
  [OrderStatusEnum.DELIVERED]: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  [OrderStatusEnum.CANCELLED]: 'border-gray-200 bg-gray-100 text-gray-700',
  [OrderStatusEnum.REFUNDED]: 'border-rose-200 bg-rose-50 text-rose-800',
};

function buildOrderColumns(
  onUpdateStatus?: (order: AdminOrderRow, status: OrderStatus) => void,
  onUpdateShipmentStatus?: (order: AdminOrderRow, status: ShipmentStatus) => void,
): TableColumn<AdminOrderRow>[] {
  return [
    {
      id: 'order',
      header: 'Order',
      headerClassName: 'text-left text-sm font-semibold text-gray-900',
      cellClassName: 'whitespace-normal py-4',
      cell: (order) => (
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {order.orderedAtFormatted}
          </p>
        </div>
      ),
    },
    {
      id: 'customer',
      header: 'Customer',
      headerClassName: 'text-left text-sm font-semibold text-gray-900',
      cellClassName: 'whitespace-normal py-4',
      cell: (order) => (
        <div className="min-w-0 max-w-xs">
          <p className="line-clamp-1 text-sm font-medium text-gray-900">
            {order.customerName}
          </p>
          <p className="line-clamp-1 text-xs text-gray-500 mt-0.5">
            {order.customerEmail}
          </p>
        </div>
      ),
    },
    {
      id: 'items',
      header: 'Items',
      headerClassName: 'text-center text-sm font-semibold text-gray-900',
      cellClassName: 'text-center text-sm text-gray-900',
      cell: (order) => order.itemsCount.toLocaleString(),
    },
    {
      id: 'total',
      header: 'Total',
      headerClassName: 'text-center text-sm font-semibold text-gray-900',
      cellClassName: 'text-center text-sm font-semibold text-gray-900',
      cell: (order) => order.totalFormatted,
    },
    {
      id: 'status',
      header: 'Order Status',
      headerClassName: 'text-center text-sm font-semibold text-gray-900',
      cellClassName: 'text-center',
      cell: (order) => {
        const allowedStatuses = ORDER_STATUS_TRANSITIONS[order.status] ?? [];

        if (!onUpdateStatus || allowedStatuses.length === 0) {
          return (
            <Badge
              variant="outline"
              className={cn(
                'rounded-full px-3 h-8 inline-flex items-center justify-center text-xs font-medium shadow-sm',
                ORDER_STATUS_BADGE[order.status] ??
                  'border-primary/40 bg-primary/5 text-primary',
              )}
            >
              {order.statusLabel}
            </Badge>
          );
        }

        return (
          <Select
            value={order.status}
            onValueChange={(status) => onUpdateStatus(order, status as OrderStatus)}
            disabled={allowedStatuses.length === 0}
          >
            <SelectTrigger
              size="sm"
              className={cn(
                'mx-auto min-w-[11rem] rounded-full border text-xs font-medium shadow-sm transition-all hover:bg-gray-50 h-8',
                ORDER_STATUS_BADGE[order.status] ??
                  'border-primary/40 bg-primary/5 text-primary',
              )}
              aria-label={`Update status for ${order.orderNumber}`}
            >
              <SelectValue>{formatStatusLabel(order.status)}</SelectValue>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-200 shadow-lg">
              <SelectItem value={order.status} disabled>
                Current: {formatStatusLabel(order.status)}
              </SelectItem>
              {allowedStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {formatStatusLabel(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      id: 'shippingStatus',
      header: 'Shipping Status',
      headerClassName: 'text-center text-sm font-semibold text-gray-900',
      cellClassName: 'text-center',
      cell: (order) => {
        if (!order.shipmentId || !onUpdateShipmentStatus) {
          return <span className="text-gray-400 text-xs">No Shipment</span>;
        }

        const currentStatus = order.shipmentStatus || ShipmentStatusEnum.PENDING;
        const allowedStatuses = SHIPMENT_STATUS_TRANSITIONS[currentStatus] ?? [];

        return (
          <Select
            value={currentStatus}
            onValueChange={(status) => {
              if (status !== currentStatus && !allowedStatuses.includes(status as ShipmentStatus)) {
                alert(`Cannot revert shipment status from ${formatStatusLabel(currentStatus)} to ${formatStatusLabel(status as ShipmentStatus)}`);
                return;
              }
              onUpdateShipmentStatus(order, status as ShipmentStatus);
            }}
          >
            <SelectTrigger
              size="sm"
              className="mx-auto min-w-[11rem] rounded-full border text-xs font-medium border-gray-200 bg-white text-gray-900 shadow-sm transition-all hover:bg-gray-50 focus:ring-1 focus:ring-gray-300 h-8"
              aria-label={`Update shipping status for ${order.orderNumber}`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-200 shadow-lg">
              {Object.values(ShipmentStatusEnum).map((status) => {
                const isAllowed = allowedStatuses.includes(status) || status === currentStatus;
                return (
                  <SelectItem 
                    key={status} 
                    value={status}
                    disabled={!isAllowed}
                    className={cn(
                      "text-sm",
                      !isAllowed && "opacity-50 cursor-not-allowed",
                      status === currentStatus && "font-semibold text-primary"
                    )}
                  >
                    {formatStatusLabel(status)} {status === currentStatus && "(Current)"}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      id: 'payment',
      header: 'Payment',
      headerClassName: 'text-center text-sm font-semibold text-gray-900',
      cellClassName: 'text-center',
      cell: (order) => (
        <Badge
          variant="outline"
          className="rounded-full px-3 h-8 inline-flex items-center justify-center text-xs font-medium border-gray-200 bg-gray-50 text-gray-800 shadow-sm"
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
  onUpdateStatus,
  onUpdateShipmentStatus,
}: AdminOrderListProps) {
  const columns = useMemo(() => buildOrderColumns(onUpdateStatus, onUpdateShipmentStatus), [onUpdateStatus, onUpdateShipmentStatus]);

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenDetails = async (id: string) => {
    setSelectedOrderId(id);
    setIsLoading(true);
    setOrderDetails(null);
    try {
      const res = await orderService.getOrderById(id);
      if (res.success && res.data) {
        setOrderDetails(res.data);
      } else {
        toast.error('Could not load order details');
        setSelectedOrderId(null);
      }
    } catch (e) {
      console.error(e);
      toast.error('An error occurred while loading order details');
      setSelectedOrderId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedOrderId(null);
    setOrderDetails(null);
  };

  const getImageUrl = (url?: string | null) => {
    if (!url || url === 'null' || url === 'undefined' || url.trim() === '') {
      return '/image.png';
    }
    return url;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <>
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
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleOpenDetails(order.id)}
              className="rounded-lg h-8 text-xs font-medium border-gray-200 hover:bg-gray-50"
            >
              Details
            </Button>
            {order.canCancel && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onCancelOrder?.(order)}
                className="rounded-lg h-8 text-xs font-medium"
              >
                Cancel
              </Button>
            )}
          </div>
        )}
      />

      {/* Modal Overlay */}
      {selectedOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
              <button
                onClick={closeModal}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600 mb-4" />
                  <p className="text-body-medium text-gray-600">Loading details...</p>
                </div>
              ) : orderDetails ? (
                <div className="flex flex-col gap-6">
                  {/* Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1 rounded-xl bg-gray-50 p-4 border border-gray-100">
                      <span className="text-xs text-gray-500">Order Number</span>
                      <span className="text-sm font-medium text-gray-900">{orderDetails.orderNumber}</span>
                    </div>
                    <div className="flex flex-col gap-1 rounded-xl bg-gray-50 p-4 border border-gray-100">
                      <span className="text-xs text-gray-500">Order Date</span>
                      <span className="text-sm font-medium text-gray-900">
                        {orderDetails.createdAt ? new Date(orderDetails.createdAt).toLocaleString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 rounded-xl bg-gray-50 p-4 border border-gray-100">
                      <span className="text-xs text-gray-500">Payment Method</span>
                      <span className="text-sm font-medium text-gray-900">{orderDetails.paymentMethod}</span>
                    </div>
                    <div className="flex flex-col gap-1 rounded-xl bg-gray-50 p-4 border border-gray-100">
                      <span className="text-xs text-gray-500">Status</span>
                      <span className="text-sm font-medium text-gray-900">{orderDetails.status}</span>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-2">Shipping Information</h3>
                    <div className="text-sm text-gray-600 space-y-1 mt-1">
                      <p><span className="font-medium text-gray-900">Name:</span> {orderDetails.shippingAddress.recipientName}</p>
                      <p><span className="font-medium text-gray-900">Phone:</span> {orderDetails.shippingAddress.phone}</p>
                      <p><span className="font-medium text-gray-900">Address:</span> {orderDetails.shippingAddress.address}, {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.province}, {orderDetails.shippingAddress.zipCode}</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-2">Items</h3>
                    <div className="flex flex-col gap-3 mt-1">
                      {orderDetails.items.map((item) => (
                        <div key={item.id} className="flex gap-4 items-center">
                          <div
                            className="h-16 w-16 rounded-lg bg-gray-200 bg-cover bg-center shrink-0 border border-gray-100"
                            style={{ backgroundImage: `url(${getImageUrl(item.productImageUrl)})` }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatPrice(item.subtotal)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="flex flex-col gap-2 rounded-xl bg-gray-50 p-4 border border-gray-100">
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span>{formatPrice(orderDetails.subtotal)}</span>
                    </div>
                    {orderDetails.discount > 0 && (
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>Discount</span>
                        <span className="text-destructive">-{formatPrice(orderDetails.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>Shipping Fee</span>
                      <span>{formatPrice(orderDetails.shipping)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold text-gray-900 pt-2 border-t border-gray-200 mt-1">
                      <span>Total</span>
                      <span>{formatPrice(orderDetails.total)}</span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-100 p-4 sm:p-6 bg-gray-50">
              <button
                onClick={closeModal}
                className="w-full sm:w-auto sm:float-right inline-flex justify-center items-center rounded-full bg-gray-900 px-6 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
              <div className="clear-both"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminOrderList;