/**
 * Booking Store
 * Zustand store for booking state
 * Mirrors mobile app's BookingNotifier (Riverpod)
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { bookingRepository } from '@/repositories/booking.repository';
import {
  Booking,
  CreateBookingRequest,
  BookingStatus,
  PaginationMeta,
} from '@/types/models';

// State interface
export interface BookingState {
  // State
  bookings: Booking[];
  currentBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;

  // Actions
  fetchBookings: (status?: BookingStatus, page?: number) => Promise<void>;
  fetchBookingById: (id: string) => Promise<void>;
  createBooking: (data: CreateBookingRequest) => Promise<Booking>;
  cancelBooking: (id: string, reason: string) => Promise<void>;
  rescheduleBooking: (
    id: string,
    scheduledDate: string,
    scheduledTime: string
  ) => Promise<void>;
  assignCaregiver: (bookingId: string, caregiverId: string) => Promise<void>;
  acceptBooking: (bookingId: string) => Promise<void>;
  declineBooking: (bookingId: string, reason: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useBookingStore = create<BookingState>()(
  devtools(
    (set, get) => ({
      // Initial State
      bookings: [],
      currentBooking: null,
      isLoading: false,
      error: null,
      pagination: null,

      // Fetch bookings
      fetchBookings: async (status?: BookingStatus, page: number = 1) => {
        set({ isLoading: true, error: null });

        try {
          const response = await bookingRepository.getFamilyBookings(
            status,
            page,
            10
          );

          set({
            bookings: response.data,
            pagination: response.pagination,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to fetch bookings',
          });
        }
      },

      // Fetch booking by ID
      fetchBookingById: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          const booking = await bookingRepository.getFamilyBookingById(id);
          set({
            currentBooking: booking,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to fetch booking',
          });
        }
      },

      // Create booking
      createBooking: async (data: CreateBookingRequest) => {
        set({ isLoading: true, error: null });

        try {
          const booking = await bookingRepository.createBooking(data);

          // Add to bookings list
          set((state) => ({
            bookings: [booking, ...state.bookings],
            isLoading: false,
          }));

          return booking;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to create booking',
          });
          throw error;
        }
      },

      // Cancel booking
      cancelBooking: async (id: string, reason: string) => {
        set({ isLoading: true, error: null });

        try {
          const updatedBooking = await bookingRepository.cancelBooking(
            id,
            reason
          );

          // Update in bookings list
          set((state) => ({
            bookings: state.bookings.map((b) =>
              b.id === id ? updatedBooking : b
            ),
            currentBooking:
              state.currentBooking?.id === id
                ? updatedBooking
                : state.currentBooking,
            isLoading: false,
          }));
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to cancel booking',
          });
          throw error;
        }
      },

      // Reschedule booking
      rescheduleBooking: async (
        id: string,
        scheduledDate: string,
        scheduledTime: string
      ) => {
        set({ isLoading: true, error: null });

        try {
          const updatedBooking = await bookingRepository.rescheduleBooking(id, {
            scheduledDate,
            scheduledTime,
          });

          // Update in bookings list
          set((state) => ({
            bookings: state.bookings.map((b) =>
              b.id === id ? updatedBooking : b
            ),
            currentBooking:
              state.currentBooking?.id === id
                ? updatedBooking
                : state.currentBooking,
            isLoading: false,
          }));
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to reschedule booking',
          });
          throw error;
        }
      },

      // Assign caregiver
      assignCaregiver: async (bookingId: string, caregiverId: string) => {
        set({ isLoading: true, error: null });

        try {
          const updatedBooking = await bookingRepository.assignCaregiver(
            bookingId,
            caregiverId
          );

          // Update in bookings list
          set((state) => ({
            bookings: state.bookings.map((b) =>
              b.id === bookingId ? updatedBooking : b
            ),
            currentBooking:
              state.currentBooking?.id === bookingId
                ? updatedBooking
                : state.currentBooking,
            isLoading: false,
          }));
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to assign caregiver',
          });
          throw error;
        }
      },

      // Accept booking (caregiver)
      acceptBooking: async (bookingId: string) => {
        set({ isLoading: true, error: null });

        try {
          const updatedBooking = await bookingRepository.acceptBooking(bookingId);

          // Remove from bookings list (no longer pending)
          set((state) => ({
            bookings: state.bookings.filter((b) => b.id !== bookingId),
            currentBooking:
              state.currentBooking?.id === bookingId
                ? updatedBooking
                : state.currentBooking,
            isLoading: false,
          }));
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to accept booking',
          });
          throw error;
        }
      },

      // Decline booking (caregiver)
      declineBooking: async (bookingId: string, reason: string) => {
        set({ isLoading: true, error: null });

        try {
          const updatedBooking = await bookingRepository.declineBooking(bookingId, reason);

          // Remove from bookings list (no longer pending)
          set((state) => ({
            bookings: state.bookings.filter((b) => b.id !== bookingId),
            currentBooking:
              state.currentBooking?.id === bookingId
                ? updatedBooking
                : state.currentBooking,
            isLoading: false,
          }));
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to decline booking',
          });
          throw error;
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Reset state
      reset: () => {
        set({
          bookings: [],
          currentBooking: null,
          isLoading: false,
          error: null,
          pagination: null,
        });
      },
    }),
    { name: 'BookingStore' }
  )
);
