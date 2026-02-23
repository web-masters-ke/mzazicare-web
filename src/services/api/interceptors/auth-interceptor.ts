/**
 * Auth Interceptor
 * Handles token injection and automatic token refresh
 * Mirrors mobile app's AuthInterceptor
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { storageService } from '@/services/storage/storage.service';
import { ApiEndpoints } from '@/config/api-endpoints';
import { EnvConfig } from '@/config/env.config';

interface QueuedRequest {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}

export class AuthInterceptor {
  private isRefreshing = false;
  private failedQueue: QueuedRequest[] = [];

  // Public routes that don't require authentication
  private publicRoutes = [
    ApiEndpoints.auth.sendOtp,
    ApiEndpoints.auth.verifyOtp,
    ApiEndpoints.auth.login,
    ApiEndpoints.auth.refreshToken,
    ApiEndpoints.auth.resetPasswordRequest,
    ApiEndpoints.auth.resetPassword,
    ApiEndpoints.services.list,
  ];

  constructor(private axiosInstance: AxiosInstance) {
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - inject token
    this.axiosInstance.interceptors.request.use(
      async (config) => await this.handleRequest(config),
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle 401
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => await this.handleResponseError(error)
    );
  }

  /**
   * Handle outgoing requests - inject token
   */
  private async handleRequest(
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> {
    // Skip token injection for public routes
    if (this.isPublicRoute(config.url || '')) {
      return config;
    }

    // Get access token and inject
    const accessToken = await storageService.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  }

  /**
   * Handle response errors - refresh token on 401
   */
  private async handleResponseError(error: AxiosError): Promise<any> {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Only handle 401 errors
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Skip refresh for public routes
    if (this.isPublicRoute(originalRequest?.url || '')) {
      return Promise.reject(error);
    }

    // If already retried, fail
    if (originalRequest._retry) {
      await this.handleRefreshFailure();
      return Promise.reject(error);
    }

    // Mark as retried
    originalRequest._retry = true;

    // If already refreshing, queue this request
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      })
        .then(() => {
          return this.axiosInstance(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    // Start refresh process
    this.isRefreshing = true;

    try {
      const newAccessToken = await this.refreshAccessToken();

      // Update token in storage
      await storageService.updateAccessToken(newAccessToken);

      // Retry all queued requests
      this.processQueue(null);

      // Retry original request
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return this.axiosInstance(originalRequest);
    } catch (refreshError) {
      // Refresh failed - clear session and reject all
      this.processQueue(refreshError);
      await this.handleRefreshFailure();
      return Promise.reject(refreshError);
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshAccessToken(): Promise<string> {
    const refreshToken = await storageService.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Create a fresh Axios instance to avoid interceptor loop
    const freshAxios = axios.create({
      baseURL: EnvConfig.baseUrl,
      timeout: EnvConfig.timeout.connect,
    });

    try {
      const response = await freshAxios.post(ApiEndpoints.auth.refreshToken, {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data.data || response.data;

      // Update both tokens if new refresh token is provided
      if (newRefreshToken) {
        await storageService.saveAuthSession({
          accessToken,
          refreshToken: newRefreshToken,
          userId: await storageService.getUserId() || '',
          userRole: (await storageService.getUserRole() as any) || 'FAMILY_USER',
        });
      }

      return accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  }

  /**
   * Process queued requests after refresh
   */
  private processQueue(error: any) {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve();
      }
    });

    this.failedQueue = [];
  }

  /**
   * Handle refresh failure - clear session
   */
  private async handleRefreshFailure(): Promise<void> {
    await storageService.clearAuthSession();

    // Redirect to login if in browser
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  /**
   * Check if route is public
   */
  private isPublicRoute(url: string): boolean {
    return this.publicRoutes.some((route) => url.includes(route));
  }
}

/**
 * Setup auth interceptor on an Axios instance
 */
export function setupAuthInterceptor(axiosInstance: AxiosInstance): AuthInterceptor {
  return new AuthInterceptor(axiosInstance);
}
