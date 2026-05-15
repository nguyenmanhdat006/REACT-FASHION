import { IMAGES } from '@/constants/images';
import { formatProductPriceUsd } from '@/pages/productV2/productDisplayMappers';
import type { AdminOrderRow } from '@/pages/orderv2/AdminOrderList/sections/AdminOrderList';
import type { Order } from '@/types/order/order';
import { OrderStatus } from '@/types/order/order';
import { formatDateTime } from '@/utils/date';

function formatEnumLabel(value: string): string {
  return value
    .split('_')
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(' ');
}

export function orderToAdminOrderRow(order: Order): AdminOrderRow {
  const firstItem = order.items?.[0];

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName?.trim() || '—',
    customerEmail: order.customerEmail?.trim() || '—',
    itemsCount: order.items?.length ?? 0,
    firstItemImageUrl:
      (firstItem?.productImageUrl?.trim() && firstItem.productImageUrl) ||
      IMAGES.PRODUCT_DEMO_1,
    totalFormatted: formatProductPriceUsd(order.total),
    status: order.status,
    statusLabel: formatEnumLabel(order.status),
    paymentStatus: order.paymentStatus,
    paymentStatusLabel: formatEnumLabel(order.paymentStatus),
    orderedAtFormatted: formatDateTime(order.orderedAt || order.createdAt),
    canCancel:
      order.status !== OrderStatus.CANCELLED &&
      order.status !== OrderStatus.DELIVERED &&
      order.status !== OrderStatus.REFUNDED,
  };
}
