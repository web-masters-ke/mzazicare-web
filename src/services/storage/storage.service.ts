/**
 * Storage Service
 * Secure storage for tokens and user data
 * Mirrors mobile app's SecureStorageService
 */

import { EnvConfig } from '@/config/env.config';

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  userId: string;
  userRole: 'FAMILY_USER' | 'CAREGIVER' | 'ADMIN';
}

export class StorageService {
  private storage: Storage;

  constructor() {
    // Use localStorage for web (in production, consider httpOnly cookies)
    this.storage = typeof window !== 'undefined' ? window.localStorage : ({} as Storage);
  }

  /**
   * Save complete auth session
   */
  async saveAuthSession(session: AuthSession): Promise<void> {
    try {
      this.storage.setItem(EnvConfig.storageKeys.accessToken, session.accessToken);
      this.storage.setItem(EnvConfig.storageKeys.refreshToken, session.refreshToken);
      this.storage.setItem(EnvConfig.storageKeys.userId, session.userId);
      this.storage.setItem(EnvConfig.storageKeys.userRole, session.userRole);
    } catch (error) {
      console.error('Error saving auth session:', error);
      throw error;
    }
  }

  /**
   * Get access token
   */
  async getAccessToken(): Promise<string | null> {
    try {
      return this.storage.getItem(EnvConfig.storageKeys.accessToken);
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  /**
   * Get refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    try {
      return this.storage.getItem(EnvConfig.storageKeys.refreshToken);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  /**
   * Get user ID
   */
  async getUserId(): Promise<string | null> {
    try {
      return this.storage.getItem(EnvConfig.storageKeys.userId);
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  }

  /**
   * Get user role
   */
  async getUserRole(): Promise<string | null> {
    try {
      return this.storage.getItem(EnvConfig.storageKeys.userRole);
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  }

  /**
   * Update access token (after refresh)
   */
  async updateAccessToken(token: string): Promise<void> {
    try {
      this.storage.setItem(EnvConfig.storageKeys.accessToken, token);
    } catch (error) {
      console.error('Error updating access token:', error);
      throw error;
    }
  }

  /**
   * Clear auth session (logout)
   */
  async clearAuthSession(): Promise<void> {
    try {
      this.storage.removeItem(EnvConfig.storageKeys.accessToken);
      this.storage.removeItem(EnvConfig.storageKeys.refreshToken);
      this.storage.removeItem(EnvConfig.storageKeys.userId);
      this.storage.removeItem(EnvConfig.storageKeys.userRole);
      this.storage.removeItem(EnvConfig.storageKeys.user);
    } catch (error) {
      console.error('Error clearing auth session:', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    return !!accessToken;
  }

  /**
   * Save user data
   */
  async saveUser(user: any): Promise<void> {
    try {
      this.storage.setItem(EnvConfig.storageKeys.user, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  /**
   * Get user data
   */
  async getUser(): Promise<any | null> {
    try {
      const userStr = this.storage.getItem(EnvConfig.storageKeys.user);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  /**
   * Save onboarding status
   */
  async saveOnboardingComplete(complete: boolean): Promise<void> {
    try {
      this.storage.setItem(EnvConfig.storageKeys.onboardingComplete, String(complete));
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      throw error;
    }
  }

  /**
   * Check if onboarding is complete
   */
  async isOnboardingComplete(): Promise<boolean> {
    try {
      const status = this.storage.getItem(EnvConfig.storageKeys.onboardingComplete);
      return status === 'true';
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  }

  /**
   * Generic set item
   */
  async set(key: string, value: string): Promise<void> {
    try {
      this.storage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
      throw error;
    }
  }

  /**
   * Generic get item
   */
  async get(key: string): Promise<string | null> {
    try {
      return this.storage.getItem(key);
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  }

  /**
   * Generic remove item
   */
  async remove(key: string): Promise<void> {
    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      throw error;
    }
  }

  /**
   * Clear all storage
   */
  async clearAll(): Promise<void> {
    try {
      this.storage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();
