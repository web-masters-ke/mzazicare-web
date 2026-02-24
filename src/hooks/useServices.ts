/**
 * useServices Hook
 * Custom React hook for service management
 */

import { useState, useEffect } from 'react';
import { serviceRepository } from '@/repositories/service.repository';
import { ServiceType, ServiceCategory } from '@/types/models';

export function useServices(autoLoad: boolean = false) {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await serviceRepository.getAllServices();
      setServices(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch services');
    } finally {
      setIsLoading(false);
    }
  };

  const getServiceByCategory = (category: ServiceCategory): ServiceType | undefined => {
    return services.find(s => s.category === category);
  };

  const getServiceById = (id: string): ServiceType | undefined => {
    return services.find(s => s.id === id);
  };

  useEffect(() => {
    if (autoLoad) {
      fetchServices();
    }
  }, [autoLoad]);

  return {
    services,
    isLoading,
    error,
    fetchServices,
    getServiceByCategory,
    getServiceById,
  };
}
