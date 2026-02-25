/**
 * Push Notification Service
 * Handles browser push notifications for messages and bookings
 */

class PushNotificationService {
  private registration: ServiceWorkerRegistration | null = null;
  private permission: NotificationPermission = 'default';

  /**
   * Initialize push notifications
   */
  async initialize(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications are not supported');
      return false;
    }

    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('✅ Service Worker registered');

      // Check current permission
      this.permission = Notification.permission;

      return true;
    } catch (error) {
      console.error('Failed to register service worker:', error);
      return false;
    }
  }

  /**
   * Request notification permission from user
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('Notifications are not supported');
      return 'denied';
    }

    try {
      this.permission = await Notification.requestPermission();
      console.log(`Notification permission: ${this.permission}`);
      return this.permission;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return 'denied';
    }
  }

  /**
   * Check if notifications are enabled
   */
  isEnabled(): boolean {
    return this.permission === 'granted';
  }

  /**
   * Show a local notification
   */
  async showNotification(
    title: string,
    options: NotificationOptions = {}
  ): Promise<void> {
    if (this.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    if (!this.registration) {
      console.warn('Service worker not registered');
      return;
    }

    try {
      await this.registration.showNotification(title, {
        badge: '/icons/badge-96x96.png',
        icon: '/icons/icon-192x192.png',
        ...options,
      });
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  /**
   * Show message notification
   */
  async showMessageNotification(
    senderName: string,
    messageContent: string,
    conversationId: string
  ): Promise<void> {
    // Don't show if page is focused
    if (document.hasFocus()) {
      return;
    }

    await this.showNotification(`New message from ${senderName}`, {
      body: messageContent,
      tag: `message-${conversationId}`,
      data: {
        type: 'message',
        conversationId,
        url: `/dashboard/messages?conversation=${conversationId}`,
      },
      requireInteraction: false,
    } as any);
  }

  /**
   * Show booking notification
   */
  async showBookingNotification(
    title: string,
    message: string,
    bookingId: string
  ): Promise<void> {
    await this.showNotification(title, {
      body: message,
      tag: `booking-${bookingId}`,
      data: {
        type: 'booking',
        bookingId,
        url: `/dashboard/bookings/${bookingId}`,
      },
      requireInteraction: true,
    } as any);
  }

  /**
   * Show payment notification
   */
  async showPaymentNotification(
    title: string,
    message: string,
    transactionId?: string
  ): Promise<void> {
    await this.showNotification(title, {
      body: message,
      tag: `payment-${transactionId || Date.now()}`,
      data: {
        type: 'payment',
        transactionId,
        url: transactionId
          ? `/dashboard/wallet/transactions/${transactionId}`
          : '/dashboard/wallet',
      },
      requireInteraction: false,
    });
  }

  /**
   * Clear all notifications
   */
  async clearAllNotifications(): Promise<void> {
    if (!this.registration) return;

    try {
      const notifications = await this.registration.getNotifications();
      notifications.forEach((notification) => notification.close());
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  }

  /**
   * Clear notifications by tag
   */
  async clearNotificationsByTag(tag: string): Promise<void> {
    if (!this.registration) return;

    try {
      const notifications = await this.registration.getNotifications({ tag });
      notifications.forEach((notification) => notification.close());
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  }
}

// Export singleton instance
export const pushNotificationService = new PushNotificationService();
