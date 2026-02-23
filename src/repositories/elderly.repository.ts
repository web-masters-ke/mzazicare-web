/**
 * Elderly Repository
 * Handles elderly management API calls
 * Mirrors mobile app's ElderlyRepository
 */

import { apiClient } from '@/services/api/api-client';
import { ApiEndpoints } from '@/config/api-endpoints';
import {
  Elderly,
  CreateElderlyRequest,
  EmergencyContact,
  ApiResponse,
} from '@/types/models';

export class ElderlyRepository {
  /**
   * Get list of elderly persons
   */
  async getElderlyList(): Promise<Elderly[]> {
    try {
      const response = await apiClient.get<ApiResponse<Elderly[]>>(
        ApiEndpoints.elderly.list
      );

      return this.extractListData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get elderly person by ID
   */
  async getElderlyById(id: string): Promise<Elderly> {
    try {
      const response = await apiClient.get<ApiResponse<Elderly>>(
        ApiEndpoints.elderly.byId(id)
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create new elderly person
   */
  async createElderly(data: CreateElderlyRequest): Promise<Elderly> {
    try {
      const response = await apiClient.post<ApiResponse<Elderly>>(
        ApiEndpoints.elderly.create,
        data
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update elderly person
   */
  async updateElderly(id: string, data: Partial<CreateElderlyRequest>): Promise<Elderly> {
    try {
      const response = await apiClient.patch<ApiResponse<Elderly>>(
        ApiEndpoints.elderly.update(id),
        data
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete elderly person
   */
  async deleteElderly(id: string): Promise<void> {
    try {
      await apiClient.delete(ApiEndpoints.elderly.delete(id));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get emergency contacts for elderly person
   */
  async getEmergencyContacts(elderlyId: string): Promise<EmergencyContact[]> {
    try {
      const response = await apiClient.get<ApiResponse<EmergencyContact[]>>(
        ApiEndpoints.elderly.emergencyContacts(elderlyId)
      );

      return this.extractListData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Add emergency contact
   */
  async addEmergencyContact(
    elderlyId: string,
    data: Omit<EmergencyContact, 'id'>
  ): Promise<EmergencyContact> {
    try {
      const response = await apiClient.post<ApiResponse<EmergencyContact>>(
        ApiEndpoints.elderly.addEmergencyContact(elderlyId),
        data
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

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
   * Extract list data from API response
   */
  private extractListData<T>(response: ApiResponse<T[]>): T[] {
    if (response.data !== undefined) {
      return response.data;
    }
    if (Array.isArray(response)) {
      return response;
    }
    return response as unknown as T[];
  }
}

// Export singleton instance
export const elderlyRepository = new ElderlyRepository();
