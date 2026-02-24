"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth';
import { DashboardNav } from '@/components/layout/DashboardNav';
import { useAuth } from '@/hooks/useAuth';
import { useBookings } from '@/hooks/useBookings';
import { useMessaging } from '@/hooks/useMessaging';
import { Button, Badge, Spinner } from '@/components/ui';
import { motion } from 'framer-motion';
import { BookingStatus, UserRole, ConversationType } from '@/types/models';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  XCircle,
  MessageSquare,
} from 'lucide-react';

function BookingDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;
  const { userRole } = useAuth();
  const { currentBooking, isLoading, fetchBookingById, cancelBooking, rescheduleBooking } = useBookings();
  const { createConversation } = useMessaging();
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [newDateTime, setNewDateTime] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);

  useEffect(() => {
    if (bookingId) {
      fetchBookingById(bookingId);
    }
  }, [bookingId]);

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    setIsCancelling(true);
    try {
      await cancelBooking(bookingId, cancelReason);
      setShowCancelModal(false);
      router.push('/dashboard/bookings');
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReschedule = async () => {
    if (!newDateTime) {
      alert('Please select a new date and time');
      return;
    }

    setIsRescheduling(true);
    try {
      const durationMinutes = newDuration ? Number(newDuration) * 60 : undefined;
      await rescheduleBooking(bookingId, new Date(newDateTime).toISOString(), durationMinutes);
      setShowRescheduleModal(false);
      alert('Booking rescheduled successfully!');
      fetchBookingById(bookingId);
    } catch (error: any) {
      console.error('Failed to reschedule booking:', error);
      alert(error.response?.data?.message || error.message || 'Failed to reschedule booking. Please try again.');
    } finally {
      setIsRescheduling(false);
    }
  };

  const handleMessage = async () => {
    if (!currentBooking) return;

    // Determine who to message based on user role
    const otherUserId = userRole === UserRole.CAREGIVER
      ? currentBooking.familyUserId  // Caregiver messages the family
      : currentBooking.caregiverId;  // Family messages the caregiver

    if (!otherUserId) {
      alert('No caregiver assigned to this booking yet');
      return;
    }

    setIsCreatingConversation(true);
    try {
      const conversation = await createConversation({
        participantIds: [otherUserId],
        type: ConversationType.DIRECT,
      });

      router.push(`/dashboard/messages?conversation=${conversation.id}`);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to start conversation');
    } finally {
      setIsCreatingConversation(false);
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case BookingStatus.IN_PROGRESS:
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400';
      case BookingStatus.COMPLETED:
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case BookingStatus.CANCELLED:
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case BookingStatus.PENDING:
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const hours = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
        <DashboardNav />
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (!currentBooking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
        <DashboardNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 p-12 text-center">
            <AlertCircle className="w-16 h-16 text-dark-300 dark:text-dark-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-dark-900 dark:text-white mb-2">
              Booking not found
            </h3>
            <p className="text-dark-600 dark:text-dark-400 mb-6">
              The booking you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push('/dashboard/bookings')}>
              Back to Bookings
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const booking = currentBooking;
  const canCancel = booking.status === BookingStatus.CONFIRMED || booking.status === BookingStatus.PENDING;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      <DashboardNav />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          leftIcon={<ArrowLeft className="w-5 h-5" />}
          className="mb-6"
        >
          Back
        </Button>

        {/* Booking Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-dark-100 dark:border-dark-800">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
                  Booking Details
                </h1>
                <p className="text-dark-600 dark:text-dark-400">
                  Booking ID: {booking.id}
                </p>
              </div>
              <Badge className={getStatusColor(booking.status)}>
                {booking.status}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Schedule Info */}
            <div>
              <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
                Schedule
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-dark-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-dark-600 dark:text-dark-400">Start Time</p>
                    <p className="font-medium text-dark-900 dark:text-white">
                      {formatDate(booking.scheduledStartTime)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-dark-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-dark-600 dark:text-dark-400">Duration</p>
                    <p className="font-medium text-dark-900 dark:text-white">
                      {formatDuration(booking.scheduledStartTime, booking.scheduledEndTime)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Elderly Info */}
            {booking.elderly && (
              <div>
                <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
                  Care Recipient
                </h2>
                <div className="flex items-center gap-4 p-4 bg-dark-50 dark:bg-dark-800 rounded-xl">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-dark-900 dark:text-white">
                      {booking.elderly.firstName} {booking.elderly.lastName}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Caregiver Info */}
            {booking.caregiver && (
              <div>
                <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
                  {userRole === UserRole.FAMILY_USER ? 'Caregiver' : 'Your Assignment'}
                </h2>
                <div className="p-4 bg-dark-50 dark:bg-dark-800 rounded-xl space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-dark-900 dark:text-white">
                        {booking.caregiver.firstName} {booking.caregiver.lastName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Special Instructions */}
            {booking.specialInstructions && (
              <div>
                <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
                  Special Instructions
                </h2>
                <p className="text-dark-700 dark:text-dark-300 p-4 bg-dark-50 dark:bg-dark-800 rounded-xl">
                  {booking.specialInstructions}
                </p>
              </div>
            )}

            {/* Cancellation Reason */}
            {booking.status === BookingStatus.CANCELLED && booking.cancellationReason && (
              <div>
                <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
                  Cancellation Reason
                </h2>
                <p className="text-dark-700 dark:text-dark-300 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-900/20">
                  {booking.cancellationReason}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          {canCancel && userRole === UserRole.FAMILY_USER && (
            <div className="p-6 border-t border-dark-100 dark:border-dark-800 flex gap-3">
              <Button
                variant="secondary"
                onClick={handleMessage}
                leftIcon={<MessageSquare className="w-5 h-5" />}
                disabled={isCreatingConversation}
              >
                {isCreatingConversation ? 'Starting...' : 'Message'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowRescheduleModal(true)}
                leftIcon={<Calendar className="w-5 h-5" />}
              >
                Reschedule
              </Button>
              <Button
                variant="danger"
                onClick={() => setShowCancelModal(true)}
                leftIcon={<XCircle className="w-5 h-5" />}
              >
                Cancel Booking
              </Button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-dark-900 rounded-2xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-4">
              Cancel Booking
            </h3>
            <p className="text-dark-600 dark:text-dark-400 mb-4">
              Please provide a reason for cancelling this booking:
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Enter cancellation reason..."
              rows={4}
              className="w-full p-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
            />
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowCancelModal(false)}
                disabled={isCancelling}
                className="flex-1"
              >
                Keep Booking
              </Button>
              <Button
                variant="danger"
                onClick={handleCancel}
                disabled={isCancelling || !cancelReason.trim()}
                className="flex-1"
              >
                {isCancelling ? 'Cancelling...' : 'Confirm Cancel'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-dark-900 rounded-2xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-4">
              Reschedule Booking
            </h3>
            <p className="text-dark-600 dark:text-dark-400 mb-4">
              Select a new date and time for this booking:
            </p>

            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  New Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={newDateTime}
                  onChange={(e) => setNewDateTime(e.target.value)}
                  className="w-full p-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Duration (hours) - Optional
                </label>
                <input
                  type="number"
                  min="1"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  placeholder="Leave empty to keep current duration"
                  className="w-full p-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowRescheduleModal(false)}
                disabled={isRescheduling}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleReschedule}
                disabled={isRescheduling || !newDateTime}
                className="flex-1"
              >
                {isRescheduling ? 'Rescheduling...' : 'Confirm Reschedule'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default function BookingDetailsPage() {
  return (
    <ProtectedRoute>
      <BookingDetailsContent />
    </ProtectedRoute>
  );
}
