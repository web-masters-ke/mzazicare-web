/**
 * Enums
 * Application-wide enum definitions
 * Mirrors mobile app enums
 */

export enum UserRole {
  FAMILY_USER = 'FAMILY_USER',
  CAREGIVER = 'CAREGIVER',
  ADMIN = 'ADMIN',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED',
}

export enum ServiceCategory {
  HOME_CHECK_IN = 'HOME_CHECK_IN',
  COMPANIONSHIP = 'COMPANIONSHIP',
  CLEANING = 'CLEANING',
  ERRANDS = 'ERRANDS',
  HEALTH_MONITORING = 'HEALTH_MONITORING',
  EMERGENCY_RESPONSE = 'EMERGENCY_RESPONSE',
}

export enum VisitStatus {
  SCHEDULED = 'SCHEDULED',
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
  CANCELLED = 'CANCELLED',
}

export enum DocumentStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export enum NotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
}

// Display name helpers
export const BookingStatusDisplay: Record<BookingStatus, string> = {
  [BookingStatus.PENDING]: 'Pending',
  [BookingStatus.CONFIRMED]: 'Confirmed',
  [BookingStatus.IN_PROGRESS]: 'In Progress',
  [BookingStatus.COMPLETED]: 'Completed',
  [BookingStatus.CANCELLED]: 'Cancelled',
  [BookingStatus.NO_SHOW]: 'No Show',
};

export const PaymentStatusDisplay: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'Pending',
  [PaymentStatus.PAID]: 'Paid',
  [PaymentStatus.REFUNDED]: 'Refunded',
  [PaymentStatus.FAILED]: 'Failed',
};

export const ServiceCategoryDisplay: Record<ServiceCategory, string> = {
  [ServiceCategory.HOME_CHECK_IN]: 'Home Check-in',
  [ServiceCategory.COMPANIONSHIP]: 'Companionship',
  [ServiceCategory.CLEANING]: 'Cleaning',
  [ServiceCategory.ERRANDS]: 'Errands',
  [ServiceCategory.HEALTH_MONITORING]: 'Health Monitoring',
  [ServiceCategory.EMERGENCY_RESPONSE]: 'Emergency Response',
};
