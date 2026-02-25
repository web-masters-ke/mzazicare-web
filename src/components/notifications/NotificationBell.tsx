"use client";

import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationPanel } from './NotificationPanel';
import { motion, AnimatePresence } from 'framer-motion';

export function NotificationBell() {
  const { unreadCount } = useNotifications();
  const [showPanel, setShowPanel] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowPanel(false);
      }
    };

    if (showPanel) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPanel]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 rounded-full hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-dark-700 dark:text-dark-300" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {showPanel && (
          <div ref={panelRef}>
            <NotificationPanel onClose={() => setShowPanel(false)} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
