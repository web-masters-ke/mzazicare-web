/**
 * Notification Store
 * Zustand store for notification state
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { notificationRepository, type Notification } from '@/repositories/notification.repository';
import { notificationService } from '@/services/notification.service';
import type { PaginationMeta } from '@/types/models';

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
  fcmToken: string | null;

  // Actions
  fetchNotifications: (page?: number, unreadOnly?: boolean) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  registerForPushNotifications: () => Promise<void>;
  addNotification: (notification: Notification) => void;
  clearError: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,
      pagination: null,
      fcmToken: null,

      fetchNotifications: async (page: number = 1, unreadOnly: boolean = false) => {
        set({ isLoading: true, error: null });

        try {
          const response = await notificationRepository.getNotifications(page, unreadOnly);

          set({
            notifications: response.data,
            pagination: response.pagination,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to fetch notifications',
          });
        }
      },

      fetchUnreadCount: async () => {
        try {
          const count = await notificationRepository.getUnreadCount();
          set({ unreadCount: count });
        } catch (error: any) {
          console.error('Failed to fetch unread count:', error);
        }
      },

      markAsRead: async (notificationId: string) => {
        try {
          await notificationRepository.markAsRead(notificationId);

          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.id === notificationId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
          }));
        } catch (error: any) {
          console.error('Failed to mark as read:', error);
        }
      },

      markAllAsRead: async () => {
        try {
          await notificationRepository.markAllAsRead();

          set((state) => ({
            notifications: state.notifications.map((n) => ({
              ...n,
              isRead: true,
              readAt: new Date().toISOString(),
            })),
            unreadCount: 0,
          }));
        } catch (error: any) {
          console.error('Failed to mark all as read:', error);
        }
      },

      deleteNotification: async (notificationId: string) => {
        try {
          await notificationRepository.deleteNotification(notificationId);

          set((state) => {
            const notification = state.notifications.find((n) => n.id === notificationId);
            return {
              notifications: state.notifications.filter((n) => n.id !== notificationId),
              unreadCount: notification && !notification.isRead
                ? Math.max(0, state.unreadCount - 1)
                : state.unreadCount,
            };
          });
        } catch (error: any) {
          console.error('Failed to delete notification:', error);
        }
      },

      registerForPushNotifications: async () => {
        try {
          const token = await notificationService.requestPermission();

          if (token) {
            await notificationRepository.registerDeviceToken(token, 'web');
            set({ fcmToken: token });

            // Listen for foreground messages
            notificationService.onForegroundMessage((payload) => {
              const { notification: n, data } = payload;

              // Show browser notification
              notificationService.showNotification(n?.title || 'MzaziCare', {
                body: n?.body || '',
                data,
              });

              // Add to notifications list
              get().addNotification({
                id: Date.now().toString(),
                userId: '',
                type: data?.type || 'SYSTEM',
                title: n?.title || 'New Notification',
                body: n?.body || '',
                data,
                isRead: false,
                createdAt: new Date().toISOString(),
              });

              // Increment unread count
              get().fetchUnreadCount();
            });
          }
        } catch (error: any) {
          console.error('Failed to register for push notifications:', error);
        }
      },

      addNotification: (notification: Notification) => {
        set((state) => ({
          notifications: [notification, ...state.notifications],
        }));
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    { name: 'notification-store' }
  )
);
