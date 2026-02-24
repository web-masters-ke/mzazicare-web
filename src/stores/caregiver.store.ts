/**
 * Caregiver Store
 * Zustand store for caregiver management
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { caregiverRepository, CaregiverSearchFilters } from '@/repositories/caregiver.repository';
import { CaregiverProfile } from '@/types/models';

export interface CaregiverState {
  // State
  caregivers: CaregiverProfile[];
  currentCaregiver: CaregiverProfile | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  registerCaregiver: (data?: { bio?: string; skills?: string[] }) => Promise<CaregiverProfile>;
  searchCaregivers: (filters: CaregiverSearchFilters) => Promise<void>;
  getCaregiverById: (id: string) => Promise<void>;
  updateProfile: (data: Partial<CaregiverProfile>) => Promise<CaregiverProfile>;
  clearError: () => void;
  reset: () => void;
}

export const useCaregiverStore = create<CaregiverState>()(
  devtools(
    (set) => ({
      // Initial State
      caregivers: [],
      currentCaregiver: null,
      isLoading: false,
      error: null,

      // Register as caregiver
      registerCaregiver: async (data?: { bio?: string; skills?: string[] }) => {
        set({ isLoading: true, error: null });
        try {
          const profile = await caregiverRepository.registerCaregiver(data);
          set({ currentCaregiver: profile, isLoading: false });
          return profile;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to register as caregiver',
          });
          throw error;
        }
      },

      // Search caregivers
      searchCaregivers: async (filters: CaregiverSearchFilters) => {
        set({ isLoading: true, error: null });
        try {
          const caregivers = await caregiverRepository.searchCaregivers(filters);
          set({ caregivers, isLoading: false });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to search caregivers',
          });
          throw error;
        }
      },

      // Get caregiver by ID
      getCaregiverById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const caregiver = await caregiverRepository.getCaregiverById(id);
          set({ currentCaregiver: caregiver, isLoading: false });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to fetch caregiver details',
          });
          throw error;
        }
      },

      // Update caregiver profile
      updateProfile: async (data: Partial<CaregiverProfile>) => {
        set({ isLoading: true, error: null });
        try {
          const updatedProfile = await caregiverRepository.updateCaregiverProfile(data);
          set({ currentCaregiver: updatedProfile, isLoading: false });
          return updatedProfile;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to update profile',
          });
          throw error;
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Reset store
      reset: () => {
        set({
          caregivers: [],
          currentCaregiver: null,
          isLoading: false,
          error: null,
        });
      },
    }),
    { name: 'CaregiverStore' }
  )
);
