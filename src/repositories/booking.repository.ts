/**
 * Booking Repository
 * Handles booking-related API calls
 * Mirrors mobile app's BookingRepository
 */

import { apiClient } from '@/services/api/api-client';
import { ApiEndpoints } from '@/config/api-endpoints';
import {
  Booking,
  CreateBookingRequest,
  CancelBookingRequest,
  RescheduleBookingRequest,
  AssignCaregiverRequest,
  PaginatedResponse,
  ApiResponse,
  BookingStatus,
} from '@/types/models';

export class BookingRepository {
  /**
   * Get bookings for family user
   */
  async getFamilyBookings(
    status?: BookingStatus,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Booking>> {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await apiClient.get<ApiResponse<PaginatedResponse<Booking>>>(
        `${ApiEndpoints.booking.family.list}?${params.toString()}`
      );

      return this.extractPaginatedData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get booking by ID (family user)
   */
  async getFamilyBookingById(bookingId: string): Promise<Booking> {
    try {
      const response = await apiClient.get<ApiResponse<Booking>>(
        ApiEndpoints.booking.family.byId(bookingId)
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new booking
   */
  async createBooking(data: CreateBookingRequest): Promise<Booking> {
    try {
      const response = await apiClient.post<ApiResponse<Booking>>(
        ApiEndpoints.booking.family.create,
        data
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: string, reason: string): Promise<Booking> {
    try {
      const request: CancelBookingRequest = { reason };
      const response = await apiClient.post<ApiResponse<Booking>>(
        ApiEndpoints.booking.family.cancel(bookingId),
        request
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reschedule a booking
   */
  async rescheduleBooking(
    bookingId: string,
    data: RescheduleBookingRequest
  ): Promise<Booking> {
    try {
      const response = await apiClient.post<ApiResponse<Booking>>(
        ApiEndpoints.booking.family.reschedule(bookingId),
        data
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Assign caregiver to booking
   */
  async assignCaregiver(bookingId: string, caregiverId: string): Promise<Booking> {
    try {
      const request: AssignCaregiverRequest = { caregiverId };
      const response = await apiClient.post<ApiResponse<Booking>>(
        ApiEndpoints.booking.family.assignCaregiver(bookingId),
        request
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create recurring booking
   */
  async createRecurringBooking(data: CreateBookingRequest & {
    recurrencePattern: string;
    recurrenceEndDate: string;
  }): Promise<Booking[]> {
    try {
      const response = await apiClient.post<ApiResponse<Booking[]>>(
        ApiEndpoints.booking.family.recurring,
        data
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  // ============================================
  // Caregiver Endpoints
  // ============================================

  /**
   * Get bookings for caregiver
   * Uses specific endpoints based on status
   */
  async getCaregiverBookings(
    status?: BookingStatus,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Booking>> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      // If no status specified, fetch all bookings from all endpoints
      if (!status) {
        // Fetch from all endpoints and combine
        const [pendingRes, upcomingRes, historyRes] = await Promise.allSettled([
          apiClient.get<ApiResponse<PaginatedResponse<Booking>>>(
            `${ApiEndpoints.booking.caregiver.pending}?${params.toString()}`
          ),
          apiClient.get<ApiResponse<PaginatedResponse<Booking>>>(
            `${ApiEndpoints.booking.caregiver.upcoming}?${params.toString()}`
          ),
          apiClient.get<ApiResponse<PaginatedResponse<Booking>>>(
            `${ApiEndpoints.booking.caregiver.history}?${params.toString()}`
          ),
        ]);

        // Combine all successful results
        const allBookings: Booking[] = [];

        if (pendingRes.status === 'fulfilled') {
          const pending = this.extractPaginatedData(pendingRes.value.data);
          allBookings.push(...pending.data);
        }

        if (upcomingRes.status === 'fulfilled') {
          const upcoming = this.extractPaginatedData(upcomingRes.value.data);
          allBookings.push(...upcoming.data);
        }

        if (historyRes.status === 'fulfilled') {
          const history = this.extractPaginatedData(historyRes.value.data);
          allBookings.push(...history.data);
        }

        // Return combined results
        return {
          data: allBookings,
          pagination: {
            currentPage: page,
            totalPages: 1,
            totalItems: allBookings.length,
            itemsPerPage: allBookings.length,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        };
      }

      // Determine endpoint based on status
      let endpoint: string;
      if (status === BookingStatus.PENDING) {
        endpoint = ApiEndpoints.booking.caregiver.pending;
      } else if (status === BookingStatus.CONFIRMED || status === BookingStatus.IN_PROGRESS) {
        endpoint = ApiEndpoints.booking.caregiver.upcoming;
      } else if (status === BookingStatus.COMPLETED) {
        endpoint = ApiEndpoints.booking.caregiver.history;
      } else {
        // Default to upcoming if unknown status
        endpoint = ApiEndpoints.booking.caregiver.upcoming;
      }

      const response = await apiClient.get<ApiResponse<PaginatedResponse<Booking>>>(
        `${endpoint}?${params.toString()}`
      );

      return this.extractPaginatedData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get booking by ID (caregiver uses same endpoint as family)
   */
  async getCaregiverBookingById(bookingId: string): Promise<Booking> {
    try {
      const response = await apiClient.get<ApiResponse<Booking>>(
        ApiEndpoints.booking.family.byId(bookingId)
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Accept a booking (caregiver)
   */
  async acceptBooking(bookingId: string): Promise<Booking> {
    try {
      const response = await apiClient.patch<ApiResponse<Booking>>(
        ApiEndpoints.booking.caregiver.accept(bookingId)
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Decline a booking (caregiver)
   */
  async declineBooking(bookingId: string, reason: string): Promise<Booking> {
    try {
      const response = await apiClient.patch<ApiResponse<Booking>>(
        ApiEndpoints.booking.caregiver.decline(bookingId),
        { reason }
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  // ============================================
  // Helper Methods
  // ============================================

  /**
   * Extract data from API response
   */
  private extractData<T>(response: ApiResponse<T>): T {
    if (response.data !== undefined) {
      return response.data;
    }
    return response as unknown as T;
  }

  /**
   * Extract paginated data from API response
   */
  private extractPaginatedData<T>(
    response: ApiResponse<PaginatedResponse<T>>
  ): PaginatedResponse<T> {
    // Handle nested data structure: {success: true, data: {data: [...], pagination: {...}}}
    if (response.data?.data) {
      return response.data;
    }

    // Handle direct paginated response
    if (response.data && 'pagination' in response.data) {
      return response.data as PaginatedResponse<T>;
    }

    // Fallback
    return response as unknown as PaginatedResponse<T>;
  }
}

// Export singleton instance
export const bookingRepository = new BookingRepository();
