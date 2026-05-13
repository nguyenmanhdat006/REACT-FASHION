import { API_ENDPOINTS } from '@/constants';
import type { ApiResponse, PageMeta, PaginationParams } from '@/types/common/common';
import apiClient from '@/utils/api';

export interface NotificationItem {
  id: string;
  type: 'ORDER_CONFIRMED' | 'ORDER_SHIPPED' | 'ORDER_DELIVERED';
  subject: string;
  status: 'SENT' | 'FAILED';
  sentAt: string;
  createdAt: string;
}

export const notificationService = {
  getMyNotifications: (
    params?: PaginationParams
  ): Promise<ApiResponse<NotificationItem[], PageMeta>> =>
    apiClient.get<ApiResponse<NotificationItem[], PageMeta>>(
      API_ENDPOINTS.NOTIFICATIONS.MY,
      { params }
    ),

  markRead: (id: string): Promise<void> =>
    apiClient.put(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id)),
};
