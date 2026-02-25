/**
 * Notification Service
 * Handles push notification registration and Firebase messaging
 */

import { initMessaging, getToken, onMessage } from '@/config/firebase.config';

export class NotificationService {
  private static instance: NotificationService;
  private messaging: Awaited<ReturnType<typeof initMessaging>> = null;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Request notification permission and get FCM token
   */
  async requestPermission(): Promise<string | null> {
    try {
      if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return null;
      }

      const permission = await Notification.requestPermission();

      if (permission !== 'granted') {
        console.log('Notification permission denied');
        return null;
      }

      // Initialize messaging
      this.messaging = await initMessaging();
      if (!this.messaging) {
        console.log('Messaging not supported');
        return null;
      }

      // Get FCM token
      const token = await getToken(this.messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });

      if (token) {
        console.log('FCM Token:', token);
        return token;
      } else {
        console.log('No registration token available');
        return null;
      }
    } catch (error) {
      console.error('Error getting notification permission:', error);
      return null;
    }
  }

  /**
   * Listen for foreground messages
   */
  onForegroundMessage(callback: (payload: any) => void) {
    if (!this.messaging) {
      console.warn('Messaging not initialized');
      return () => {};
    }

    const unsubscribe = onMessage(this.messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      callback(payload);
    });

    return unsubscribe;
  }

  /**
   * Show browser notification
   */
  showNotification(title: string, options?: NotificationOptions) {
    if (!('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        ...options,
      });
    }
  }
}

export const notificationService = NotificationService.getInstance();
