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
      const response = await apiClient.get<ServiceType[]>(
        ApiEndpoints.services.list
      );

      // The services endpoint returns an array directly, not wrapped
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get service by ID
   */
  async getServiceById(id: string): Promise<ServiceType> {
    try {
      const response = await apiClient.get<ServiceType>(
        ApiEndpoints.services.byId(id)
      );

      return response.data;
    } catch (error) {
      throw error;
    }
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
