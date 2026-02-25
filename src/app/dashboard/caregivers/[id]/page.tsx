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
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole, DocumentStatus, ServiceCategory, ConversationType } from '@/types/models';
import toast from 'react-hot-toast';
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
  Shield,
  Briefcase,
  X,
  TrendingUp,
  Users,
  Sparkles,
  Wallet,
  AlertCircle,
} from 'lucide-react';

function CaregiverProfileContent() {
  const router = useRouter();
  const params = useParams();
  const caregiverId = params.id as string;
  const { currentCaregiver, isLoading, getCaregiverById } = useCaregiver();
  const { elderlyList, fetchElderlyList } = useElderly();
  const { createBooking, isLoading: isCreatingBooking } = useBookings();
  const { createConversation } = useMessaging();
  const { services, fetchServices, getServiceByCategory, isLoading: servicesLoading } = useServices();
  const { wallet, fetchWallet, isLoading: walletLoading } = useWalletStore();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedElderly, setSelectedElderly] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingDuration, setBookingDuration] = useState('240'); // Default 4 hours in minutes
  const [serviceType, setServiceType] = useState<ServiceCategory>(ServiceCategory.COMPANIONSHIP);
  const [bookingNotes, setBookingNotes] = useState('');
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);

  useEffect(() => {
    if (caregiverId) {
      getCaregiverById(caregiverId);
      fetchElderlyList();
      fetchServices();
      fetchWallet(); // Fetch wallet balance
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
    const baseAmount = Number(service.basePrice);
    const hourlyAmount = Number(service.pricePerHour) * hours;
    return baseAmount + hourlyAmount;
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

      // Ensure services are loaded
      if (!Array.isArray(services) || services.length === 0) {
        toast.error('Service types are still loading. Please try again in a moment.');
        return;
      }

      const service = getServiceByCategory(serviceType);
      if (!service) {
        toast.error('Service type not found. Please try again.');
        return;
      }

      // Check wallet balance
      const bookingCost = calculateBookingCost();
      const walletBalance = Number(wallet?.balance || 0);

      if (walletBalance < bookingCost) {
        toast.error(
          `Insufficient balance: KES ${(bookingCost - walletBalance).toLocaleString()} needed. Please top up your wallet.`,
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

      toast.success('Booking created and paid successfully!', {
        icon: '✅',
      });
      setShowBookingModal(false);

      setSelectedElderly('');
      setBookingDate('');
      setBookingTime('');
      setBookingDuration('240');
      setServiceType(ServiceCategory.COMPANIONSHIP);
      setBookingNotes('');

      // Refresh wallet balance
      fetchWallet();

      setTimeout(() => {
        router.push('/dashboard/bookings');
      }, 500);
    } catch (error: any) {
      console.error('Failed to create booking:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to create booking. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950">
        <DashboardNav />
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (!currentCaregiver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950">
        <DashboardNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-dark-900 rounded-3xl border border-dark-100 dark:border-dark-800 p-12 text-center shadow-lg">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950">
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            leftIcon={<ArrowLeft className="w-5 h-5" />}
            className="mb-6 hover:bg-white dark:hover:bg-dark-800"
          >
            Back
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-dark-900 rounded-3xl border border-dark-100 dark:border-dark-800 overflow-hidden shadow-xl sticky top-8">
              {/* Header with Gradient */}
              <div className="h-32 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 relative">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                {caregiver.backgroundCheckStatus === DocumentStatus.VERIFIED && (
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">
                      <Shield className="w-4 h-4 text-white" />
                      <span className="text-xs font-semibold text-white">Verified</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Image */}
              <div className="relative px-6 pb-6">
                <div className="flex justify-center -mt-16 mb-4">
                  <div className="w-32 h-32 rounded-full border-4 border-white dark:border-dark-900 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/20 dark:to-accent-900/20 flex items-center justify-center overflow-hidden shadow-2xl">
                    <User className="w-16 h-16 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>

                {/* Name & Title */}
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-1">
                    Professional Caregiver
                  </h1>
                  {caregiver.experience && (
                    <p className="text-dark-600 dark:text-dark-400 text-sm flex items-center justify-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {caregiver.experience}
                    </p>
                  )}
                </div>

                {/* Rating */}
                {caregiver.rating && (
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 px-4 py-2 rounded-full border border-yellow-200 dark:border-yellow-800">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-lg font-bold text-dark-900 dark:text-white">
                        {caregiver.rating.toFixed(1)}
                      </span>
                      {caregiver.totalReviews && (
                        <span className="text-sm text-dark-600 dark:text-dark-400">
                          ({caregiver.totalReviews})
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {caregiver.hourlyRate && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-4 border border-green-200 dark:border-green-800">
                      <div className="flex flex-col items-center">
                        <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
                        <p className="text-xs text-dark-600 dark:text-dark-400 mb-1">Hourly Rate</p>
                        <p className="text-xl font-bold text-dark-900 dark:text-white">
                          KES {caregiver.hourlyRate}
                        </p>
                      </div>
                    </div>
                  )}
                  {caregiver.totalReviews && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-800">
                      <div className="flex flex-col items-center">
                        <Users className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                        <p className="text-xs text-dark-600 dark:text-dark-400 mb-1">Reviews</p>
                        <p className="text-xl font-bold text-dark-900 dark:text-white">
                          {caregiver.totalReviews}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    onClick={() => setShowBookingModal(true)}
                    leftIcon={<Calendar className="w-5 h-5" />}
                    className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/30"
                  >
                    Book Now
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleMessage}
                    leftIcon={<MessageSquare className="w-5 h-5" />}
                    disabled={isCreatingConversation}
                    className="w-full"
                  >
                    {isCreatingConversation ? 'Starting...' : 'Send Message'}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            {caregiver.bio && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-dark-900 rounded-3xl border border-dark-100 dark:border-dark-800 p-8 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/20 dark:to-accent-900/20 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-dark-900 dark:text-white">About Me</h2>
                </div>
                <p className="text-dark-700 dark:text-dark-300 leading-relaxed">
                  {caregiver.bio}
                </p>
              </motion.div>
            )}

            {/* Skills */}
            {Array.isArray(caregiver.skills) && caregiver.skills.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-dark-900 rounded-3xl border border-dark-100 dark:border-dark-800 p-8 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-dark-900 dark:text-white">Skills & Expertise</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {caregiver.skills.map((skill, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                      className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 dark:from-primary-900/20 dark:to-accent-900/20 dark:text-primary-400 border border-primary-200 dark:border-primary-800 hover:scale-105 transition-transform"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Certifications */}
            {Array.isArray(caregiver.certifications) && caregiver.certifications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-dark-900 rounded-3xl border border-dark-100 dark:border-dark-800 p-8 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-dark-900 dark:text-white">Certifications</h2>
                </div>
                <div className="space-y-3">
                  {caregiver.certifications.map((cert, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-2xl border border-green-200 dark:border-green-800 hover:shadow-md transition-shadow"
                    >
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-dark-900 dark:text-white">{cert}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Availability */}
            {caregiver.availability && caregiver.availability.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl border border-blue-200 dark:border-blue-800 p-8 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-dark-900 dark:text-white">Availability</h2>
                </div>
                <p className="text-dark-700 dark:text-dark-300 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Available for immediate bookings
                </p>
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
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-dark-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-dark-100 dark:border-dark-800"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-primary-500 to-accent-500 p-6 rounded-t-3xl border-b border-primary-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Book This Caregiver</h3>
                      <p className="text-primary-100 text-sm">Schedule a care session</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-5">
                {/* Select Elderly */}
                <div>
                  <label className="block text-sm font-semibold text-dark-900 dark:text-white mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-primary-500" />
                    Care Recipient *
                  </label>
                  <select
                    value={selectedElderly}
                    onChange={(e) => setSelectedElderly(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  >
                    <option value="">Choose an elderly person</option>
                    {elderlyList.map((elderly) => (
                      <option key={elderly.id} value={elderly.id}>
                        {elderly.fullName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Service Type */}
                <div>
                  <label className="block text-sm font-semibold text-dark-900 dark:text-white mb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary-500" />
                    Service Type *
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value as ServiceCategory)}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  >
                    <option value={ServiceCategory.COMPANIONSHIP}>Companionship</option>
                    <option value={ServiceCategory.HOME_CHECK_IN}>Home Check-in</option>
                    <option value={ServiceCategory.CLEANING}>Cleaning</option>
                    <option value={ServiceCategory.ERRANDS}>Errands</option>
                    <option value={ServiceCategory.HEALTH_MONITORING}>Health Monitoring</option>
                    <option value={ServiceCategory.EMERGENCY_RESPONSE}>Emergency Response</option>
                  </select>
                </div>

                {/* Date & Time Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark-900 dark:text-white mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary-500" />
                      Date *
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark-900 dark:text-white mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary-500" />
                      Time *
                    </label>
                    <input
                      type="time"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-semibold text-dark-900 dark:text-white mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary-500" />
                    Duration *
                  </label>
                  <select
                    value={bookingDuration}
                    onChange={(e) => setBookingDuration(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  >
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                    <option value="180">3 hours</option>
                    <option value="240">4 hours</option>
                    <option value="300">5 hours</option>
                    <option value="360">6 hours</option>
                    <option value="420">7 hours</option>
                    <option value="480">8 hours</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-dark-900 dark:text-white mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                    placeholder="Any special requirements or notes..."
                  />
                </div>

                {/* Wallet Balance */}
                {wallet && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-5 rounded-2xl border-2 ${
                      Number(wallet.balance) >= calculateBookingCost()
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Wallet className={`w-5 h-5 ${
                          Number(wallet.balance) >= calculateBookingCost()
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-orange-600 dark:text-orange-400'
                        }`} />
                        <span className="text-sm font-semibold text-dark-700 dark:text-dark-300">
                          Wallet Balance
                        </span>
                      </div>
                      <button
                        onClick={() => router.push('/dashboard/wallet')}
                        className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        Top Up
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-dark-900 dark:text-white">
                        KES {Number(wallet.balance).toLocaleString()}
                      </span>
                      {Number(wallet.balance) < calculateBookingCost() && (
                        <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-xs font-semibold">Insufficient</span>
                        </div>
                      )}
                      {Number(wallet.balance) >= calculateBookingCost() && (
                        <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs font-semibold">Sufficient</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Total Cost */}
                {caregiver.hourlyRate && bookingDuration && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-2xl border-2 border-primary-200 dark:border-primary-800"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-dark-600 dark:text-dark-400 mb-1">Estimated Total</p>
                        <p className="text-xs text-dark-500 dark:text-dark-500">
                          Based on {(Number(bookingDuration) / 60).toFixed(1)} hours
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                          KES {(caregiver.hourlyRate * (Number(bookingDuration) / 60)).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-dark-100 dark:border-dark-800 bg-dark-50/50 dark:bg-dark-800/50 rounded-b-3xl">
                <div className="flex gap-4">
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
                    disabled={isCreatingBooking || servicesLoading}
                    leftIcon={<Calendar className="w-5 h-5" />}
                    className="flex-1 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 shadow-lg shadow-primary-500/30"
                  >
                    {isCreatingBooking ? 'Creating...' : servicesLoading ? 'Loading...' : 'Confirm Booking'}
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
