/**
 * useCaregiver Hook
 * Custom React hook for caregiver management
 */

import { useCaregiverStore } from '@/stores/caregiver.store';
import { CaregiverSearchFilters } from '@/repositories/caregiver.repository';

export function useCaregiver() {
  // Use individual selectors to avoid re-render issues
  const caregivers = useCaregiverStore((state) => state.caregivers);
  const currentCaregiver = useCaregiverStore((state) => state.currentCaregiver);
  const isLoading = useCaregiverStore((state) => state.isLoading);
  const error = useCaregiverStore((state) => state.error);
  const registerCaregiver = useCaregiverStore((state) => state.registerCaregiver);
  const searchCaregivers = useCaregiverStore((state) => state.searchCaregivers);
  const getCaregiverById = useCaregiverStore((state) => state.getCaregiverById);
  const updateProfile = useCaregiverStore((state) => state.updateProfile);
  const clearError = useCaregiverStore((state) => state.clearError);
  const reset = useCaregiverStore((state) => state.reset);

  return {
    // State
    caregivers,
    currentCaregiver,
    isLoading,
    error,

    // Actions
    registerCaregiver,
    searchCaregivers,
    getCaregiverById,
    updateProfile,
    clearError,
    reset,
  };
}
