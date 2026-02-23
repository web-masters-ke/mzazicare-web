/**
 * Type Models
 * Core data models for the application
 * Mirrors mobile app's Freezed models
 */

import {
  UserRole,
  BookingStatus,
  PaymentStatus,
  ServiceCategory,
  VisitStatus,
  DocumentStatus,
  NotificationStatus,
} from './enums';

// Re-export enums for convenience
export {
  UserRole,
  BookingStatus,
  PaymentStatus,
  ServiceCategory,
  VisitStatus,
  DocumentStatus,
  NotificationStatus,
};

// ============================================
// User Models
// ============================================

export interface User {
  id: string;
  phone: string;
  phoneNumber?: string; // Backward compatibility
  email?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  profilePhoto?: string;
  profilePhotoUrl?: string; // Backward compatibility
  status?: string;
  isActive?: boolean;
  isPhoneVerified?: boolean;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FamilyUser extends User {
  address?: string;
  emergencyContact?: string;
}

export interface CaregiverProfile {
  id: string;
  userId: string;
  bio?: string;
  experience?: string;
  certifications?: string[];
  skills?: string[];
  hourlyRate?: number;
  availability?: CaregiverAvailability[];
  rating?: number;
  totalReviews?: number;
  documentsVerified: boolean;
  backgroundCheckStatus: DocumentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CaregiverAvailability {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isAvailable: boolean;
}

// ============================================
// Auth Models
// ============================================

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  userId: string;
  userRole: UserRole;
}

export interface SendOtpRequest {
  phone: string;
  purpose?: 'login' | 'register';
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  expiresIn?: number;
}

export interface VerifyOtpRequest {
  phone: string;
  code: string;
  purpose?: 'login' | 'register';
  fullName?: string;
  email?: string;
  role?: UserRole;
}

// This is what the API returns wrapped in ApiResponse<T>
// After extractData, we get just the inner data object
export interface VerifyOtpResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
  isNewUser: boolean;
}

// ============================================
// Elderly Models
// ============================================

export interface Elderly {
  id: string;
  userId: string;
  fullName: string;
  dateOfBirth?: string;
  gender?: string;
  photo?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  locationNotes?: string;
  medicalConditions?: string;
  medications?: string;
  mobilityNotes?: string;
  specialInstructions?: string;
  isActive: boolean;
  emergencyContacts?: EmergencyContact[];
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  isPrimary: boolean;
}

export interface CreateElderlyRequest {
  fullName: string;
  dateOfBirth?: string;
  gender?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  locationNotes?: string;
  medicalConditions?: string;
  medications?: string;
  mobilityNotes?: string;
  specialInstructions?: string;
}

// ============================================
// Booking Models
// ============================================

export interface Booking {
  id: string;
  familyUserId: string;
  elderlyId: string;
  caregiverId?: string;
  serviceType: ServiceCategory;
  status: BookingStatus;
  scheduledStartTime: string;
  scheduledEndTime: string;
  durationMinutes: number;
  hourlyRate?: number;
  totalAmount?: number;
  paymentStatus: PaymentStatus;
  specialInstructions?: string;
  cancellationReason?: string;
  elderly?: BookingElderlyInfo;
  caregiver?: BookingCaregiverInfo;
  visit?: BookingVisitInfo;
  createdAt: string;
  updatedAt: string;
}

export interface BookingElderlyInfo {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
}

export interface BookingCaregiverInfo {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  rating?: number;
}

export interface BookingVisitInfo {
  id: string;
  status: VisitStatus;
  checkInTime?: string;
  checkOutTime?: string;
  reportNotes?: string;
}

export interface CreateBookingRequest {
  elderlyId: string;
  caregiverId?: string;
  serviceType: ServiceCategory;
  scheduledStartTime: string;
  durationMinutes: number;
  specialInstructions?: string;
}

export interface CancelBookingRequest {
  reason: string;
}

export interface RescheduleBookingRequest {
  scheduledStartTime: string;
  durationMinutes?: number;
}

export interface AssignCaregiverRequest {
  caregiverId: string;
}

// ============================================
// Visit Models
// ============================================

export interface Visit {
  id: string;
  bookingId: string;
  caregiverId: string;
  elderlyId: string;
  status: VisitStatus;
  checkInTime?: string;
  checkInLocation?: Location;
  checkOutTime?: string;
  checkOutLocation?: Location;
  reportNotes?: string;
  tasksCompleted?: string[];
  elderlyMood?: string;
  healthObservations?: string;
  photoUrls?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface CheckInRequest {
  location: Location;
}

export interface CheckOutRequest {
  location: Location;
  reportNotes: string;
  tasksCompleted?: string[];
  elderlyMood?: string;
  healthObservations?: string;
}

// ============================================
// Wallet & Payment Models
// ============================================

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  referenceId?: string;
  referenceType?: string;
  mpesaRef?: string;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: string;
}

export interface TopUpWalletRequest {
  phone: string;
  amount: number;
}

export interface TopUpWalletResponse {
  checkoutRequestId: string;
  message: string;
}

export interface WithdrawWalletRequest {
  amount: number;
  method: 'MPESA' | 'BANK';
  phoneNumber?: string;
  bankAccount?: {
    accountNumber: string;
    bankName: string;
    accountName: string;
  };
}

export interface WithdrawWalletResponse {
  transactionId: string;
  message: string;
  status: string;
}

export enum PaymentMethod {
  WALLET = 'WALLET',
  MPESA = 'MPESA',
  CARD = 'CARD',
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  method: 'WALLET' | 'MPESA' | 'CARD';
  status: PaymentStatus;
  transactionId?: string;
  mpesaReceiptNumber?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Review Models
// ============================================

export interface Review {
  id: string;
  bookingId: string;
  caregiverId: string;
  familyUserId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  bookingId: string;
  rating: number;
  comment?: string;
}

// ============================================
// Service Models
// ============================================

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  basePrice: number;
  duration: number;
  isActive: boolean;
  iconUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Notification Models
// ============================================

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  data?: Record<string, any>;
  status: NotificationStatus;
  createdAt: string;
  readAt?: string;
}

// ============================================
// Pagination Models
// ============================================

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// ============================================
// API Response Models
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// ============================================
// Messaging Models
// ============================================

// Re-export all messaging types
export * from './messaging';
