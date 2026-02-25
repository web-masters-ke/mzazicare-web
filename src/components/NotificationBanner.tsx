"use client";

import { useState, useEffect } from "react";
import { useNotifications } from "@/components/NotificationProvider";
import { Bell, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function NotificationBanner() {
  const { isEnabled, isSupported, requestPermission } = useNotifications();
  const [isDismissed, setIsDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user has previously dismissed the banner
    const dismissed = localStorage.getItem("mzazicare-notification-banner-dismissed");
    if (dismissed === "true") {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("mzazicare-notification-banner-dismissed", "true");
  };

  const handleEnableNotifications = async () => {
    await requestPermission();
    // If permission is granted, dismiss the banner
    if (isEnabled) {
      handleDismiss();
    }
  };

  // Don't show if not mounted, not supported, already enabled, or dismissed
  if (!mounted || !isSupported || isEnabled || isDismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="fixed top-20 left-4 right-4 md:left-auto md:right-8 md:max-w-md z-40"
      >
        <div className="bg-primary-500 text-white rounded-2xl shadow-2xl p-4 flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1">Enable Notifications</h3>
            <p className="text-xs text-white/90 mb-3">
              Stay updated with real-time messages and booking updates. We'll only notify you when it matters.
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleEnableNotifications}
                className="text-xs font-semibold bg-white text-primary-600 px-4 py-2 rounded-lg hover:bg-white/90 transition-colors"
              >
                Enable
              </button>
              <button
                onClick={handleDismiss}
                className="text-xs font-medium text-white/90 px-3 py-2 hover:text-white transition-colors"
              >
                Not now
              </button>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
