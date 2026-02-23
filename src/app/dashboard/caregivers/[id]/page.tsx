"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth';
import { DashboardNav } from '@/components/layout/DashboardNav';
import { useCaregiver } from '@/hooks/useCaregiver';
import { useElderly } from '@/hooks/useElderly';
import { useBookings } from '@/hooks/useBookings';
import { useMessaging } from '@/hooks/useMessaging';
import { Button, Badge, Spinner } from '@/components/ui';
import { motion } from 'framer-motion';
import { UserRole, DocumentStatus, ServiceCategory, ConversationType } from '@/types/models';
import {
  ArrowLeft,
  User,
  Star,
  MapPin,
  DollarSign,
  Calendar,
  Award,
  Clock,
  Phone,
  Mail,
  CheckCircle,
  MessageSquare,
  Heart,
} from 'lucide-react';

function CaregiverProfileContent() {
  const router = useRouter();
  const params = useParams();
  const caregiverId = params.id as string;
  const { currentCaregiver, isLoading, getCaregiverById } = useCaregiver();
  const { elderlyList, fetchElderlyList } = useElderly();
  const { createBooking, isLoading: isCreatingBooking } = useBookings();
  const { createConversation } = useMessaging();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedElderly, setSelectedElderly] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingHours, setBookingHours] = useState('4');
  const [serviceType, setServiceType] = useState<ServiceCategory>(ServiceCategory.COMPANIONSHIP);
  const [bookingNotes, setBookingNotes] = useState('');
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);

  useEffect(() => {
    if (caregiverId) {
      getCaregiverById(caregiverId);
      fetchElderlyList();
    }
  }, [caregiverId]);

  const handleMessage = async () => {
    if (!currentCaregiver) return;

    setIsCreatingConversation(true);
    try {
      const payload = {
        participantIds: [currentCaregiver.userId],
        type: ConversationType.DIRECT,
      };

      console.log('Creating conversation with payload:', payload);
      console.log('Current caregiver:', currentCaregiver);

      const conversation = await createConversation(payload);

      // Navigate to messages page with the conversation selected
      router.push(`/dashboard/messages?conversation=${conversation.id}`);
    } catch (error: any) {
      console.error('Failed to create conversation:', error);
      console.error('Error response:', error.response?.data);
      alert(error.response?.data?.message || 'Failed to start conversation');
    } finally {
      setIsCreatingConversation(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedElderly || !bookingDate || !bookingHours) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const durationMinutes = Number(bookingHours) * 60;
      await createBooking({
        elderlyId: selectedElderly,
        caregiverId: caregiverId,
        serviceType: serviceType,
        scheduledStartTime: new Date(bookingDate).toISOString(),
        durationMinutes: durationMinutes,
        specialInstructions: bookingNotes || undefined,
      });

      alert('Booking created successfully! Redirecting to bookings...');
      setShowBookingModal(false);

      // Reset form
      setSelectedElderly('');
      setBookingDate('');
      setBookingHours('4');
      setServiceType(ServiceCategory.COMPANIONSHIP);
      setBookingNotes('');

      // Redirect to bookings page
      router.push('/dashboard/bookings');
    } catch (error: any) {
      console.error('Failed to create booking:', error);
      alert(error.response?.data?.message || error.message || 'Failed to create booking. Please try again.');
    }
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

  if (!currentCaregiver) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
        <DashboardNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 p-12 text-center">
            <User className="w-16 h-16 text-dark-300 dark:text-dark-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-dark-900 dark:text-white mb-2">
              Caregiver not found
            </h3>
            <p className="text-dark-600 dark:text-dark-400 mb-6">
              The caregiver profile you're looking for doesn't exist.
            </p>
            <Button onClick={() => router.push('/dashboard/caregivers')}>
              Back to Caregivers
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const caregiver = currentCaregiver;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      <DashboardNav />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          leftIcon={<ArrowLeft className="w-5 h-5" />}
          className="mb-6"
        >
          Back
        </Button>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 overflow-hidden mb-6"
        >
          {/* Cover Image */}
          <div className="h-48 bg-primary-500 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-dark-900 bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center overflow-hidden">
                <User className="w-16 h-16 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
              <div className="mb-4 lg:mb-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-dark-900 dark:text-white">
                    Caregiver Profile
                  </h1>
                  {caregiver.backgroundCheckStatus === DocumentStatus.VERIFIED && (
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                {caregiver.experience && (
                  <p className="text-dark-600 dark:text-dark-400 mb-2">
                    {caregiver.experience}
                  </p>
                )}
                {caregiver.rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-lg font-semibold text-dark-900 dark:text-white">
                        {caregiver.rating.toFixed(1)}
                      </span>
                    </div>
                    {caregiver.totalReviews && (
                      <span className="text-dark-600 dark:text-dark-400">
                        ({caregiver.totalReviews} reviews)
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={handleMessage}
                  leftIcon={<MessageSquare className="w-5 h-5" />}
                  disabled={isCreatingConversation}
                >
                  {isCreatingConversation ? 'Starting...' : 'Message'}
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setShowBookingModal(true)}
                  leftIcon={<Calendar className="w-5 h-5" />}
                >
                  Book Now
                </Button>
              </div>
            </div>

            {/* Bio */}
            {caregiver.bio && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-2">
                  About
                </h3>
                <p className="text-dark-700 dark:text-dark-300">
                  {caregiver.bio}
                </p>
              </div>
            )}

            {/* Quick Stats */}
            {caregiver.hourlyRate && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-dark-50 dark:bg-dark-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-dark-600 dark:text-dark-400">Hourly Rate</p>
                      <p className="text-lg font-bold text-dark-900 dark:text-white">
                        KES {caregiver.hourlyRate}
                      </p>
                    </div>
                  </div>
                </div>
                {caregiver.totalReviews && (
                  <div className="p-4 bg-dark-50 dark:bg-dark-800 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <Star className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-dark-600 dark:text-dark-400">Reviews</p>
                        <p className="text-lg font-bold text-dark-900 dark:text-white">
                          {caregiver.totalReviews}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills */}
            {Array.isArray(caregiver.skills) && caregiver.skills.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 p-6"
              >
                <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
                  Skills & Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {caregiver.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-2 rounded-lg text-sm font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Certifications */}
            {Array.isArray(caregiver.certifications) && caregiver.certifications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 p-6"
              >
                <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Certifications
                </h3>
                <div className="space-y-3">
                  {caregiver.certifications.map((cert, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-dark-50 dark:bg-dark-800 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-dark-900 dark:text-white">{cert}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Availability */}
            {caregiver.availability && caregiver.availability.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 p-6"
              >
                <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
                  Availability
                </h3>
                <p className="text-dark-700 dark:text-dark-300">
                  Available for immediate bookings
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-dark-900 rounded-2xl max-w-lg w-full p-6"
          >
            <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-4">
              Book This Caregiver
            </h3>

            <div className="space-y-4">
              {/* Select Elderly */}
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Select Care Recipient *
                </label>
                <select
                  value={selectedElderly}
                  onChange={(e) => setSelectedElderly(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Choose an elderly person</option>
                  {elderlyList.map((elderly) => (
                    <option key={elderly.id} value={elderly.id}>
                      {elderly.firstName} {elderly.lastName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Service Type *
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value as ServiceCategory)}
                  className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value={ServiceCategory.COMPANIONSHIP}>Companionship</option>
                  <option value={ServiceCategory.HOME_CHECK_IN}>Home Check-in</option>
                  <option value={ServiceCategory.CLEANING}>Cleaning</option>
                  <option value={ServiceCategory.ERRANDS}>Errands</option>
                  <option value={ServiceCategory.HEALTH_MONITORING}>Health Monitoring</option>
                  <option value={ServiceCategory.EMERGENCY_RESPONSE}>Emergency Response</option>
                </select>
              </div>

              {/* Date & Time */}
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Duration (hours) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={bookingHours}
                  onChange={(e) => setBookingHours(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Special Instructions
                </label>
                <textarea
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Any special requirements or notes..."
                />
              </div>

              {/* Total */}
              {caregiver.hourlyRate && bookingHours && (
                <div className="p-4 bg-primary-50 dark:bg-primary-900/10 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-dark-700 dark:text-dark-300">Total Cost:</span>
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      KES {(caregiver.hourlyRate * Number(bookingHours)).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <Button
                variant="ghost"
                onClick={() => setShowBookingModal(false)}
                disabled={isCreatingBooking}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleBooking}
                disabled={isCreatingBooking}
                className="flex-1"
              >
                {isCreatingBooking ? 'Creating...' : 'Confirm Booking'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default function CaregiverProfilePage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.FAMILY_USER]}>
      <CaregiverProfileContent />
    </ProtectedRoute>
  );
}
