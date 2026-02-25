/**
 * useAnalytics Hook
 * Hook for fetching and managing dashboard analytics
 */

import { useState, useCallback } from 'react';
import { analyticsRepository, FamilyDashboardAnalytics } from '@/repositories/analytics.repository';

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<FamilyDashboardAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await analyticsRepository.getFamilyDashboardAnalytics();
      setAnalytics(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch analytics');
      console.error('Error fetching analytics:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    analytics,
    isLoading,
    error,
    fetchAnalytics,
  };
}
