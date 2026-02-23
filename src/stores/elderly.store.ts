/**
 * Elderly Store
 * Zustand store for elderly profile management
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { elderlyRepository } from '@/repositories/elderly.repository';
import { Elderly, CreateElderlyRequest, EmergencyContact } from '@/types/models';

export interface ElderlyState {
  // State
  elderlyList: Elderly[];
  currentElderly: Elderly | null;
  emergencyContacts: EmergencyContact[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchElderlyList: () => Promise<void>;
  fetchElderlyById: (id: string) => Promise<void>;
  createElderly: (data: CreateElderlyRequest) => Promise<void>;
  updateElderly: (id: string, data: Partial<CreateElderlyRequest>) => Promise<void>;
  deleteElderly: (id: string) => Promise<void>;
  fetchEmergencyContacts: (elderlyId: string) => Promise<void>;
  addEmergencyContact: (elderlyId: string, data: Omit<EmergencyContact, 'id'>) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useElderlyStore = create<ElderlyState>()(
  devtools(
    (set, get) => ({
      // Initial State
      elderlyList: [],
      currentElderly: null,
      emergencyContacts: [],
      isLoading: false,
      error: null,

      // Fetch elderly list
      fetchElderlyList: async () => {
        set({ isLoading: true, error: null });
        try {
          const elderlyList = await elderlyRepository.getElderlyList();
          set({ elderlyList, isLoading: false });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to fetch elderly list',
          });
          throw error;
        }
      },

      // Fetch elderly by ID
      fetchElderlyById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const elderly = await elderlyRepository.getElderlyById(id);
          set({ currentElderly: elderly, isLoading: false });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to fetch elderly details',
          });
          throw error;
        }
      },

      // Create elderly
      createElderly: async (data: CreateElderlyRequest) => {
        set({ isLoading: true, error: null });
        try {
          const newElderly = await elderlyRepository.createElderly(data);
          const currentList = get().elderlyList;
          set({
            elderlyList: [...currentList, newElderly],
            currentElderly: newElderly,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to create elderly profile',
          });
          throw error;
        }
      },

      // Update elderly
      updateElderly: async (id: string, data: Partial<CreateElderlyRequest>) => {
        set({ isLoading: true, error: null });
        try {
          const updatedElderly = await elderlyRepository.updateElderly(id, data);
          const currentList = get().elderlyList;
          set({
            elderlyList: currentList.map((e) => (e.id === id ? updatedElderly : e)),
            currentElderly: updatedElderly,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to update elderly profile',
          });
          throw error;
        }
      },

      // Delete elderly
      deleteElderly: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await elderlyRepository.deleteElderly(id);
          const currentList = get().elderlyList;
          set({
            elderlyList: currentList.filter((e) => e.id !== id),
            currentElderly: null,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to delete elderly profile',
          });
          throw error;
        }
      },

      // Fetch emergency contacts
      fetchEmergencyContacts: async (elderlyId: string) => {
        set({ isLoading: true, error: null });
        try {
          const contacts = await elderlyRepository.getEmergencyContacts(elderlyId);
          set({ emergencyContacts: contacts, isLoading: false });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to fetch emergency contacts',
          });
          throw error;
        }
      },

      // Add emergency contact
      addEmergencyContact: async (elderlyId: string, data: Omit<EmergencyContact, 'id'>) => {
        set({ isLoading: true, error: null });
        try {
          const newContact = await elderlyRepository.addEmergencyContact(elderlyId, data);
          const currentContacts = get().emergencyContacts;
          set({
            emergencyContacts: [...currentContacts, newContact],
            isLoading: false,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to add emergency contact',
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
          elderlyList: [],
          currentElderly: null,
          emergencyContacts: [],
          isLoading: false,
          error: null,
        });
      },
    }),
    { name: 'ElderlyStore' }
  )
);
