'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge } from '@/components/ui';
import {
  Calendar,
  Clock,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
  Info,
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { Booking } from '@/types/models';

interface RescheduleBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  onReschedule: (scheduledDate: string, scheduledTime: string) => Promise<void>;
}

interface TimeSlot {
  time: string;
  available: boolean;
  reason?: string;
}

export function RescheduleBookingModal({
  isOpen,
  onClose,
  booking,
  onReschedule,
}: RescheduleBookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [minDate, setMinDate] = useState('');

  // Set minimum date (tomorrow)
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    setMinDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  // Check availability when date changes
  useEffect(() => {
    if (selectedDate && booking.caregiverId) {
      checkAvailability(selectedDate);
    }
  }, [selectedDate, booking.caregiverId]);

  const checkAvailability = async (date: string) => {
    setIsCheckingAvailability(true);
    try {
      const { EnvConfig } = await import('@/config/env.config');
      const { storageService } = await import('@/services/storage/storage.service');
      const { ApiEndpoints } = await import('@/config/api-endpoints');

      const accessToken = await storageService.getAccessToken();
      const response = await fetch(
        `${EnvConfig.baseUrl}${ApiEndpoints.caregivers}/${booking.caregiverId}/availability?date=${date}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        generateTimeSlots(data.data?.availability || []);
      } else {
        // If API fails, generate default time slots
        generateDefaultTimeSlots();
      }
    } catch (error) {
      console.error('Failed to check availability:', error);
      generateDefaultTimeSlots();
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const generateTimeSlots = (availability: any[]) => {
    const slots: TimeSlot[] = [];
    const durationHours = Math.ceil((booking.duration || booking.durationMinutes || 60) / 60);

    // Generate slots from 6 AM to 8 PM
    for (let hour = 6; hour <= 20 - durationHours; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;

      // Check if this time slot is available
      const isAvailable = availability.some((slot) => {
        const slotStart = parseInt(slot.startTime.split(':')[0]);
        const slotEnd = parseInt(slot.endTime.split(':')[0]);
        return hour >= slotStart && hour + durationHours <= slotEnd;
      });

      slots.push({
        time,
        available: isAvailable,
        reason: !isAvailable ? 'Unavailable' : undefined,
      });
    }

    setAvailableTimeSlots(slots);
  };

  const generateDefaultTimeSlots = () => {
    const slots: TimeSlot[] = [];
    const durationHours = Math.ceil((booking.duration || booking.durationMinutes || 60) / 60);

    // Generate slots from 6 AM to 8 PM
    for (let hour = 6; hour <= 20 - durationHours; hour++) {
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        available: true,
      });
    }

    setAvailableTimeSlots(slots);
  };

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time');
      return;
    }

    setIsRescheduling(true);
    try {
      // Combine date and time
      const dateTime = new Date(`${selectedDate}T${selectedTime}`);
      const scheduledDate = dateTime.toISOString();

      await onReschedule(scheduledDate, selectedTime);

      toast.success('Booking rescheduled successfully!', { icon: '📅' });
      onClose();
    } catch (error: any) {
      console.error('Failed to reschedule:', error);
      toast.error(error.message || 'Failed to reschedule booking');
    } finally {
      setIsRescheduling(false);
    }
  };

  const formatDuration = (durationMinutes: number) => {
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    if (hours > 0 && minutes > 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} min`;
    } else if (hours > 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
      return `${minutes} minutes`;
    }
  };

  const formatTimeSlot = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-dark-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-dark-900 border-b border-dark-100 dark:border-dark-800 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-dark-900 dark:text-white mb-1">
                  Reschedule Booking
                </h3>
                <p className="text-dark-600 dark:text-dark-400">
                  Select a new date and time for your booking
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-dark-400 hover:text-dark-600 dark:hover:text-dark-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Current Schedule */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                      Current Schedule
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {new Date(booking.scheduledDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                      {booking.scheduledTime && ` at ${booking.scheduledTime}`}
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                      Duration: {formatDuration(booking.duration || booking.durationMinutes || 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  New Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedTime(''); // Reset time when date changes
                  }}
                  min={minDate}
                  className="w-full p-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="mt-2 text-sm text-dark-500 dark:text-dark-400">
                  Select a date at least 24 hours in advance
                </p>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-3">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Available Time Slots
                  </label>

                  {isCheckingAvailability ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                      <span className="ml-2 text-dark-600 dark:text-dark-400">
                        Checking availability...
                      </span>
                    </div>
                  ) : availableTimeSlots.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {availableTimeSlots.map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => slot.available && setSelectedTime(slot.time)}
                          disabled={!slot.available}
                          className={`p-3 rounded-xl border-2 font-medium transition-all ${
                            selectedTime === slot.time
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                              : slot.available
                              ? 'border-dark-200 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-700 text-dark-700 dark:text-dark-300'
                              : 'border-dark-100 dark:border-dark-800 bg-dark-50 dark:bg-dark-800 text-dark-400 dark:text-dark-600 cursor-not-allowed'
                          }`}
                        >
                          {formatTimeSlot(slot.time)}
                          {!slot.available && (
                            <div className="text-xs text-red-500 mt-1">
                              Unavailable
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 text-dark-300 dark:text-dark-600 mx-auto mb-3" />
                      <p className="text-dark-600 dark:text-dark-400">
                        No available time slots for this date
                      </p>
                      <p className="text-sm text-dark-500 dark:text-dark-500 mt-1">
                        Please try another date
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Selected Summary */}
              {selectedDate && selectedTime && (
                <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                        New Schedule
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        {new Date(selectedDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}{' '}
                        at {formatTimeSlot(selectedTime)}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        Duration will remain: {formatDuration(booking.duration || booking.durationMinutes || 0)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Important Notes */}
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                    <p className="font-medium">Important Notes:</p>
                    <ul className="list-disc list-inside space-y-1 text-yellow-700 dark:text-yellow-300">
                      <li>The caregiver will be notified of the change</li>
                      <li>You can reschedule up to 24 hours before the appointment</li>
                      <li>Multiple reschedules may require approval</li>
                      <li>Service duration cannot be changed during reschedule</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-white dark:bg-dark-900 border-t border-dark-100 dark:border-dark-800 p-6 flex gap-3">
              <Button
                variant="ghost"
                onClick={onClose}
                disabled={isRescheduling}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleReschedule}
                disabled={isRescheduling || !selectedDate || !selectedTime}
                className="flex-1"
              >
                {isRescheduling ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Rescheduling...
                  </>
                ) : (
                  'Confirm Reschedule'
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
