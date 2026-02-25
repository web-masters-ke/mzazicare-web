/**
 * Analytics Repository
 * API calls for dashboard analytics
 */

import { apiClient } from '@/services/api/api-client';
import { ApiEndpoints } from '@/config/api-endpoints';
import type { ApiResponse } from '@/types/models';

export interface FamilyDashboardAnalytics {
  // Financial
  totalSpent: number;
  monthlySpending: number;
  pendingPayments: number;
  averageSessionCost: number;

  // Bookings
  totalBookings: number;
  upcomingBookings: number;
  completedBookings: number;
  activeBookings: number;
  monthlyBookings: number;

  // Elderly
  totalElderly: number;
  activeElderly: number;

  // Caregivers
  uniqueCaregivers: number;
  averageCaregiverRating: number;
  topCaregivers: Array<{
    id: string;
    fullName: string;
    photo: string | null;
    sessionsCount: number;
    rating: number;
  }>;

  // Recent Activity
  recentActivity: Array<{
    id: string;
    type: 'booking' | 'payment' | 'visit' | 'review';
    title: string;
    description: string;
    timestamp: string;
    metadata?: Record<string, any>;
  }>;

  // Spending Trend (last 6 months)
  spendingTrend: Array<{
    month: string;
    amount: number;
  }>;

  // Care Hours
  totalCareHours: number;
  monthlyCareHours: number;
}

class AnalyticsRepository {
  /**
   * Get family dashboard analytics
   */
  async getFamilyDashboardAnalytics(): Promise<FamilyDashboardAnalytics> {
    const response = await apiClient.get<ApiResponse<FamilyDashboardAnalytics>>(
      ApiEndpoints.analytics.familyDashboard
    );

    return response.data.data || this.getEmptyAnalytics();
  }

  /**
   * Get empty analytics structure (fallback)
   */
  private getEmptyAnalytics(): FamilyDashboardAnalytics {
    return {
      totalSpent: 0,
      monthlySpending: 0,
      pendingPayments: 0,
      averageSessionCost: 0,
      totalBookings: 0,
      upcomingBookings: 0,
      completedBookings: 0,
      activeBookings: 0,
      monthlyBookings: 0,
      totalElderly: 0,
      activeElderly: 0,
      uniqueCaregivers: 0,
      averageCaregiverRating: 0,
      topCaregivers: [],
      recentActivity: [],
      spendingTrend: [],
      totalCareHours: 0,
      monthlyCareHours: 0,
    };
  }
}

export const analyticsRepository = new AnalyticsRepository();
