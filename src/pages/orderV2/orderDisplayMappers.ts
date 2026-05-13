import type { AdminOrderRow } from '@/pages/orderV2/AdminOrderList/sections/AdminOrderList';
import type { Order } from '@/types/order/order';

const USD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatOrderTotalUsd(amount: number): string {
  return USD.format(Number.isFinite(amount) ? amount : 0);
}

export function formatOrderDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return isoDate;
  }
}

export function orderToAdminOrderRow(order: Order): AdminOrderRow {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    total: order.total,
    totalFormatted: formatOrderTotalUsd(order.total),
    status: order.status,
    itemsCount: order.items?.length ?? 0,
    createdAt: order.createdAt,
    dateFormatted: formatOrderDate(order.createdAt),
    paymentStatus: order.paymentStatus,
  };
}
