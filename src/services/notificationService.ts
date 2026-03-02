import { API_ENDPOINTS } from '@/constants';
import type { ApiResponse, PageResponse, PaginationParams } from '@/types/common';
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
  getMyNotifications: async (
    params?: PaginationParams
  ): Promise<PageResponse<NotificationItem>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<NotificationItem>>>(
      API_ENDPOINTS.NOTIFICATIONS.MY,
      { params }
    );
    return response.data;
  },

  markRead: async (id: string): Promise<void> => {
    await apiClient.put(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
  },
};
