"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { messagingSocket } from "@/services/websocket/messaging.socket";
import { storageService } from "@/services/storage/storage.service";

interface MessagingContextType {
  isConnected: boolean;
}

const MessagingContext = createContext<MessagingContextType>({
  isConnected: false,
});

export function MessagingProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout;

    const connectWebSocket = async () => {
      // Only connect if user is authenticated
      if (!isAuthenticated || !user) {
        // Disconnect if not authenticated
        if (messagingSocket.isConnected()) {
          messagingSocket.disconnect();
          console.log("📴 WebSocket disconnected (user logged out)");
        }
        return;
      }

      // Get access token from storage service (ensures fresh token)
      const token = await storageService.getAccessToken();

      if (!token) {
        console.warn("No access token found, cannot connect to messaging WebSocket");
        return;
      }

      // Connect to WebSocket if not already connected
      if (!messagingSocket.isConnected()) {
        console.log("🔌 Initializing WebSocket connection...");
        try {
          messagingSocket.connect(token);
        } catch (error) {
          console.error("Failed to connect WebSocket:", error);
          // Retry connection after 5 seconds
          reconnectTimeout = setTimeout(() => {
            console.log("Retrying WebSocket connection...");
            connectWebSocket();
          }, 5000);
        }
      }
    };

    connectWebSocket();

    // Cleanup on unmount or when user changes
    return () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      // Don't disconnect on unmount, keep connection alive for the session
      // Only disconnect when user logs out (handled by the first condition)
    };
  }, [user, isAuthenticated]);

  return (
    <MessagingContext.Provider value={{ isConnected: messagingSocket.isConnected() }}>
      {children}
    </MessagingContext.Provider>
  );
}

export function useMessagingConnection() {
  return useContext(MessagingContext);
}
