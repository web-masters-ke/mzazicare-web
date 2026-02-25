"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { pushNotificationService } from "@/services/push-notification.service";

interface NotificationContextType {
  isEnabled: boolean;
  isSupported: boolean;
  requestPermission: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
  isEnabled: false,
  isSupported: false,
  requestPermission: async () => {},
});

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    // Check if notifications are supported
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
      console.log("Push notifications are not supported in this browser");
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    // Initialize the push notification service
    const initialized = await pushNotificationService.initialize();

    if (initialized) {
      // Check current permission status
      setIsEnabled(pushNotificationService.isEnabled());
      console.log("✅ Push notification service initialized");
    } else {
      console.warn("Failed to initialize push notification service");
    }
  };

  const requestPermission = async () => {
    if (!isSupported) {
      console.warn("Notifications are not supported");
      return;
    }

    const permission = await pushNotificationService.requestPermission();
    setIsEnabled(permission === "granted");
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NotificationContext.Provider value={{ isEnabled, isSupported, requestPermission }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
