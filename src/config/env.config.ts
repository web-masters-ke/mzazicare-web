/**
 * Environment Configuration
 * Centralized configuration for API URLs and app settings
 * Mirrors mobile app's EnvConfig
 */

export const EnvConfig = {
  // API Configuration
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1',
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000',

  // App Metadata
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'MzaziCare',
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',

  // Storage Keys
  storageKeys: {
    accessToken: 'mzazicare_access_token',
    refreshToken: 'mzazicare_refresh_token',
    userId: 'mzazicare_user_id',
    userRole: 'mzazicare_user_role',
    user: 'mzazicare_user',
    onboardingComplete: 'mzazicare_onboarding_complete',
  },

  // API Configuration
  timeout: {
    connect: 30000,
    receive: 30000,
    send: 30000,
  },
} as const;

export type StorageKey = keyof typeof EnvConfig.storageKeys;
