/**
 * Auth Store
 * Zustand store for authentication state
 * Mirrors mobile app's AuthNotifier (Riverpod)
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { authRepository } from '@/repositories/auth.repository';
import { User, UserRole } from '@/types/models';

// State interface
export interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isNewUser: boolean; // Track if user just registered
  isLoading: boolean;
  error: string | null;

  // OTP State
  otpLoading: boolean;
  otpSent: boolean;
  otpError: string | null;

  // Verification State
  verificationLoading: boolean;
  verificationError: string | null;

  // Actions
  sendOtp: (phoneNumber: string) => Promise<void>;
  verifyOtp: (phoneNumber: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
  clearOtpState: () => void;
}

// Track if store has been hydrated from localStorage
let hasHydrated = false;

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        user: null,
        isAuthenticated: false,
        isNewUser: false,
        isLoading: false,
        error: null,

        otpLoading: false,
        otpSent: false,
        otpError: null,

        verificationLoading: false,
        verificationError: null,

        // Send OTP
        sendOtp: async (phoneNumber: string) => {
          set({ otpLoading: true, otpError: null, otpSent: false });

          try {
            await authRepository.sendOtp(phoneNumber);
            set({ otpLoading: false, otpSent: true });
          } catch (error: any) {
            set({
              otpLoading: false,
              otpError: error.message || 'Failed to send OTP',
              otpSent: false,
            });
            throw error;
          }
        },

        // Verify OTP
        verifyOtp: async (phoneNumber: string, otp: string) => {
          set({ verificationLoading: true, verificationError: null });

          try {
            const response = await authRepository.verifyOtp(phoneNumber, otp);
            set({
              verificationLoading: false,
              user: response.user,
              isAuthenticated: true,
              isNewUser: response.isNewUser, // Track if this is a new user
              otpSent: false,
            });
          } catch (error: any) {
            set({
              verificationLoading: false,
              verificationError: error.message || 'Invalid OTP',
            });
            throw error;
          }
        },

        // Logout
        logout: async () => {
          try {
            await authRepository.logout();
          } catch (error) {
            console.error('Logout error:', error);
          } finally {
            set({
              user: null,
              isAuthenticated: false,
              isNewUser: false,
              error: null,
              otpSent: false,
              otpError: null,
              verificationError: null,
            });
          }
        },

        // Load user from storage/API
        loadUser: async () => {
          // Don't set loading if we already have a user (from persist)
          const currentState = get();
          if (currentState.user && currentState.isAuthenticated) {
            console.log('User already loaded from storage, skipping API call');
            return;
          }

          set({ isLoading: true, error: null });

          try {
            const isAuth = await authRepository.isAuthenticated();

            if (!isAuth) {
              // Only clear auth if we don't have a persisted user
              if (!currentState.user) {
                set({ isLoading: false, isAuthenticated: false });
              } else {
                set({ isLoading: false });
              }
              return;
            }

            // Try to get cached user first
            let user = await authRepository.getCachedUser();

            // If we have a persisted user, use that
            if (!user && currentState.user) {
              user = currentState.user;
            }

            // If still no user, fetch from API
            if (!user) {
              user = await authRepository.getUserProfile();
            }

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error: any) {
            console.error('Load user error:', error);
            // Don't clear auth on error if we have a persisted user
            if (currentState.user && currentState.isAuthenticated) {
              set({ isLoading: false, error: error.message || 'Failed to load user' });
            } else {
              set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: error.message || 'Failed to load user',
              });
            }
          }
        },

        // Update profile
        updateProfile: async (data: Partial<User>) => {
          set({ isLoading: true, error: null });

          try {
            const updatedUser = await authRepository.updateProfile(data);
            set({
              user: updatedUser,
              isLoading: false,
            });
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.message || 'Failed to update profile',
            });
            throw error;
          }
        },

        // Clear error
        clearError: () => {
          set({ error: null, otpError: null, verificationError: null });
        },

        // Clear OTP state
        clearOtpState: () => {
          set({
            otpLoading: false,
            otpSent: false,
            otpError: null,
            verificationLoading: false,
            verificationError: null,
          });
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
        onRehydrateStorage: () => {
          return (state, error) => {
            if (error) {
              console.error('Failed to hydrate auth store:', error);
            } else {
              hasHydrated = true;
              console.log('Auth store hydrated:', state?.isAuthenticated);
            }
          };
        },
      }
    ),
    { name: 'AuthStore' }
  )
);

// Export helper to check if hydrated
export const getHasHydrated = () => hasHydrated;

// Selectors
export const selectUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectIsLoading = (state: AuthState) => state.isLoading;
export const selectUserRole = (state: AuthState): UserRole | null =>
  state.user?.role || null;
export const selectIsFamilyUser = (state: AuthState) =>
  state.user?.role === UserRole.FAMILY_USER;
export const selectIsCaregiver = (state: AuthState) =>
  state.user?.role === UserRole.CAREGIVER;
