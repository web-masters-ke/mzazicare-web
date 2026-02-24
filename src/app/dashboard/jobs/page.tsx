"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth';
import { BottomNav } from '@/components/layout/BottomNav';
import { useBookings } from '@/hooks/useBookings';
import { Button, Badge, Spinner } from '@/components/ui';
import { motion } from 'framer-motion';
import { UserRole, BookingStatus } from '@/types/models';
import toast from 'react-hot-toast';
import {
  Briefcase,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  User,
  Heart,
  CheckCircle,
  XCircle,
} from 'lucide-react';

function JobsContent() {
  const router = useRouter();
  const { bookings, isLoading, fetchBookings, acceptBooking, declineBooking } = useBookings();
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Fetch pending/available bookings for caregiver
    fetchBookings(BookingStatus.PENDING);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
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

  const handleAccept = async (bookingId: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-medium">Accept this job?</p>
        <p className="text-sm text-dark-600 dark:text-dark-400">You'll be committed to providing care at the scheduled time.</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              proceedWithAccept(bookingId);
            }}
            className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600"
          >
            Accept
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 bg-dark-100 dark:bg-dark-800 text-dark-900 dark:text-white rounded-lg text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
    });
  };

  const proceedWithAccept = async (bookingId: string) => {
    setIsProcessing(true);
    try {
      await acceptBooking(bookingId);
      toast.success('Job accepted successfully!', { icon: '✅' });
    } catch (error: any) {
      console.error('Failed to accept job:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to accept job. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setShowDeclineModal(true);
  };

  const proceedWithDecline = async () => {
    if (!declineReason.trim()) {
      toast.error('Please provide a reason for declining');
      return;
    }

    if (!selectedBookingId) return;

    setIsProcessing(true);
    try {
      await declineBooking(selectedBookingId, declineReason);
      toast.success('Job declined successfully');
      setShowDeclineModal(false);
      setDeclineReason('');
      setSelectedBookingId(null);
    } catch (error: any) {
      console.error('Failed to decline job:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to decline job. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">
      <div className="relative pb-24 pt-8 px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-1">
            Available Jobs
          </h1>
          <p className="text-dark-600 dark:text-dark-400">
            {bookings.length} {bookings.length === 1 ? 'opportunity' : 'opportunities'} available
          </p>
        </motion.div>

        {/* Jobs List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        ) : bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-50 dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 p-12 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
              <Briefcase className="w-10 h-10 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-dark-900 dark:text-white mb-2">
              No jobs available
            </h3>
            <p className="text-dark-600 dark:text-dark-400">
              Check back later for new caregiving opportunities
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-dark-50 dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 p-6"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Job Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-2">
                          Care for {booking.elderly?.firstName} {booking.elderly?.lastName}
                        </h3>
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                          {booking.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-dark-600 dark:text-dark-400">
                        <Calendar className="w-5 h-5" />
                        <div>
                          <p className="text-xs text-dark-500">Date & Time</p>
                          <p className="font-medium text-dark-900 dark:text-white">
                            {formatDate(booking.scheduledStartTime)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-dark-600 dark:text-dark-400">
                        <Clock className="w-5 h-5" />
                        <div>
                          <p className="text-xs text-dark-500">Duration</p>
                          <p className="font-medium text-dark-900 dark:text-white">
                            {formatDuration(booking.scheduledStartTime, booking.scheduledEndTime)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-dark-600 dark:text-dark-400">
                        <DollarSign className="w-5 h-5" />
                        <div>
                          <p className="text-xs text-dark-500">Payment</p>
                          <p className="font-medium text-dark-900 dark:text-white">
                            KES {booking.totalAmount?.toLocaleString() || 'TBD'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Elderly Info */}
                    {booking.elderly && (
                      <div className="p-4 rounded-2xl bg-dark-100 dark:bg-dark-800 border border-dark-100 dark:border-dark-800">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                            <Heart className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-dark-900 dark:text-white mb-1">
                              Care Recipient Details
                            </p>
                            <div className="text-sm text-dark-600 dark:text-dark-400 space-y-1">
                              <p>
                                Care recipient details available in booking
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {booking.specialInstructions && (
                      <div className="mt-4">
                        <p className="text-sm text-dark-600 dark:text-dark-400 mb-1">
                          <strong>Special Instructions:</strong>
                        </p>
                        <p className="text-sm text-dark-700 dark:text-dark-300">
                          {booking.specialInstructions}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-3 lg:w-48">
                    <Button
                      variant="primary"
                      onClick={() => handleAccept(booking.id)}
                      leftIcon={<CheckCircle className="w-5 h-5" />}
                      className="flex-1"
                    >
                      Accept Job
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDecline(booking.id)}
                      leftIcon={<XCircle className="w-5 h-5" />}
                      className="flex-1"
                    >
                      Decline
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => router.push(`/dashboard/bookings/${booking.id}`)}
                      className="flex-1"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Decline Job Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-dark-900 rounded-2xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-2">
              Decline Job
            </h3>
            <p className="text-dark-600 dark:text-dark-400 mb-4">
              Please provide a reason for declining this job:
            </p>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="e.g., Schedule conflict, location too far, etc."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
            />
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowDeclineModal(false);
                  setDeclineReason('');
                  setSelectedBookingId(null);
                }}
                disabled={isProcessing}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={proceedWithDecline}
                disabled={isProcessing || !declineReason.trim()}
                className="flex-1"
              >
                {isProcessing ? 'Declining...' : 'Decline Job'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

export default function JobsPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.CAREGIVER]}>
      <JobsContent />
    </ProtectedRoute>
  );
}
