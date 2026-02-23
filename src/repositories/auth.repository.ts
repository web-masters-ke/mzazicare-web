/**
 * Auth Repository
 * Handles authentication-related API calls
 * Mirrors mobile app's AuthRepository
 */

import { apiClient } from '@/services/api/api-client';
import { ApiEndpoints } from '@/config/api-endpoints';
import { storageService } from '@/services/storage/storage.service';
import {
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  User,
  ApiResponse,
} from '@/types/models';

export class AuthRepository {
  /**
   * Send OTP to phone number
   */
  async sendOtp(phoneNumber: string): Promise<SendOtpResponse> {
    try {
      const request: SendOtpRequest = {
        phone: phoneNumber,
        purpose: 'login'
      };
      const response = await apiClient.post<ApiResponse<SendOtpResponse>>(
        ApiEndpoints.auth.sendOtp,
        request
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verify OTP and get auth tokens
   */
  async verifyOtp(phoneNumber: string, otp: string): Promise<VerifyOtpResponse> {
    try {
      const request: VerifyOtpRequest = {
        phone: phoneNumber,
        code: otp,
        purpose: 'login'
      };
      const response = await apiClient.post<ApiResponse<VerifyOtpResponse>>(
        ApiEndpoints.auth.verifyOtp,
        request
      );

      const data = this.extractData(response.data);

      // Save auth session to storage
      await storageService.saveAuthSession({
        accessToken: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken,
        userId: data.user.id,
        userRole: data.user.role,
      });

      // Save user data
      await storageService.saveUser(data.user);

      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<{ accessToken: string; refreshToken?: string }> {
    try {
      const refreshToken = await storageService.getRefreshToken();

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post<ApiResponse>(
        ApiEndpoints.auth.refreshToken,
        { refreshToken }
      );

      const data = this.extractData(response.data);

      return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint
      await apiClient.post(ApiEndpoints.auth.logout);

      // Clear local storage
      await storageService.clearAuthSession();
    } catch (error) {
      // Clear storage even if API call fails
      await storageService.clearAuthSession();
      throw error;
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<User>>(
        ApiEndpoints.user.profile
      );

      const user = this.extractData(response.data);

      // Update cached user
      await storageService.saveUser(user);

      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.patch<ApiResponse<User>>(
        ApiEndpoints.user.updateProfile,
        data
      );

      const user = this.extractData(response.data);

      // Update cached user
      await storageService.saveUser(user);

      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Upload profile photo
   */
  async uploadProfilePhoto(file: File): Promise<{ photoUrl: string }> {
    try {
      const response = await apiClient.uploadFile<ApiResponse<{ photoUrl: string }>>(
        ApiEndpoints.user.uploadPhoto,
        file,
        'photo'
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    return storageService.isAuthenticated();
  }

  /**
   * Get cached user
   */
  async getCachedUser(): Promise<User | null> {
    return storageService.getUser();
  }

  /**
   * Reset password - send reset request/OTP
   */
  async resetPassword(phoneNumber: string): Promise<void> {
    try {
      await apiClient.post(ApiEndpoints.auth.resetPasswordRequest, {
        phone: phoneNumber
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Confirm password reset
   */
  async confirmPasswordReset(
    phoneNumber: string,
    otp: string,
    newPassword: string
  ): Promise<void> {
    try {
      await apiClient.post(ApiEndpoints.auth.resetPassword, {
        phone: phoneNumber,
        code: otp,
        password: newPassword,
        confirmPassword: newPassword,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Extract data from API response
   */
  private extractData<T>(response: ApiResponse<T>): T {
    // Handle wrapped response: {success: true, data: {...}}
    if (response.data !== undefined) {
      return response.data;
    }

    // Handle direct response
    return response as unknown as T;
  }
}

// Export singleton instance
export const authRepository = new AuthRepository();
