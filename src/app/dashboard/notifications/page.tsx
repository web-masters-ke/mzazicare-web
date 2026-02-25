"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth';
import { DashboardNav } from '@/components/layout/DashboardNav';
import { BottomNav } from '@/components/layout/BottomNav';
import { useNotifications } from '@/hooks/useNotifications';
import { Button, Spinner } from '@/components/ui';
import { motion } from 'framer-motion';
import {
  Bell,
  CheckCircle,
  Calendar,
  DollarSign,
  User,
  AlertCircle,
  Trash2,
  CheckCheck,
  ArrowLeft,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

function NotificationsContent() {
  const router = useRouter();
  const {
    notifications,
    isLoading,
    pagination,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'BOOKING_CONFIRMED':
      case 'CAREGIVER_ARRIVAL':
      case 'CAREGIVER_DEPARTURE':
        return <Calendar className="w-5 h-5" />;
      case 'PAYMENT':
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
      case 'PAYMENT':
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
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    if (notification.data?.bookingId) {
      router.push(`/dashboard/bookings/${notification.data.bookingId}`);
    } else if (notification.data?.emergencyId) {
      router.push(`/dashboard/emergencies/${notification.data.emergencyId}`);
    }
  };

  const handleDelete = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  const loadMore = () => {
    if (pagination?.hasNextPage) {
      fetchNotifications(pagination.currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">
      <DashboardNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-dark-700 dark:text-dark-300" />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-dark-900 dark:text-white">
                Notifications
              </h1>
              <p className="text-dark-600 dark:text-dark-400">
                Stay updated with your care activities
              </p>
            </div>
            {notifications.some((n) => !n.isRead) && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleMarkAllRead}
                leftIcon={<CheckCheck className="w-4 h-4" />}
              >
                Mark all read
              </Button>
            )}
          </div>
        </motion.div>

        {/* Notifications List */}
        {isLoading && notifications.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        ) : notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Bell className="w-16 h-16 mx-auto mb-4 text-dark-300 dark:text-dark-600" />
            <h3 className="text-xl font-semibold text-dark-900 dark:text-white mb-2">
              No notifications yet
            </h3>
            <p className="text-dark-600 dark:text-dark-400">
              We'll notify you when something important happens
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-dark-50 dark:bg-dark-900 rounded-2xl p-5 border cursor-pointer hover:shadow-md transition-all relative ${
                  !notification.isRead
                    ? 'border-primary-200 dark:border-primary-900/30 bg-primary-50/50 dark:bg-primary-900/10'
                    : 'border-dark-100 dark:border-dark-800'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-3 rounded-xl flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-base font-semibold text-dark-900 dark:text-white">
                        {notification.title}
                      </h4>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                      )}
                    </div>
                    <p className="text-sm text-dark-600 dark:text-dark-400 mb-2">
                      {notification.body}
                    </p>
                    <p className="text-xs text-dark-500 dark:text-dark-500">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDelete(e, notification.id)}
                    className="p-2 rounded-lg hover:bg-dark-200 dark:hover:bg-dark-700 text-dark-500 dark:text-dark-400 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}

            {/* Load More */}
            {pagination?.hasNextPage && (
              <div className="text-center pt-4">
                <Button
                  variant="secondary"
                  onClick={loadMore}
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <NotificationsContent />
    </ProtectedRoute>
  );
}
