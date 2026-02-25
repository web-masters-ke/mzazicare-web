/**
 * useBookings Hook
 * Custom React hook for booking management
 */

import { useEffect } from 'react';
import type { BookingState } from '@/stores/booking.store';
import { useBookingStore } from '@/stores/booking.store';
import { BookingStatus, CreateBookingRequest } from '@/types/models';

export function useBookings(autoLoad: boolean = false, status?: BookingStatus) {
  // Use individual selectors to avoid re-render issues
  const bookings = useBookingStore((state) => state.bookings);
  const currentBooking = useBookingStore((state) => state.currentBooking);
  const isLoading = useBookingStore((state) => state.isLoading);
  const error = useBookingStore((state) => state.error);
  const pagination = useBookingStore((state) => state.pagination);
  const fetchBookings = useBookingStore((state) => state.fetchBookings);
  const fetchBookingById = useBookingStore((state) => state.fetchBookingById);
  const createBooking = useBookingStore((state) => state.createBooking);
  const cancelBooking = useBookingStore((state) => state.cancelBooking);
  const rescheduleBooking = useBookingStore((state) => state.rescheduleBooking);
  const assignCaregiver = useBookingStore((state) => state.assignCaregiver);
  const acceptBooking = useBookingStore((state) => state.acceptBooking);
  const declineBooking = useBookingStore((state) => state.declineBooking);
  const clearError = useBookingStore((state) => state.clearError);
  const reset = useBookingStore((state) => state.reset);

  // Auto-load bookings on mount if enabled
  useEffect(() => {
    if (autoLoad) {
      fetchBookings(status);
    }
  }, [autoLoad, status]);

  // Helper: Get bookings by status
  const getBookingsByStatus = (filterStatus: BookingStatus) => {
    return bookings.filter((booking) => booking.status === filterStatus);
  };

  // Helper: Get upcoming bookings
  const upcomingBookings = getBookingsByStatus(BookingStatus.CONFIRMED);

  // Helper: Get completed bookings
  const completedBookings = getBookingsByStatus(BookingStatus.COMPLETED);

  // Helper: Get cancelled bookings
  const cancelledBookings = getBookingsByStatus(BookingStatus.CANCELLED);

  return {
    // State
    bookings,
    currentBooking,
    isLoading,
    error,
    pagination,

    // Filtered lists
    upcomingBookings,
    completedBookings,
    cancelledBookings,

    // Actions
    fetchBookings,
    fetchBookingById,
    createBooking,
    cancelBooking,
    rescheduleBooking,
    assignCaregiver,
    acceptBooking,
    declineBooking,
    getBookingsByStatus,
    clearError,
    reset,
  };
}
