/**
 * Service Repository
 * Handles service-related API calls
 */

import { apiClient } from '@/services/api/api-client';
import { ApiEndpoints } from '@/config/api-endpoints';
import { ServiceType, ApiResponse } from '@/types/models';

export class ServiceRepository {
  /**
   * Get all services
   */
  async getAllServices(): Promise<ServiceType[]> {
    try {
      const response = await apiClient.get<ApiResponse<ServiceType[]>>(
        ApiEndpoints.services.list
      );

      // Extract data from ApiResponse wrapper
      return this.extractListData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get service by ID
   */
  async getServiceById(id: string): Promise<ServiceType> {
    try {
      const response = await apiClient.get<ApiResponse<ServiceType>>(
        ApiEndpoints.services.byId(id)
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

  /**
   * Get service by category
   */
  async getServiceByCategory(category: string): Promise<ServiceType | undefined> {
    try {
      const services = await this.getAllServices();
      return services.find(s => s.category === category);
    } catch (error) {
      throw error;
    }
  }
}

// Export singleton instance
export const serviceRepository = new ServiceRepository();
