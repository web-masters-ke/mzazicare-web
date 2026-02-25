"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useNotifications } from '@/hooks/useNotifications';
import {
  Bell,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  User,
  AlertCircle,
  Trash2,
  CheckCheck,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NotificationPanelProps {
  onClose: () => void;
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const router = useRouter();
  const {
    notifications,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  useEffect(() => {
    fetchNotifications(1, false);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'BOOKING_CONFIRMED':
      case 'CAREGIVER_ARRIVAL':
      case 'CAREGIVER_DEPARTURE':
        return <Calendar className="w-5 h-5" />;
      case 'PAYMENT_PENDING':
      case 'PAYMENT_APPROVED':
      case 'PAYMENT_RELEASED':
      case 'PAYMENT_DISPUTED':
        return <DollarSign className="w-5 h-5" />;
      case 'VISIT_REPORT':
        return <CheckCircle className="w-5 h-5" />;
      case 'EMERGENCY':
        return <AlertCircle className="w-5 h-5" />;
      case 'NEW_BOOKING_REQUEST':
      case 'CAREGIVER_ASSIGNED':
        return <User className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'BOOKING_CONFIRMED':
      case 'CAREGIVER_ARRIVAL':
      case 'PAYMENT_RELEASED':
        return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';
      case 'PAYMENT_PENDING':
      case 'PAYMENT_APPROVED':
      case 'VISIT_REPORT':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
      case 'PAYMENT_DISPUTED':
      case 'BOOKING_CANCELLED':
        return 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400';
      case 'EMERGENCY':
        return 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-dark-100 text-dark-600 dark:bg-dark-800 dark:text-dark-400';
    }
  };

  const handleNotificationClick = async (notification: typeof notifications[0]) => {
    // Mark as read
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    // Navigate based on type
    if (notification.data?.bookingId) {
      router.push(`/dashboard/bookings/${notification.data.bookingId}`);
      onClose();
    } else if (notification.data?.emergencyId) {
      router.push(`/dashboard/emergencies/${notification.data.emergencyId}`);
      onClose();
    }
  };

  const handleDelete = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute right-0 top-12 w-96 max-h-[600px] bg-white dark:bg-dark-900 rounded-2xl shadow-2xl border border-dark-200 dark:border-dark-800 overflow-hidden z-50"
    >
      {/* Header */}
      <div className="p-4 border-b border-dark-200 dark:border-dark-800 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark-900 dark:text-white">Notifications</h3>
        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-[500px] overflow-y-auto">
        {isLoading && (
          <div className="p-8 text-center text-dark-500 dark:text-dark-400">
            Loading...
          </div>
        )}

        {!isLoading && notifications.length === 0 && (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 mx-auto mb-3 text-dark-300 dark:text-dark-600" />
            <p className="text-dark-600 dark:text-dark-400">No notifications yet</p>
          </div>
        )}

        {!isLoading && notifications.length > 0 && (
          <div className="divide-y divide-dark-100 dark:divide-dark-800">
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 hover:bg-dark-50 dark:hover:bg-dark-800 cursor-pointer transition-colors relative ${
                  !notification.isRead ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`p-2 rounded-xl flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-dark-900 dark:text-white mb-1">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-dark-600 dark:text-dark-400 line-clamp-2">
                      {notification.body}
                    </p>
                    <p className="text-xs text-dark-500 dark:text-dark-500 mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDelete(e, notification.id)}
                    className="p-1 rounded-lg hover:bg-dark-200 dark:hover:bg-dark-700 text-dark-500 dark:text-dark-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Unread indicator */}
                {!notification.isRead && (
                  <div className="absolute top-4 right-4 w-2 h-2 bg-primary-500 rounded-full"></div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-dark-200 dark:border-dark-800 text-center">
          <button
            onClick={() => {
              router.push('/dashboard/notifications');
              onClose();
            }}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            View all notifications
          </button>
        </div>
      )}
    </motion.div>
  );
}
