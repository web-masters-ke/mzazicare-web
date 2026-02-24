"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth';
import { BottomNav } from '@/components/layout/BottomNav';
import { useAuth } from '@/hooks/useAuth';
import { useBookings } from '@/hooks/useBookings';
import { Button, Spinner } from '@/components/ui';
import { motion } from 'framer-motion';
import { BookingStatus, UserRole } from '@/types/models';
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

function BookingsContent() {
  const router = useRouter();
  const { userRole } = useAuth();
  const {
    bookings,
    isLoading,
    fetchBookings,
    upcomingBookings,
    completedBookings,
    getBookingsByStatus,
  } = useBookings();

  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const statusOptions = [
    { value: 'all', label: 'All', count: bookings.length },
    { value: BookingStatus.CONFIRMED, label: 'Upcoming', count: upcomingBookings.length },
    { value: BookingStatus.IN_PROGRESS, label: 'Active', count: getBookingsByStatus(BookingStatus.IN_PROGRESS).length },
    { value: BookingStatus.COMPLETED, label: 'Done', count: completedBookings.length },
  ];

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = selectedStatus === 'all' || booking.status === selectedStatus;
    const matchesSearch =
      searchQuery === '' ||
      booking.elderly?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.elderly?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.elderly?.lastName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return 'bg-blue-500';
      case BookingStatus.IN_PROGRESS:
        return 'bg-orange-500';
      case BookingStatus.COMPLETED:
        return 'bg-green-500';
      case BookingStatus.CANCELLED:
        return 'bg-gray-500';
      default:
        return 'bg-purple-500';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const formatDateTime = (dateString: string, timeString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';

    const formattedDate = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);

    if (timeString) {
      return `${formattedDate} at ${timeString}`;
    }

    return formattedDate;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">
      <div className="pb-24 pt-8 px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-1">
                My Bookings
              </h1>
              <p className="text-dark-600 dark:text-dark-400">
                {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'}
              </p>
            </div>

            {userRole === UserRole.FAMILY_USER && (
              <button
                onClick={() => router.push('/dashboard/caregivers')}
                className="w-12 h-12 rounded-2xl bg-primary-500 hover:bg-primary-600 flex items-center justify-center text-white transition-colors"
              >
                <Plus className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-dark-50 dark:bg-dark-900 border border-dark-200 dark:border-dark-800 text-dark-900 dark:text-white placeholder:text-dark-400 focus:outline-none focus:border-primary-500"
            />
          </div>

          {/* Status Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedStatus(option.value as BookingStatus | 'all')}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm transition-colors ${
                  selectedStatus === option.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-100 dark:bg-dark-900 text-dark-700 dark:text-dark-300 border border-dark-200 dark:border-dark-800'
                }`}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-dark-50 dark:bg-dark-900 rounded-2xl p-12 text-center border border-dark-100 dark:border-dark-800">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
              <Calendar className="w-10 h-10 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold text-dark-900 dark:text-white mb-2">
              No bookings found
            </h3>
            <p className="text-dark-600 dark:text-dark-400">
              {searchQuery || selectedStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Start booking caregivers'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => router.push(`/dashboard/bookings/${booking.id}`)}
                className="bg-dark-50 dark:bg-dark-900 rounded-2xl p-5 border border-dark-100 dark:border-dark-800 hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {booking.elderly?.fullName?.charAt(0) || booking.elderly?.firstName?.charAt(0) || 'E'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-dark-900 dark:text-white truncate">
                          {booking.elderly?.fullName || `${booking.elderly?.firstName || ''} ${booking.elderly?.lastName || ''}`.trim() || 'Unknown'}
                        </h3>
                        {booking.caregiver && (
                          <p className="text-sm text-dark-600 dark:text-dark-400">
                            with {booking.caregiver.user?.fullName || booking.caregiver.fullName || `${booking.caregiver.firstName || ''} ${booking.caregiver.lastName || ''}`.trim() || 'Caregiver'}
                          </p>
                        )}
                      </div>
                      <div className={`px-3 py-1 rounded-full ${getStatusColor(booking.status)} text-white text-xs font-medium`}>
                        {booking.status}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm text-dark-600 dark:text-dark-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDateTime(booking.scheduledDate, booking.scheduledTime)}
                      </div>
                      {booking.serviceType && (
                        <div className="flex items-center gap-1">
                          <Sparkles className="w-4 h-4" />
                          {booking.serviceType.name || booking.serviceType.category}
                        </div>
                      )}
                      {booking.duration && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {booking.duration} min
                        </div>
                      )}
                    </div>
                  </div>

                  <ArrowRight className="w-5 h-5 text-dark-400" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

export default function BookingsPage() {
  return (
    <ProtectedRoute>
      <BookingsContent />
    </ProtectedRoute>
  );
}
