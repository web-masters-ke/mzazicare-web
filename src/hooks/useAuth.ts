/**
 * useAuth Hook
 * Custom React hook for authentication
 */

import { useEffect, useState } from 'react';
import type { AuthState } from '@/stores/auth.store';
import { useAuthStore, selectUser, selectIsAuthenticated, selectUserRole, selectIsFamilyUser, selectIsCaregiver, getHasHydrated } from '@/stores/auth.store';

export function useAuth() {
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // Use individual selectors to avoid re-render issues
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isNewUser = useAuthStore((state) => state.isNewUser);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const otpLoading = useAuthStore((state) => state.otpLoading);
  const otpSent = useAuthStore((state) => state.otpSent);
  const otpError = useAuthStore((state) => state.otpError);
  const verificationLoading = useAuthStore((state) => state.verificationLoading);
  const verificationError = useAuthStore((state) => state.verificationError);
  const sendOtp = useAuthStore((state) => state.sendOtp);
  const verifyOtp = useAuthStore((state) => state.verifyOtp);
  const logout = useAuthStore((state) => state.logout);
  const loadUser = useAuthStore((state) => state.loadUser);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const clearError = useAuthStore((state) => state.clearError);
  const clearOtpState = useAuthStore((state) => state.clearOtpState);

  // Auto-load user on mount - but wait for hydration first
  useEffect(() => {
    // Wait a bit for Zustand persist to hydrate
    const timer = setTimeout(() => {
      if (!hasCheckedAuth) {
        setHasCheckedAuth(true);
        // Only call loadUser if we don't already have a user from persist
        if (!user && !isLoading && !isAuthenticated) {
          loadUser();
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const userRole = useAuthStore(selectUserRole);
  const isFamilyUser = useAuthStore(selectIsFamilyUser);
  const isCaregiver = useAuthStore(selectIsCaregiver);

  return {
    // State
    user,
    isAuthenticated,
    isNewUser,
    isLoading,
    error,
    userRole,
    isFamilyUser,
    isCaregiver,

    // OTP State
    otpLoading,
    otpSent,
    otpError,

    // Verification State
    verificationLoading,
    verificationError,

    // Actions
    sendOtp,
    verifyOtp,
    logout,
    loadUser,
    updateProfile,
    clearError,
    clearOtpState,
  };
}
