import { Helmet } from 'react-helmet-async';
import { useCallback, useEffect, useMemo, useState, type JSX } from 'react';

import { LabelButton } from '@/components/buttons/LabelButton';
import Modal from '@/components/overlay/Modal';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useOrders } from '@/hooks/order/useOrders';
import AdminOrderList from '@/pages/orderv2/AdminOrderList/sections/AdminOrderList';
import { orderToAdminOrderRow } from '@/pages/orderv2/AdminOrderList/orderDisplayMappers';
import { formatStatusLabel } from '@/pages/orderv2/AdminOrderList/sections/AdminOrderList';
import { useAppSelector } from '@/store/hooks';
import { ShipmentStatus as ShipmentStatusEnum, OrderStatus as OrderStatusEnum } from '@/types/order/order';
import type { OrderStatus, ShipmentStatus, Order } from '@/types/order/order';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { orderService } from '@/services/order/orderService';

import type { AdminOrderRow } from './sections/AdminOrderList';

const LIST_PAGE_SIZE = 10;

export default function AdminOrderListPage(): JSX.Element {
  const { fetchOrdersPage, confirmOrder, markDelivered, updateOrderStatus, updateShipmentStatus } = useOrders();
  const { items, page, size, totalPages, isLoading, error } = useAppSelector((s) => s.orders);

  useEffect(() => {
    void fetchOrdersPage({ page: 0, size: LIST_PAGE_SIZE });
  }, [fetchOrdersPage]);

  const listParams = useMemo(
    () => ({
      page,
      size: size || LIST_PAGE_SIZE,
    }),
    [page, size],
  );

  const rows: AdminOrderRow[] = useMemo(
    () => items.map(orderToAdminOrderRow),
    [items],
  );

  const currentPage = page + 1;
  const safeTotalPages = Math.max(1, totalPages || 1);

  const onPageChange = useCallback(
    (nextPage: number) => {
      void fetchOrdersPage({ page: nextPage - 1, size: size || LIST_PAGE_SIZE });
    },
    [fetchOrdersPage, size],
  );

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [savingOrderStatus, setSavingOrderStatus] = useState(false);
  const [savingShipmentStatus, setSavingShipmentStatus] = useState(false);
  const [draftOrderStatus, setDraftOrderStatus] = useState<OrderStatus | null>(null);
  const [draftShipmentStatus, setDraftShipmentStatus] = useState<ShipmentStatus | null>(null);
  const orderStatusOptions = Object.values(OrderStatusEnum) as OrderStatus[];
  const shipmentStatusOptions = Object.values(ShipmentStatusEnum) as ShipmentStatus[];

  const loadOrderDetails = useCallback(async (id: string) => {
    try {
      const res = await orderService.getOrderById(id);
      if (res.success && res.data) {
        return res.data;
      }
      toast.error('Could not load order details');
      return null;
    } catch (e) {
      console.error(e);
      toast.error('An error occurred while loading order details');
      return null;
    }
  }, []);

  const openEditModal = useCallback(async (row: AdminOrderRow) => {
    setSelectedOrderId(row.id);
    setDetailLoading(true);
    setOrderDetails(null);
    setDraftOrderStatus(null);
    setDraftShipmentStatus(null);

    const details = await loadOrderDetails(row.id);
    if (!details) {
      setSelectedOrderId(null);
      setDetailLoading(false);
      return;
    }

    setOrderDetails(details);
    setDraftOrderStatus(details.status);
    setDraftShipmentStatus(details.shipmentStatus ?? ShipmentStatusEnum.PENDING);
    setDetailLoading(false);
  }, [loadOrderDetails]);

  const closeModal = useCallback(() => {
    setSelectedOrderId(null);
    setOrderDetails(null);
    setDraftOrderStatus(null);
    setDraftShipmentStatus(null);
  }, []);

  const getImageUrl = (url?: string | null) => {
    if (!url || url === 'null' || url === 'undefined' || url.trim() === '') {
      return '/images/2164f1ee2b6a236aea160f5c3012a58b.jpg';
    }
    return url;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price);
  };

  const handleUpdateOrderStatus = useCallback(async () => {
    if (!orderDetails || !draftOrderStatus || draftOrderStatus === orderDetails.status) return;

    setSavingOrderStatus(true);
    const ok = draftOrderStatus === OrderStatusEnum.CONFIRMED
      ? await confirmOrder(orderDetails.id, listParams)
      : draftOrderStatus === OrderStatusEnum.DELIVERED
        ? await markDelivered(orderDetails.id)
        : await updateOrderStatus(orderDetails.id, draftOrderStatus, listParams);

    if (ok) {
      const refreshed = await loadOrderDetails(orderDetails.id);
      if (refreshed) {
        setOrderDetails(refreshed);
        setDraftOrderStatus(refreshed.status);
        setDraftShipmentStatus(refreshed.shipmentStatus ?? ShipmentStatusEnum.PENDING);
      }
    }
    setSavingOrderStatus(false);
  }, [confirmOrder, draftOrderStatus, loadOrderDetails, markDelivered, orderDetails, listParams, updateOrderStatus]);

  const handleUpdateShipmentStatus = useCallback(async () => {
    if (!orderDetails?.shipmentId || !draftShipmentStatus) return;

    const currentShipmentStatus = orderDetails.shipmentStatus ?? ShipmentStatusEnum.PENDING;
    if (draftShipmentStatus === currentShipmentStatus) return;

    setSavingShipmentStatus(true);
    const ok = await updateShipmentStatus(orderDetails.shipmentId, orderDetails.id, draftShipmentStatus, listParams);

    if (ok) {
      const refreshed = await loadOrderDetails(orderDetails.id);
      if (refreshed) {
        setOrderDetails(refreshed);
        setDraftOrderStatus(refreshed.status);
        setDraftShipmentStatus(refreshed.shipmentStatus ?? ShipmentStatusEnum.PENDING);
      }
    }
    setSavingShipmentStatus(false);
  }, [draftShipmentStatus, listParams, loadOrderDetails, orderDetails, updateShipmentStatus]);

  return (
    <>
      <Helmet>
        <title>Orders — Admin</title>
      </Helmet>
      <div className="mb-4 flex justify-start gap-3">
        <LabelButton
          label="Filters"
          type="button"
          className="bg-gray-white hover:bg-gray-100"
          ariaLabel="Open order filters"
        />
      </div>
      <AdminOrderList
        orders={rows}
        currentPage={currentPage}
        totalPages={safeTotalPages}
        onPageChange={onPageChange}
        onEditOrder={(row) => void openEditModal(row)}
      />
      {isLoading && rows.length === 0 ? (
        <p className="mt-4 text-center text-caption-lg-regular text-muted-foreground">
          Loading…
        </p>
      ) : null}
      {error && !isLoading ? (
        <p className="mt-4 text-center text-caption-sm-regular text-destructive">
          {error}
        </p>
      ) : null}

      <Modal
        isOpen={selectedOrderId != null}
        onClose={closeModal}
        title="Edit order status"
        size="xl"
        footer={(
          <Button type="button" variant="outline" className="rounded-full" onClick={closeModal}>
            Close
          </Button>
        )}
      >
        {detailLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary-600" />
            <p className="text-body-medium text-gray-600">Loading details...</p>
          </div>
        ) : orderDetails ? (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1 rounded-xl border border-gray-100 bg-gray-50 p-4">
                <span className="text-xs text-gray-500">Order Number</span>
                <span className="text-sm font-medium text-gray-900">{orderDetails.orderNumber}</span>
              </div>
              <div className="flex flex-col gap-1 rounded-xl border border-gray-100 bg-gray-50 p-4">
                <span className="text-xs text-gray-500">Order Date</span>
                <span className="text-sm font-medium text-gray-900">
                  {orderDetails.createdAt ? new Date(orderDetails.createdAt).toLocaleString() : 'N/A'}
                </span>
              </div>
              <div className="flex flex-col gap-1 rounded-xl border border-gray-100 bg-gray-50 p-4">
                <span className="text-xs text-gray-500">Payment Method</span>
                <span className="text-sm font-medium text-gray-900">{orderDetails.paymentMethod}</span>
              </div>
              <div className="flex flex-col gap-1 rounded-xl border border-gray-100 bg-gray-50 p-4">
                <span className="text-xs text-gray-500">Current Status</span>
                <span className="text-sm font-medium text-gray-900">{formatStatusLabel(orderDetails.status)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-gray-900">Order status</h3>
                <span className="text-xs text-gray-500">Only confirm or delivered</span>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Select
                  value={draftOrderStatus ?? orderDetails.status}
                  onValueChange={(value) => setDraftOrderStatus(value as OrderStatus)}
                >
                  <SelectTrigger className="min-w-[16rem] rounded-full" aria-label={`Update status for ${orderDetails.orderNumber}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {orderStatusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {formatStatusLabel(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  className="rounded-full"
                  onClick={() => void handleUpdateOrderStatus()}
                  disabled={savingOrderStatus || draftOrderStatus === orderDetails.status}
                >
                  {savingOrderStatus ? 'Updating...' : 'Update order status'}
                </Button>
              </div>
            </div>

            {orderDetails.shipmentId ? (
              <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-gray-900">Shipping status</h3>
                  <span className="text-xs text-gray-500">Current: {formatStatusLabel(orderDetails.shipmentStatus ?? ShipmentStatusEnum.PENDING)}</span>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Select
                    value={draftShipmentStatus ?? orderDetails.shipmentStatus ?? ShipmentStatusEnum.PENDING}
                    onValueChange={(value) => setDraftShipmentStatus(value as ShipmentStatus)}
                  >
                    <SelectTrigger className="min-w-[16rem] rounded-full" aria-label={`Update shipping status for ${orderDetails.orderNumber}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {shipmentStatusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {formatStatusLabel(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    className="rounded-full"
                    variant="outline"
                    onClick={() => void handleUpdateShipmentStatus()}
                    disabled={savingShipmentStatus || draftShipmentStatus === (orderDetails.shipmentStatus ?? ShipmentStatusEnum.PENDING)}
                  >
                    {savingShipmentStatus ? 'Updating...' : 'Update shipping status'}
                  </Button>
                </div>
              </div>
            ) : null}

            <div className="flex flex-col gap-2">
              <h3 className="border-b border-gray-100 pb-2 text-base font-semibold text-gray-900">Items</h3>
              <div className="mt-1 flex flex-col gap-3">
                {orderDetails.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div
                      className="h-16 w-16 shrink-0 rounded-lg border border-gray-100 bg-cover bg-center bg-gray-200"
                      style={{ backgroundImage: `url(${getImageUrl(item.productImageUrl)})` }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">{item.productName}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">{formatPrice(item.subtotal)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(orderDetails.subtotal)}</span>
              </div>
              {orderDetails.discount > 0 ? (
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Discount</span>
                  <span className="text-destructive">-{formatPrice(orderDetails.discount)}</span>
                </div>
              ) : null}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Shipping Fee</span>
                <span>{formatPrice(orderDetails.shipping)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between border-t border-gray-200 pt-2 text-sm font-bold text-gray-900">
                <span>Total</span>
                <span>{formatPrice(orderDetails.total)}</span>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
