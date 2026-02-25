/**
 * useNotifications Hook
 */

import { useEffect } from 'react';
import { useNotificationStore } from '@/stores/notification.store';

export function useNotifications(autoLoad: boolean = false) {
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const isLoading = useNotificationStore((state) => state.isLoading);
  const error = useNotificationStore((state) => state.error);
  const pagination = useNotificationStore((state) => state.pagination);
  const fcmToken = useNotificationStore((state) => state.fcmToken);
  const fetchNotifications = useNotificationStore((state) => state.fetchNotifications);
  const fetchUnreadCount = useNotificationStore((state) => state.fetchUnreadCount);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const deleteNotification = useNotificationStore((state) => state.deleteNotification);
  const registerForPushNotifications = useNotificationStore((state) => state.registerForPushNotifications);
  const clearError = useNotificationStore((state) => state.clearError);

  // Auto-load notifications and unread count on mount
  useEffect(() => {
    if (autoLoad) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [autoLoad]);

  // Register for push notifications on mount
  useEffect(() => {
    registerForPushNotifications();
  }, []);

  // Poll unread count every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    pagination,
    fcmToken,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    registerForPushNotifications,
    clearError,
  };
}
