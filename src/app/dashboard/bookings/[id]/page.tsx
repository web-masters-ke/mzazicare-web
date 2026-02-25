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
import toast from 'react-hot-toast';
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
  Sparkles,
  Star,
  LogIn,
  LogOut,
  FileText,
  Wallet,
  Shield,
  DollarSign,
} from 'lucide-react';

function BookingDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;
  const { userRole } = useAuth();
  const { currentBooking, isLoading, fetchBookingById, cancelBooking, rescheduleBooking, acceptBooking, declineBooking } = useBookings();
  const { createConversation } = useMessaging();
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [newDateTime, setNewDateTime] = useState('');
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportData, setReportData] = useState({
    tasksCompleted: [] as string[],
    observations: '',
    issues: '',
    riskLevel: 'low' as 'low' | 'medium' | 'high',
  });
  const [taskInput, setTaskInput] = useState('');
  const [visit, setVisit] = useState<any>(null);

  useEffect(() => {
    if (bookingId) {
      fetchBookingById(bookingId);
      fetchVisitDetails();
    }
  }, [bookingId]);

  const fetchVisitDetails = async () => {
    try {
      const { EnvConfig } = await import('@/config/env.config');
      const { storageService } = await import('@/services/storage/storage.service');
      const { ApiEndpoints } = await import('@/config/api-endpoints');

      const accessToken = await storageService.getAccessToken();
      const response = await fetch(`${EnvConfig.baseUrl}${ApiEndpoints.visit.byBookingId(bookingId)}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVisit(data.data);
      }
    } catch (error) {
      console.log('No visit data yet');
    }
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    setIsCancelling(true);
    try {
      await cancelBooking(bookingId, cancelReason);
      toast.success('Booking cancelled successfully');
      setShowCancelModal(false);
      setTimeout(() => {
        router.push('/dashboard/bookings');
      }, 500);
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      toast.error('Failed to cancel booking. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReschedule = async () => {
    if (!newDateTime) {
      toast.error('Please select a new date and time');
      return;
    }

    setIsRescheduling(true);
    try {
      // Parse the datetime-local input
      const dateTime = new Date(newDateTime);

      // Extract date in ISO format
      const scheduledDate = dateTime.toISOString();

      // Extract time in HH:MM format
      const hours = dateTime.getHours().toString().padStart(2, '0');
      const minutes = dateTime.getMinutes().toString().padStart(2, '0');
      const scheduledTime = `${hours}:${minutes}`;

      await rescheduleBooking(bookingId, scheduledDate, scheduledTime);
      toast.success('Booking rescheduled successfully!', { icon: '📅' });
      setShowRescheduleModal(false);
      fetchBookingById(bookingId);
    } catch (error: any) {
      console.error('Failed to reschedule booking:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to reschedule booking. Please try again.');
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
      toast.error('No caregiver assigned to this booking yet');
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
      toast.error(error.response?.data?.message || 'Failed to start conversation');
    } finally {
      setIsCreatingConversation(false);
    }
  };

  const handleAcceptBooking = async () => {
    setIsAccepting(true);
    try {
      await acceptBooking(bookingId);
      toast.success('Booking accepted successfully!', { icon: '✅' });
      setTimeout(() => {
        router.push('/dashboard/bookings');
      }, 500);
    } catch (error: any) {
      console.error('Failed to accept booking:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to accept booking');
    } finally {
      setIsAccepting(false);
    }
  };

  const handleDeclineBooking = async () => {
    if (!declineReason.trim()) {
      toast.error('Please provide a reason for declining');
      return;
    }

    setIsDeclining(true);
    try {
      await declineBooking(bookingId, declineReason);
      toast.success('Booking declined', { icon: 'ℹ️' });
      setShowDeclineModal(false);
      setTimeout(() => {
        router.push('/dashboard/bookings');
      }, 500);
    } catch (error: any) {
      console.error('Failed to decline booking:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to decline booking');
    } finally {
      setIsDeclining(false);
    }
  };

  const getLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  const handleCheckIn = async () => {
    setIsCheckingIn(true);
    try {
      toast.loading('Getting your location...', { id: 'checkin' });
      const location = await getLocation();

      const { EnvConfig } = await import('@/config/env.config');
      const { storageService } = await import('@/services/storage/storage.service');
      const { ApiEndpoints } = await import('@/config/api-endpoints');

      const accessToken = await storageService.getAccessToken();
      const response = await fetch(`${EnvConfig.baseUrl}${ApiEndpoints.visit.checkIn(bookingId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(location),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to check in');
      }

      const data = await response.json();
      toast.success(data.data?.message || 'Checked in successfully!', { id: 'checkin' });
      fetchBookingById(bookingId);
      fetchVisitDetails();
    } catch (error: any) {
      console.error('Check-in failed:', error);
      toast.error(error.message || 'Failed to check in. Please try again.', { id: 'checkin' });
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    setIsCheckingOut(true);
    try {
      toast.loading('Getting your location...', { id: 'checkout' });
      const location = await getLocation();

      const { EnvConfig } = await import('@/config/env.config');
      const { storageService } = await import('@/services/storage/storage.service');
      const { ApiEndpoints } = await import('@/config/api-endpoints');

      const accessToken = await storageService.getAccessToken();
      const response = await fetch(`${EnvConfig.baseUrl}${ApiEndpoints.visit.checkOut(bookingId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(location),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to check out');
      }

      const data = await response.json();
      toast.success(data.data?.message || 'Checked out successfully!', { id: 'checkout' });
      setShowReportModal(true);
      fetchVisitDetails();
    } catch (error: any) {
      console.error('Check-out failed:', error);
      toast.error(error.message || 'Failed to check out. Please try again.', { id: 'checkout' });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleAddTask = () => {
    if (taskInput.trim()) {
      setReportData({
        ...reportData,
        tasksCompleted: [...reportData.tasksCompleted, taskInput.trim()],
      });
      setTaskInput('');
    }
  };

  const handleRemoveTask = (index: number) => {
    setReportData({
      ...reportData,
      tasksCompleted: reportData.tasksCompleted.filter((_, i) => i !== index),
    });
  };

  const handleSubmitReport = async () => {
    if (reportData.tasksCompleted.length === 0) {
      toast.error('Please add at least one completed task');
      return;
    }

    setIsSubmittingReport(true);
    try {
      const { EnvConfig } = await import('@/config/env.config');
      const { storageService } = await import('@/services/storage/storage.service');
      const { ApiEndpoints } = await import('@/config/api-endpoints');

      const accessToken = await storageService.getAccessToken();
      const response = await fetch(`${EnvConfig.baseUrl}${ApiEndpoints.visit.submitReport(bookingId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to submit report');
      }

      toast.success('Visit report submitted successfully!', { icon: '✅' });
      setShowReportModal(false);
      fetchBookingById(bookingId);
      fetchVisitDetails();

      setTimeout(() => {
        router.push('/dashboard/bookings');
      }, 1000);
    } catch (error: any) {
      console.error('Report submission failed:', error);
      toast.error(error.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmittingReport(false);
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
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const formatDateTime = (dateString: string, timeString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';

    const formattedDate = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);

    if (timeString) {
      return `${formattedDate} at ${timeString}`;
    }

    return formattedDate;
  };

  const formatDuration = (durationMinutes: number) => {
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    if (hours > 0 && minutes > 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} min`;
    } else if (hours > 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
      return `${minutes} minutes`;
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
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
                {booking.serviceType && (
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-dark-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-dark-600 dark:text-dark-400">Service Type</p>
                      <p className="font-medium text-dark-900 dark:text-white">
                        {booking.serviceType.name || booking.serviceType.category}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-dark-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-dark-600 dark:text-dark-400">Scheduled For</p>
                    <p className="font-medium text-dark-900 dark:text-white">
                      {formatDateTime(booking.scheduledDate, booking.scheduledTime)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-dark-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-dark-600 dark:text-dark-400">Duration</p>
                    <p className="font-medium text-dark-900 dark:text-white">
                      {formatDuration(booking.duration || booking.durationMinutes || 0)}
                    </p>
                  </div>
                </div>
                {booking.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-dark-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-dark-600 dark:text-dark-400">Location</p>
                      <p className="font-medium text-dark-900 dark:text-white">
                        {booking.address}
                      </p>
                      {booking.elderly?.locationNotes && (
                        <p className="text-sm text-dark-600 dark:text-dark-400 mt-1">
                          {booking.elderly.locationNotes}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Elderly Info */}
            {booking.elderly && (
              <div>
                <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
                  Care Recipient
                </h2>
                <div className="p-4 bg-dark-50 dark:bg-dark-800 rounded-xl space-y-4">
                  <div className="flex items-center gap-4">
                    {booking.elderly.photo ? (
                      <img
                        src={booking.elderly.photo}
                        alt={booking.elderly.fullName || 'Elderly'}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-dark-900 dark:text-white text-lg">
                        {booking.elderly.fullName || `${booking.elderly.firstName || ''} ${booking.elderly.lastName || ''}`.trim() || 'Unknown'}
                      </p>
                      {booking.elderly.dateOfBirth && (
                        <p className="text-sm text-dark-600 dark:text-dark-400">
                          {calculateAge(booking.elderly.dateOfBirth)} years old • {booking.elderly.gender}
                        </p>
                      )}
                    </div>
                  </div>

                  {(booking.elderly.medicalConditions || booking.elderly.medications || booking.elderly.mobilityNotes) && (
                    <div className="space-y-2 pt-2 border-t border-dark-200 dark:border-dark-700">
                      {booking.elderly.medicalConditions && (
                        <div>
                          <p className="text-xs font-medium text-dark-600 dark:text-dark-400 uppercase mb-1">
                            Medical Conditions
                          </p>
                          <p className="text-sm text-dark-900 dark:text-white">
                            {booking.elderly.medicalConditions}
                          </p>
                        </div>
                      )}
                      {booking.elderly.medications && (
                        <div>
                          <p className="text-xs font-medium text-dark-600 dark:text-dark-400 uppercase mb-1">
                            Medications
                          </p>
                          <p className="text-sm text-dark-900 dark:text-white">
                            {booking.elderly.medications}
                          </p>
                        </div>
                      )}
                      {booking.elderly.mobilityNotes && (
                        <div>
                          <p className="text-xs font-medium text-dark-600 dark:text-dark-400 uppercase mb-1">
                            Mobility
                          </p>
                          <p className="text-sm text-dark-900 dark:text-white">
                            {booking.elderly.mobilityNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
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
                    {booking.caregiver.user?.profilePhoto ? (
                      <img
                        src={booking.caregiver.user.profilePhoto}
                        alt={booking.caregiver.user.fullName || 'Caregiver'}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-dark-900 dark:text-white">
                        {booking.caregiver.user?.fullName || booking.caregiver.fullName || `${booking.caregiver.firstName || ''} ${booking.caregiver.lastName || ''}`.trim() || 'Caregiver'}
                      </p>
                      {booking.caregiver.rating && booking.caregiver.rating > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-dark-600 dark:text-dark-400">
                            {booking.caregiver.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Information */}
            {booking.totalAmount && (
              <div>
                <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
                  Payment Details
                </h2>
                <div className="p-4 bg-dark-50 dark:bg-dark-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-dark-600 dark:text-dark-400">Service Amount</span>
                    <span className="font-semibold text-dark-900 dark:text-white">
                      KES {Number(booking.totalAmount).toFixed(2)}
                    </span>
                  </div>
                  {booking.platformFee && (
                    <div className="flex items-center justify-between">
                      <span className="text-dark-600 dark:text-dark-400">Platform Fee (15%)</span>
                      <span className="text-sm text-dark-600 dark:text-dark-400">
                        KES {Number(booking.platformFee).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {booking.caregiverAmount && userRole === UserRole.CAREGIVER && (
                    <div className="flex items-center justify-between pt-2 border-t border-dark-200 dark:border-dark-700">
                      <span className="text-dark-600 dark:text-dark-400">Your Earnings</span>
                      <span className="font-bold text-lg text-green-600 dark:text-green-400">
                        KES {Number(booking.caregiverAmount).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {booking.payment && (
                    <div className="flex items-center justify-between pt-2 border-t border-dark-200 dark:border-dark-700">
                      <span className="text-dark-600 dark:text-dark-400">Payment Status</span>
                      <Badge className={
                        booking.payment.status === 'ESCROW_HELD'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                          : booking.payment.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }>
                        {booking.payment.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Escrow Information */}
            {booking.escrow && (
              <div>
                <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
                  <Shield className="w-5 h-5 inline mr-2" />
                  Escrow Protection
                </h2>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-900/20 space-y-3">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Funds are held securely in escrow
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        {booking.escrow.releaseMode === 'AUTO_RELEASE'
                          ? 'Funds will be automatically released 24 hours after visit completion'
                          : 'Funds will be released after family approval (within 48 hours)'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-blue-200 dark:border-blue-900/20">
                    <span className="text-sm text-blue-900 dark:text-blue-100">Escrow Status</span>
                    <Badge className={
                      booking.escrow.status === 'HELD'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                        : booking.escrow.status === 'PENDING_RELEASE'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : booking.escrow.status === 'RELEASED'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                    }>
                      {booking.escrow.status}
                    </Badge>
                  </div>
                  {booking.escrow.releaseDeadline && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-900 dark:text-blue-100">Release Deadline</span>
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        {new Date(booking.escrow.releaseDeadline).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            {(booking.notes || booking.specialInstructions || booking.elderly?.specialInstructions) && (
              <div>
                <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
                  Special Instructions
                </h2>
                <div className="space-y-3">
                  {booking.notes && (
                    <div className="p-4 bg-dark-50 dark:bg-dark-800 rounded-xl">
                      <p className="text-xs font-medium text-dark-600 dark:text-dark-400 uppercase mb-1">
                        Booking Notes
                      </p>
                      <p className="text-dark-700 dark:text-dark-300">
                        {booking.notes}
                      </p>
                    </div>
                  )}
                  {booking.elderly?.specialInstructions && (
                    <div className="p-4 bg-dark-50 dark:bg-dark-800 rounded-xl">
                      <p className="text-xs font-medium text-dark-600 dark:text-dark-400 uppercase mb-1">
                        Care Instructions
                      </p>
                      <p className="text-dark-700 dark:text-dark-300">
                        {booking.elderly.specialInstructions}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Visit Details */}
            {visit && (visit.checkInTime || visit.checkOutTime) && (
              <div>
                <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
                  Visit Details
                </h2>
                <div className="space-y-3 p-4 bg-dark-50 dark:bg-dark-800 rounded-xl">
                  {visit.checkInTime && (
                    <div className="flex items-start gap-3">
                      <LogIn className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-dark-600 dark:text-dark-400">Check-in Time</p>
                        <p className="font-medium text-dark-900 dark:text-white">
                          {new Date(visit.checkInTime).toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {visit.checkInVerified ? (
                            <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Location verified
                            </span>
                          ) : (
                            <span className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Location not verified
                            </span>
                          )}
                        </div>
                        {visit.checkInLat && visit.checkInLng && userRole === UserRole.CAREGIVER && (
                          <p className="text-xs text-dark-500 dark:text-dark-400 mt-1">
                            Lat: {visit.checkInLat.toFixed(6)}, Lng: {visit.checkInLng.toFixed(6)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {visit.checkOutTime && (
                    <div className="flex items-start gap-3 pt-3 border-t border-dark-200 dark:border-dark-700">
                      <LogOut className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-dark-600 dark:text-dark-400">Check-out Time</p>
                        <p className="font-medium text-dark-900 dark:text-white">
                          {new Date(visit.checkOutTime).toLocaleString()}
                        </p>
                        {visit.actualDuration && (
                          <p className="text-sm text-dark-600 dark:text-dark-400 mt-1">
                            <Clock className="w-3 h-3 inline mr-1" />
                            Duration: {formatDuration(visit.actualDuration)}
                          </p>
                        )}
                        {visit.checkOutLat && visit.checkOutLng && userRole === UserRole.CAREGIVER && (
                          <p className="text-xs text-dark-500 dark:text-dark-400 mt-1">
                            Lat: {visit.checkOutLat.toFixed(6)}, Lng: {visit.checkOutLng.toFixed(6)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {visit.report && (
                    <div className="pt-3 border-t border-dark-200 dark:border-dark-700">
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm font-medium">Visit report submitted</span>
                      </div>
                    </div>
                  )}
                </div>
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

          {/* Actions - Family User */}
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

          {/* Actions - Caregiver - Pending Booking */}
          {userRole === UserRole.CAREGIVER && booking.status === BookingStatus.PENDING && (
            <div className="p-6 border-t border-dark-100 dark:border-dark-800 flex gap-3">
              <Button
                variant="secondary"
                onClick={handleMessage}
                leftIcon={<MessageSquare className="w-5 h-5" />}
                disabled={isCreatingConversation}
              >
                {isCreatingConversation ? 'Starting...' : 'Message Family'}
              </Button>
              <Button
                variant="danger"
                onClick={() => setShowDeclineModal(true)}
                leftIcon={<XCircle className="w-5 h-5" />}
                disabled={isAccepting || isDeclining}
              >
                Decline
              </Button>
              <Button
                variant="primary"
                onClick={handleAcceptBooking}
                leftIcon={<CheckCircle className="w-5 h-5" />}
                disabled={isAccepting || isDeclining}
              >
                {isAccepting ? 'Accepting...' : 'Accept Booking'}
              </Button>
            </div>
          )}

          {/* Actions - Caregiver - Check In */}
          {userRole === UserRole.CAREGIVER && booking.status === BookingStatus.CONFIRMED && (
            <div className="p-6 border-t border-dark-100 dark:border-dark-800 flex gap-3">
              <Button
                variant="secondary"
                onClick={handleMessage}
                leftIcon={<MessageSquare className="w-5 h-5" />}
                disabled={isCreatingConversation}
              >
                {isCreatingConversation ? 'Starting...' : 'Message Family'}
              </Button>
              <Button
                variant="primary"
                onClick={handleCheckIn}
                leftIcon={<LogIn className="w-5 h-5" />}
                disabled={isCheckingIn}
                className="flex-1"
              >
                {isCheckingIn ? 'Checking In...' : 'Check In'}
              </Button>
            </div>
          )}

          {/* Actions - Caregiver - Check Out */}
          {userRole === UserRole.CAREGIVER && booking.status === BookingStatus.IN_PROGRESS && (
            <div className="p-6 border-t border-dark-100 dark:border-dark-800 flex gap-3">
              <Button
                variant="secondary"
                onClick={handleMessage}
                leftIcon={<MessageSquare className="w-5 h-5" />}
                disabled={isCreatingConversation}
              >
                {isCreatingConversation ? 'Starting...' : 'Message Family'}
              </Button>
              <Button
                variant="primary"
                onClick={handleCheckOut}
                leftIcon={<LogOut className="w-5 h-5" />}
                disabled={isCheckingOut}
                className="flex-1"
              >
                {isCheckingOut ? 'Checking Out...' : 'Check Out'}
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

            <div className="mb-4">
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                New Date & Time *
              </label>
              <input
                type="datetime-local"
                value={newDateTime}
                onChange={(e) => setNewDateTime(e.target.value)}
                className="w-full p-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="mt-2 text-sm text-dark-500 dark:text-dark-400">
                Note: Duration will remain the same ({formatDuration(currentBooking?.duration || currentBooking?.durationMinutes || 0)})
              </p>
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

      {/* Decline Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-dark-900 rounded-2xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-4">
              Decline Booking
            </h3>
            <p className="text-dark-600 dark:text-dark-400 mb-4">
              Please provide a reason for declining this booking:
            </p>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Enter reason for declining..."
              rows={4}
              className="w-full p-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
            />
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowDeclineModal(false)}
                disabled={isDeclining}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeclineBooking}
                disabled={isDeclining || !declineReason.trim()}
                className="flex-1"
              >
                {isDeclining ? 'Declining...' : 'Confirm Decline'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Visit Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-dark-900 rounded-2xl max-w-2xl w-full p-6 my-8"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-1">
                  Visit Report
                </h3>
                <p className="text-dark-600 dark:text-dark-400">
                  Please provide details about your visit
                </p>
              </div>
              <FileText className="w-6 h-6 text-primary-500" />
            </div>

            {/* Tasks Completed */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                Tasks Completed *
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                  placeholder="Enter a task and press Enter..."
                  className="flex-1 p-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Button onClick={handleAddTask} disabled={!taskInput.trim()}>
                  Add
                </Button>
              </div>
              {reportData.tasksCompleted.length > 0 && (
                <div className="space-y-2">
                  {reportData.tasksCompleted.map((task, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-dark-50 dark:bg-dark-800 rounded-xl"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-dark-900 dark:text-white">{task}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveTask(index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Observations */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                Observations
              </label>
              <textarea
                value={reportData.observations}
                onChange={(e) => setReportData({ ...reportData, observations: e.target.value })}
                placeholder="Any observations about the elderly person..."
                rows={3}
                className="w-full p-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Issues */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                Issues or Concerns
              </label>
              <textarea
                value={reportData.issues}
                onChange={(e) => setReportData({ ...reportData, issues: e.target.value })}
                placeholder="Any issues or concerns that need attention..."
                rows={3}
                className="w-full p-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Risk Level */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                Risk Level
              </label>
              <div className="flex gap-3">
                {(['low', 'medium', 'high'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setReportData({ ...reportData, riskLevel: level })}
                    className={`flex-1 p-3 rounded-xl border-2 font-medium capitalize transition-colors ${
                      reportData.riskLevel === level
                        ? level === 'low'
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          : level === 'medium'
                          ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                          : 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                        : 'border-dark-200 dark:border-dark-700 text-dark-600 dark:text-dark-400'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowReportModal(false)}
                disabled={isSubmittingReport}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmitReport}
                disabled={isSubmittingReport || reportData.tasksCompleted.length === 0}
                className="flex-1"
              >
                {isSubmittingReport ? 'Submitting...' : 'Submit Report'}
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
