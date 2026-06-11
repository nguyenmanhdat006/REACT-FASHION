import type { ApiResponse, PageMeta } from '@/types/common/common';
import type { NotificationItem } from '@/services/notification/notificationService';
import { buildSeedNotifications } from '@/mocks/storage/mockState';

export const MOCK_NOTIFICATIONS: NotificationItem[] = buildSeedNotifications();

export const MOCK_NOTIFICATION_PAGE: ApiResponse<NotificationItem[], PageMeta> = {
  success: true,
  data: MOCK_NOTIFICATIONS,
  meta: {
    page: 0,
    size: 10,
    totalElements: MOCK_NOTIFICATIONS.length,
    totalPages: MOCK_NOTIFICATIONS.length === 0 ? 0 : 1,
    first: true,
    last: true,
  },
  error: null,
  message: null,
  timestamp: new Date().toISOString(),
};
