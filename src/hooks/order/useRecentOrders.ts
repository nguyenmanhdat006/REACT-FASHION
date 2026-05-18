import { useEffect, useState } from 'react';

import { IMAGES } from '@/constants/images';
import { orderService } from '@/services/order/orderService';
import type { Order } from '@/types/order/order';

const RECENT_ORDERS_SIZE = 5;
const LABEL_MAX_LENGTH = 14;

export type RecentOrderSidebarItem = {
  id: string;
  label: string;
  imageUrl: string;
};

function resolveProductImageUrl(url?: string | null): string {
  if (!url || url === 'null' || url === 'undefined' || url.trim() === '') {
    return IMAGES.PRODUCT_DEMO_1;
  }
  return url;
}

function truncateLabel(text: string): string {
  const trimmed = text.trim();
  if (trimmed.length <= LABEL_MAX_LENGTH) {
    return trimmed;
  }
  return `${trimmed.slice(0, LABEL_MAX_LENGTH)}...`;
}

export function orderToSidebarItem(order: Order): RecentOrderSidebarItem {
  const firstItem = order.items[0];
  const label = firstItem?.productName
    ? truncateLabel(firstItem.productName)
    : order.orderNumber;

  return {
    id: order.id,
    label,
    imageUrl: resolveProductImageUrl(firstItem?.productImageUrl),
  };
}

export function useRecentOrders(enabled: boolean) {
  const [items, setItems] = useState<RecentOrderSidebarItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setItems([]);
      setTotalCount(0);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    void (async () => {
      try {
        const res = await orderService.getOrders({
          page: 0,
          size: RECENT_ORDERS_SIZE,
        });
        if (cancelled) {
          return;
        }
        if (res.success && res.data) {
          setItems(res.data.map(orderToSidebarItem));
          setTotalCount(res.meta?.totalElements ?? res.data.length);
        } else {
          setItems([]);
          setTotalCount(0);
        }
      } catch {
        if (!cancelled) {
          setItems([]);
          setTotalCount(0);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { items, totalCount, isLoading };
}
