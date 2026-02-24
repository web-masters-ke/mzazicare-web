/**
 * Caregiver Repository
 * Handles caregiver-related API calls
 * Mirrors mobile app's CaregiverRepository
 */

import { apiClient } from '@/services/api/api-client';
import { ApiEndpoints } from '@/config/api-endpoints';
import {
  CaregiverProfile,
  CaregiverAvailability,
  ApiResponse,
} from '@/types/models';

export interface CaregiverSearchFilters {
  skills?: string[];
  minRating?: number;
  maxHourlyRate?: number;
  availability?: string; // ISO date string
  location?: string;
  page?: number;
  limit?: number;
}

export class CaregiverRepository {
  /**
   * Register as caregiver (create caregiver profile)
   */
  async registerCaregiver(data?: { bio?: string; skills?: string[] }): Promise<CaregiverProfile> {
    try {
      const response = await apiClient.post<ApiResponse<CaregiverProfile>>(
        ApiEndpoints.caregiver.register,
        data || {}
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get caregiver profile
   */
  async getCaregiverProfile(): Promise<CaregiverProfile> {
    try {
      const response = await apiClient.get<ApiResponse<CaregiverProfile>>(
        ApiEndpoints.caregiver.myProfile
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update caregiver profile
   */
  async updateCaregiverProfile(data: Partial<CaregiverProfile>): Promise<CaregiverProfile> {
    try {
      const response = await apiClient.patch<ApiResponse<CaregiverProfile>>(
        ApiEndpoints.caregiver.updateProfile,
        data
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Upload caregiver documents (files)
   */
  async uploadDocuments(files: {
    nationalIdFront: File;
    nationalIdBack: File;
    selfieWithId: File;
  }): Promise<{ nationalIdFront: string; nationalIdBack: string; selfieWithId: string; }> {
    try {
      const formData = new FormData();
      formData.append('nationalIdFront', files.nationalIdFront);
      formData.append('nationalIdBack', files.nationalIdBack);
      formData.append('selfieWithId', files.selfieWithId);

      const response = await apiClient.post<ApiResponse<any>>(
        ApiEndpoints.caregiver.uploadDocuments,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Submit caregiver documents (URLs)
   */
  async submitDocuments(documents: {
    nationalIdNumber: string;
    nationalIdFront: string;
    nationalIdBack: string;
    selfieWithId: string;
  }): Promise<any> {
    try {
      const response = await apiClient.post<ApiResponse<any>>(
        ApiEndpoints.caregiver.submitDocuments,
        documents
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update caregiver skills
   */
  async updateSkills(skills: string[]): Promise<any> {
    try {
      const response = await apiClient.put<ApiResponse<any>>(
        ApiEndpoints.caregiver.updateSkills,
        { skills }
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update caregiver availability
   */
  async updateAvailability(
    availability: CaregiverAvailability[]
  ): Promise<CaregiverAvailability[]> {
    try {
      const response = await apiClient.put<ApiResponse<CaregiverAvailability[]>>(
        ApiEndpoints.caregiver.updateAvailability,
        { availability }
      );

      return this.extractListData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get caregiver earnings
   */
  async getEarnings(startDate?: string, endDate?: string): Promise<any> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const url = params.toString()
        ? `${ApiEndpoints.caregiver.earnings}?${params.toString()}`
        : ApiEndpoints.caregiver.earnings;

      const response = await apiClient.get<ApiResponse<any>>(url);

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get my caregiver profile
   */
  async getMyProfile(): Promise<CaregiverProfile> {
    try {
      const response = await apiClient.get<ApiResponse<CaregiverProfile>>(
        ApiEndpoints.caregiver.myProfile
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Search caregivers
   */
  async searchCaregivers(filters: CaregiverSearchFilters): Promise<CaregiverProfile[]> {
    try {
      const params = new URLSearchParams();
      if (filters.skills) params.append('skills', filters.skills.join(','));
      if (filters.minRating) params.append('minRating', filters.minRating.toString());
      if (filters.maxHourlyRate) params.append('maxHourlyRate', filters.maxHourlyRate.toString());
      if (filters.availability) params.append('availability', filters.availability);
      if (filters.location) params.append('location', filters.location);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await apiClient.get<ApiResponse<CaregiverProfile[]>>(
        `${ApiEndpoints.caregiver.search}?${params.toString()}`
      );

      return this.extractListData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get caregiver by ID
   */
  async getCaregiverById(id: string): Promise<CaregiverProfile> {
    try {
      const response = await apiClient.get<ApiResponse<CaregiverProfile>>(
        ApiEndpoints.caregiver.byId(id)
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get matched caregivers based on criteria
   */
  async matchCaregivers(criteria: any): Promise<CaregiverProfile[]> {
    try {
      const response = await apiClient.post<ApiResponse<CaregiverProfile[]>>(
        ApiEndpoints.caregiver.match,
        criteria
      );

      return this.extractListData(response.data);
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
export const caregiverRepository = new CaregiverRepository();
