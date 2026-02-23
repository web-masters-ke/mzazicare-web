/**
 * useElderly Hook
 * Custom React hook for elderly profile management
 */

import { useEffect } from 'react';
import { useElderlyStore } from '@/stores/elderly.store';
import { CreateElderlyRequest, EmergencyContact } from '@/types/models';

export function useElderly(autoLoad: boolean = false) {
  // Use individual selectors to avoid re-render issues
  const elderlyList = useElderlyStore((state) => state.elderlyList);
  const currentElderly = useElderlyStore((state) => state.currentElderly);
  const emergencyContacts = useElderlyStore((state) => state.emergencyContacts);
  const isLoading = useElderlyStore((state) => state.isLoading);
  const error = useElderlyStore((state) => state.error);
  const fetchElderlyList = useElderlyStore((state) => state.fetchElderlyList);
  const fetchElderlyById = useElderlyStore((state) => state.fetchElderlyById);
  const createElderly = useElderlyStore((state) => state.createElderly);
  const updateElderly = useElderlyStore((state) => state.updateElderly);
  const deleteElderly = useElderlyStore((state) => state.deleteElderly);
  const fetchEmergencyContacts = useElderlyStore((state) => state.fetchEmergencyContacts);
  const addEmergencyContact = useElderlyStore((state) => state.addEmergencyContact);
  const clearError = useElderlyStore((state) => state.clearError);
  const reset = useElderlyStore((state) => state.reset);

  // Auto-load elderly list on mount if enabled
  useEffect(() => {
    if (autoLoad) {
      fetchElderlyList();
    }
  }, [autoLoad]);

  return {
    // State
    elderlyList,
    currentElderly,
    emergencyContacts,
    isLoading,
    error,

    // Actions
    fetchElderlyList,
    fetchElderlyById,
    createElderly,
    updateElderly,
    deleteElderly,
    fetchEmergencyContacts,
    addEmergencyContact,
    clearError,
    reset,
  };
}
