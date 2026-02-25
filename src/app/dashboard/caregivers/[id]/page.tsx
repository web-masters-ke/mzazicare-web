"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth';
import { DashboardNav } from '@/components/layout/DashboardNav';
import { useCaregiver } from '@/hooks/useCaregiver';
import { useElderly } from '@/hooks/useElderly';
import { useBookings } from '@/hooks/useBookings';
import { useMessaging } from '@/hooks/useMessaging';
import { useServices } from '@/hooks/useServices';
import { useWalletStore } from '@/stores/wallet.store';
import { Button, Badge, Spinner } from '@/components/ui';
import { AvailabilityCalendar } from '@/components/ui/AvailabilityCalendar';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole, DocumentStatus, ServiceCategory, ConversationType } from '@/types/models';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  User,
  Star,
  DollarSign,
  Calendar,
  Clock,
  MessageSquare,
  Shield,
  Briefcase,
  X,
  CheckCircle,
  AlertCircle,
  Zap,
  TrendingUp,
  Award,
  MapPin,
  ChevronRight,
} from 'lucide-react';

function CaregiverProfileContent() {
  const router = useRouter();
  const params = useParams();
  const caregiverId = params.id as string;
  const { currentCaregiver, isLoading, getCaregiverById } = useCaregiver();
  const { elderlyList, fetchElderlyList } = useElderly();
  const { createBooking, isLoading: isCreatingBooking } = useBookings();
  const { createConversation } = useMessaging();
  const { services, fetchServices, getServiceByCategory } = useServices();
  const { wallet, fetchWallet } = useWalletStore();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedElderly, setSelectedElderly] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingDuration, setBookingDuration] = useState('240');
  const [serviceType, setServiceType] = useState<ServiceCategory>(ServiceCategory.COMPANIONSHIP);
  const [bookingNotes, setBookingNotes] = useState('');
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);

  useEffect(() => {
    if (caregiverId) {
      getCaregiverById(caregiverId);
      fetchElderlyList();
      fetchServices();
      fetchWallet();
    }
  }, [caregiverId]);

  const handleMessage = async () => {
    if (!currentCaregiver) return;

    setIsCreatingConversation(true);
    try {
      const conversation = await createConversation({
        participantIds: [currentCaregiver.userId],
        type: ConversationType.DIRECT,
      });
      router.push(`/dashboard/messages?conversation=${conversation.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to start conversation');
    } finally {
      setIsCreatingConversation(false);
    }
  };

  const calculateBookingCost = () => {
    const service = getServiceByCategory(serviceType);
    if (!service) return 0;

    const hours = Number(bookingDuration) / 60;
    let hourlyRate = Number(service.pricePerHour);

    // Use caregiver's specific hourly rate if available
    if (currentCaregiver?.skills && Array.isArray(currentCaregiver.skills)) {
      const caregiverSkill = currentCaregiver.skills.find((skill: any) => {
        const skillCategory = typeof skill === 'string' ? skill : skill.category;
        return skillCategory === serviceType;
      }) as any;

      if (caregiverSkill && typeof caregiverSkill === 'object' && caregiverSkill.hourlyRate) {
        hourlyRate = Number(caregiverSkill.hourlyRate);
      }
    }

    // Total = Hourly Rate × Hours (no base price)
    const total = hourlyRate * hours;

    console.log('[Booking Cost] Service:', serviceType);
    console.log('[Booking Cost] Hourly Rate:', hourlyRate);
    console.log('[Booking Cost] Duration (hours):', hours);
    console.log('[Booking Cost] TOTAL:', total);
    console.log('[Booking Cost] Formula: Rate(' + hourlyRate + ') × Hours(' + hours + ') = ' + total);

    return total;
  };

  const handleBooking = async () => {
    if (!selectedElderly || !bookingDate || !bookingTime || !bookingDuration) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const selectedElderlyProfile = elderlyList.find(e => e.id === selectedElderly);
      if (!selectedElderlyProfile) {
        toast.error('Selected elderly profile not found');
        return;
      }

      const service = getServiceByCategory(serviceType);
      if (!service) {
        toast.error('Service type not found');
        return;
      }

      const bookingCost = calculateBookingCost();
      const walletBalance = Number(wallet?.balance || 0);

      if (walletBalance < bookingCost) {
        toast.error(
          `Insufficient balance: KES ${(bookingCost - walletBalance).toLocaleString()} needed`,
          { duration: 5000 }
        );
        return;
      }

      await createBooking({
        elderlyId: selectedElderly,
        serviceTypeId: service.id,
        scheduledDate: new Date(bookingDate).toISOString(),
        scheduledTime: bookingTime,
        duration: Number(bookingDuration),
        address: selectedElderlyProfile.address,
        latitude: selectedElderlyProfile.latitude,
        longitude: selectedElderlyProfile.longitude,
        notes: bookingNotes || undefined,
        caregiverId: caregiverId,
        assignmentMode: 'DIRECT_ASSIGN',
        escrowReleaseMode: 'AUTO_RELEASE',
      });

      toast.success('Booking created successfully!', { icon: '✅' });
      setShowBookingModal(false);
      fetchWallet();

      setTimeout(() => {
        router.push('/dashboard/bookings');
      }, 500);
    } catch (error: any) {
      console.error('Failed to create booking:', error);
      toast.error(error.response?.data?.message || 'Failed to create booking');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-950">
        <DashboardNav />
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (!currentCaregiver) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-950">
        <DashboardNav />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="text-center">
            <User className="w-16 h-16 text-dark-300 dark:text-dark-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-dark-900 dark:text-white mb-2">
              Caregiver not found
            </h3>
            <Button onClick={() => router.push('/dashboard/caregivers')}>
              Back to Caregivers
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const caregiver = currentCaregiver;
  const skillsArray = Array.isArray(caregiver.skills) ? caregiver.skills : [];

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950">
      <DashboardNav />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="mb-4"
          size="sm"
        >
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Profile Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 p-6 sticky top-6"
            >
              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 p-0.5">
                    <div className="w-full h-full rounded-full bg-white dark:bg-dark-900 flex items-center justify-center overflow-hidden">
                      {caregiver.profilePhoto ? (
                        <img src={caregiver.profilePhoto} alt={caregiver.fullName || ''} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-12 h-12 text-dark-400" />
                      )}
                    </div>
                  </div>
                  {caregiver.verificationStatus === 'APPROVED' && (
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-dark-900">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <h1 className="text-xl font-bold text-dark-900 dark:text-white text-center mb-1">
                  {caregiver.fullName || 'Professional Caregiver'}
                </h1>

                {/* Rating */}
                {(caregiver.rating ?? 0) > 0 && (
                  <div className="flex items-center gap-1.5 mb-4">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-dark-900 dark:text-white">
                      {caregiver.rating?.toFixed(1)}
                    </span>
                    <span className="text-xs text-dark-500">
                      ({caregiver.totalReviews ?? 0} reviews)
                    </span>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 w-full mb-6">
                  <div className="text-center p-3 bg-dark-50 dark:bg-dark-800 rounded-xl">
                    <div className="text-2xl font-bold text-dark-900 dark:text-white">
                      {caregiver.completedJobs}
                    </div>
                    <div className="text-xs text-dark-600 dark:text-dark-400">
                      Jobs Done
                    </div>
                  </div>
                  <div className="text-center p-3 bg-dark-50 dark:bg-dark-800 rounded-xl">
                    <div className="text-2xl font-bold text-dark-900 dark:text-white">
                      {skillsArray.length}
                    </div>
                    <div className="text-xs text-dark-600 dark:text-dark-400">
                      Services
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="w-full space-y-2">
                  <Button
                    variant="primary"
                    onClick={() => setShowBookingModal(true)}
                    leftIcon={<Calendar className="w-4 h-4" />}
                    className="w-full"
                    size="md"
                  >
                    Book Now
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleMessage}
                    leftIcon={<MessageSquare className="w-4 h-4" />}
                    disabled={isCreatingConversation}
                    className="w-full"
                    size="md"
                  >
                    Message
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-2 space-y-4">
            {/* Bio */}
            {caregiver.bio && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 p-6"
              >
                <h2 className="text-sm font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wide mb-3">
                  About
                </h2>
                <p className="text-dark-700 dark:text-dark-300 leading-relaxed text-sm">
                  {caregiver.bio}
                </p>
              </motion.div>
            )}

            {/* Services & Rates */}
            {skillsArray.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 p-6"
              >
                <h2 className="text-sm font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wide mb-4">
                  Services & Rates
                </h2>
                <div className="space-y-3">
                  {skillsArray.map((skill: any, idx: number) => {
                    const skillName = typeof skill === 'string' ? skill : skill.category;
                    const hourlyRate = typeof skill === 'object' && skill.hourlyRate ? Number(skill.hourlyRate) : null;
                    const experience = typeof skill === 'object' && skill.experience ? skill.experience : null;

                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                        className="flex items-center justify-between p-3 bg-dark-50 dark:bg-dark-800 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                            <Briefcase className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-dark-900 dark:text-white">
                              {skillName.replace(/_/g, ' ')}
                            </div>
                            {experience !== null && experience > 0 && (
                              <div className="text-xs text-dark-600 dark:text-dark-400">
                                {experience} {experience === 1 ? 'year' : 'years'} exp.
                              </div>
                            )}
                          </div>
                        </div>
                        {hourlyRate && (
                          <div className="flex items-center gap-1 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <DollarSign className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                            <span className="text-sm font-bold text-green-700 dark:text-green-300">
                              {hourlyRate}/hr
                            </span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Availability Calendar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 p-6"
            >
              <h2 className="text-sm font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wide mb-4">
                Availability Schedule
              </h2>
              <AvailabilityCalendar
                caregiverId={caregiverId}
                duration={120} // Default 2 hours for viewing
                onSlotSelect={(date, time, duration) => {
                  // When user selects a slot, open booking modal with that time
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const day = String(date.getDate()).padStart(2, '0');
                  setBookingDate(`${year}-${month}-${day}`);
                  setBookingTime(time);
                  setShowBookingModal(true);
                }}
              />
            </motion.div>

            {/* Reviews */}
            {caregiver.recentReviews && caregiver.recentReviews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 p-6"
              >
                <h2 className="text-sm font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wide mb-4">
                  Recent Reviews
                </h2>
                <div className="space-y-4">
                  {caregiver.recentReviews.map((review: any, idx: number) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                      className="p-4 bg-dark-50 dark:bg-dark-800 rounded-xl"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {review.reviewer?.[0] || 'U'}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-dark-900 dark:text-white">
                              {review.reviewer || 'Anonymous'}
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-dark-300 dark:text-dark-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-dark-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-dark-700 dark:text-dark-300">
                          {review.comment}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-dark-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-dark-100 dark:border-dark-800"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white dark:bg-dark-900 border-b border-dark-100 dark:border-dark-800 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-dark-900 dark:text-white">Book Caregiver</h3>
                    <p className="text-xs text-dark-600 dark:text-dark-400">Schedule a care session</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="w-8 h-8 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-dark-600 dark:text-dark-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Elderly */}
                <div>
                  <label className="block text-sm font-medium text-dark-900 dark:text-white mb-2">
                    Care Recipient *
                  </label>
                  <select
                    value={selectedElderly}
                    onChange={(e) => setSelectedElderly(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select person</option>
                    {elderlyList.map((elderly) => (
                      <option key={elderly.id} value={elderly.id}>
                        {elderly.fullName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Service */}
                <div>
                  <label className="block text-sm font-medium text-dark-900 dark:text-white mb-2">
                    Service *
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value as ServiceCategory)}
                    className="w-full px-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value={ServiceCategory.COMPANIONSHIP}>Companionship</option>
                    <option value={ServiceCategory.HOME_CHECK_IN}>Home Check-in</option>
                    <option value={ServiceCategory.CLEANING}>Cleaning</option>
                    <option value={ServiceCategory.ERRANDS}>Errands</option>
                    <option value={ServiceCategory.HEALTH_MONITORING}>Health Monitoring</option>
                    <option value={ServiceCategory.EMERGENCY_RESPONSE}>Emergency Response</option>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-dark-900 dark:text-white mb-2">
                    Duration *
                  </label>
                  <select
                    value={bookingDuration}
                    onChange={(e) => setBookingDuration(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="30">30 min</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                    <option value="180">3 hours</option>
                    <option value="240">4 hours</option>
                    <option value="300">5 hours</option>
                    <option value="360">6 hours</option>
                    <option value="480">8 hours</option>
                  </select>
                </div>

                {/* Availability Calendar */}
                <div>
                  <AvailabilityCalendar
                    caregiverId={caregiverId}
                    duration={Number(bookingDuration)}
                    selectedDate={bookingDate ? new Date(bookingDate) : undefined}
                    selectedTime={bookingTime}
                    onSlotSelect={(date, time, duration) => {
                      // Format date as YYYY-MM-DD
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const day = String(date.getDate()).padStart(2, '0');
                      setBookingDate(`${year}-${month}-${day}`);
                      setBookingTime(time);
                    }}
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-dark-900 dark:text-white mb-2">
                    Notes
                  </label>
                  <textarea
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    placeholder="Special instructions..."
                  />
                </div>

                {/* Total */}
                <div className="p-4 bg-dark-50 dark:bg-dark-800 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-dark-600 dark:text-dark-400">
                      Estimated Total
                    </span>
                    <span className="text-2xl font-bold text-dark-900 dark:text-white">
                      KES {calculateBookingCost().toLocaleString()}
                    </span>
                  </div>
                  {wallet && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-dark-500">Wallet: KES {Number(wallet.balance).toLocaleString()}</span>
                      {Number(wallet.balance) >= calculateBookingCost() ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-3 h-3" />
                          Sufficient
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-orange-600">
                          <AlertCircle className="w-3 h-3" />
                          Insufficient
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white dark:bg-dark-900 border-t border-dark-100 dark:border-dark-800 p-6">
                <div className="flex gap-3">
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
                    leftIcon={isCreatingBooking ? <Spinner size="sm" /> : <Calendar className="w-4 h-4" />}
                    className="flex-1"
                  >
                    {isCreatingBooking ? 'Booking...' : 'Confirm Booking'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
