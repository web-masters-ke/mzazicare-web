/**
 * Notification Repository
 * API calls for notifications
 */

import { apiClient } from '@/services/api/api-client';
import { ApiEndpoints } from '@/config/api-endpoints';
import type { ApiResponse, PaginatedResponse } from '@/types/models';

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

class NotificationRepository {
  /**
   * Get user notifications
   */
  async getNotifications(page: number = 1, unreadOnly: boolean = false): Promise<PaginatedResponse<Notification>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', '20');
    if (unreadOnly) {
      params.append('unreadOnly', 'true');
    }

    const response = await apiClient.get<ApiResponse<PaginatedResponse<Notification>>>(
      `${ApiEndpoints.notifications.list}?${params.toString()}`
    );

    if (!response.data.data) {
      return { data: [], pagination: { currentPage: 1, totalPages: 0, totalItems: 0, itemsPerPage: 20, hasNextPage: false, hasPreviousPage: false } };
    }

    return response.data.data;
  }

  /**
   * Get unread count
   */
  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<ApiResponse<{ count: number }>>(
      ApiEndpoints.notifications.unreadCount
    );

    return response.data.data?.count || 0;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<Notification | null> {
    const response = await apiClient.patch<ApiResponse<Notification>>(
      ApiEndpoints.notifications.markAsRead(notificationId)
    );

    return response.data.data || null;
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    await apiClient.patch<ApiResponse<void>>(ApiEndpoints.notifications.markAllAsRead);
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    await apiClient.delete(ApiEndpoints.notifications.delete(notificationId));
  }

  /**
   * Register device token for push notifications
   */
  async registerDeviceToken(token: string, platform: 'web' | 'ios' | 'android'): Promise<void> {
    await apiClient.post<ApiResponse<void>>(ApiEndpoints.notifications.registerToken, {
      token,
      platform,
      deviceId: this.getDeviceId(),
    });
  }

  /**
   * Unregister device token
   */
  async unregisterDeviceToken(token: string): Promise<void> {
    await apiClient.delete(ApiEndpoints.notifications.unregisterToken, {
      data: { token },
    });
  }

  /**
   * Get or create device ID
   */
  private getDeviceId(): string {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = `web-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  }
}

export const notificationRepository = new NotificationRepository();
