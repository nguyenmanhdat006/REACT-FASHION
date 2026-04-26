import type { PageResponse } from '@/types/common/common';
import type { NotificationItem } from '@/services/notification/notificationService';

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'noti-1',
    type: 'ORDER_CONFIRMED',
    subject: 'Your order ORD-20260302-0001 has been confirmed.',
    status: 'SENT',
    sentAt: '2026-03-01T09:02:00Z',
    createdAt: '2026-03-01T09:01:30Z',
  },
  {
    id: 'noti-2',
    type: 'ORDER_SHIPPED',
    subject: 'Your order ORD-20260302-0001 is now in transit.',
    status: 'SENT',
    sentAt: '2026-03-02T08:00:00Z',
    createdAt: '2026-03-02T07:59:00Z',
  },
  {
    id: 'noti-3',
    type: 'ORDER_DELIVERED',
    subject: 'Your order ORD-20260302-0002 has been delivered.',
    status: 'FAILED',
    sentAt: '2026-03-03T14:00:00Z',
    createdAt: '2026-03-03T13:58:00Z',
  },
];

export const MOCK_NOTIFICATION_PAGE: PageResponse<NotificationItem> = {
  content: MOCK_NOTIFICATIONS,
  page: 0,
  size: 10,
  totalElements: MOCK_NOTIFICATIONS.length,
  totalPages: 1,
  isLast: true,
};
