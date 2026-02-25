"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Clock, Check, X } from 'lucide-react';
import { Button } from './Button';
import { EnvConfig } from '@/config/env.config';
import { ApiEndpoints } from '@/config/api-endpoints';
import { storageService } from '@/services/storage/storage.service';

interface TimeSlot {
  startTime: string;
  endTime: string;
  status: 'available' | 'booked' | 'partial';
  bookingId?: string;
}

interface AvailabilityData {
  date: string;
  dayOfWeek: number;
  isWorkingDay: boolean;
  availabilityWindows?: Array<{
    startTime: string;
    endTime: string;
  }>;
  slots: TimeSlot[];
}

interface AvailabilityCalendarProps {
  caregiverId: string;
  onSlotSelect: (date: Date, startTime: string, duration: number) => void;
  selectedDate?: Date;
  selectedTime?: string;
  duration: number; // in minutes
}

export function AvailabilityCalendar({
  caregiverId,
  onSlotSelect,
  selectedDate,
  selectedTime,
  duration,
}: AvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(selectedDate || null);
  const [availability, setAvailability] = useState<Record<string, AvailabilityData>>({});
  const [loading, setLoading] = useState(false);

  // Generate calendar days for current month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fetch availability for selected day
  useEffect(() => {
    if (selectedDay) {
      fetchAvailability(selectedDay);
    }
  }, [selectedDay, caregiverId]);

  const fetchAvailability = async (date: Date) => {
    const dateKey = date.toISOString().split('T')[0];

    // Check cache first
    if (availability[dateKey]) {
      return;
    }

    setLoading(true);
    try {
      const accessToken = await storageService.getAccessToken();

      if (!accessToken) {
        throw new Error('No access token found');
      }

      const endpoint = `${EnvConfig.baseUrl}${ApiEndpoints.caregiver.availability(caregiverId)}?date=${date.toISOString()}`;
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch availability');

      const result = await response.json();
      setAvailability((prev) => ({
        ...prev,
        [dateKey]: result.data,
      }));
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDayClick = (date: Date) => {
    setSelectedDay(date);
  };

  const handleSlotClick = (slot: TimeSlot) => {
    if (slot.status === 'available' && selectedDay) {
      const durationHours = duration / 60;
      onSlotSelect(selectedDay, slot.startTime, duration);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const selectedDayKey = selectedDay?.toISOString().split('T')[0];
  const selectedDayAvailability = selectedDayKey ? availability[selectedDayKey] : null;

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-dark-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-600" />
          Select Date & Time
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPreviousMonth}
            className="w-8 h-8 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="text-sm font-semibold text-dark-700 dark:text-dark-300 min-w-[140px] text-center">
            {monthYear}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextMonth}
            className="w-8 h-8 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-dark-50 dark:bg-dark-900 rounded-2xl p-4">
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-dark-600 dark:text-dark-400 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const isPast = day < today;
            const isToday = day.toDateString() === today.toDateString();
            const isSelected = selectedDay?.toDateString() === day.toDateString();

            return (
              <motion.button
                key={day.toISOString()}
                whileHover={!isPast ? { scale: 1.05 } : {}}
                whileTap={!isPast ? { scale: 0.95 } : {}}
                onClick={() => !isPast && handleDayClick(day)}
                disabled={isPast}
                className={`
                  aspect-square rounded-xl flex items-center justify-center text-sm font-semibold
                  transition-all duration-200
                  ${isPast
                    ? 'text-dark-300 dark:text-dark-700 cursor-not-allowed'
                    : isSelected
                    ? 'bg-primary-500 text-white shadow-lg'
                    : isToday
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'bg-white dark:bg-dark-800 text-dark-900 dark:text-white hover:bg-primary-50 dark:hover:bg-dark-700'
                  }
                `}
              >
                {day.getDate()}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      <AnimatePresence mode="wait">
        {selectedDay && (
          <motion.div
            key={selectedDayKey}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-600" />
              <h4 className="text-base font-bold text-dark-900 dark:text-white">
                Available Time Slots - {selectedDay.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </h4>
            </div>

            {loading ? (
              <div className="bg-dark-50 dark:bg-dark-900 rounded-2xl p-8 flex items-center justify-center">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-dark-600 dark:text-dark-400">Loading availability...</span>
                </div>
              </div>
            ) : selectedDayAvailability && selectedDayAvailability.isWorkingDay ? (
              <div className="bg-dark-50 dark:bg-dark-900 rounded-2xl p-4">
                {selectedDayAvailability.slots.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {selectedDayAvailability.slots.map((slot, index) => {
                      const isSlotSelected = selectedTime === slot.startTime;
                      const canSelect = slot.status === 'available';

                      return (
                        <motion.button
                          key={index}
                          whileHover={canSelect ? { scale: 1.05 } : {}}
                          whileTap={canSelect ? { scale: 0.95 } : {}}
                          onClick={() => handleSlotClick(slot)}
                          disabled={!canSelect}
                          className={`
                            relative p-3 rounded-xl text-sm font-semibold transition-all duration-200
                            ${
                              isSlotSelected
                                ? 'bg-primary-500 text-white shadow-lg ring-2 ring-primary-300'
                                : canSelect
                                ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 cursor-not-allowed opacity-60'
                            }
                          `}
                        >
                          <div className="flex items-center justify-center gap-1.5">
                            {canSelect ? (
                              isSlotSelected ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Clock className="w-4 h-4" />
                              )
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                            <span>{slot.startTime}</span>
                          </div>
                          <div className="text-xs opacity-80 mt-1">
                            {duration / 60}h
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-dark-300 dark:text-dark-700 mx-auto mb-3" />
                    <p className="text-sm text-dark-600 dark:text-dark-400">
                      No time slots available for this day
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-dark-50 dark:bg-dark-900 rounded-2xl p-8 text-center">
                <Calendar className="w-12 h-12 text-dark-300 dark:text-dark-700 mx-auto mb-3" />
                <p className="text-sm text-dark-600 dark:text-dark-400">
                  This caregiver is not available on this day
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900/30" />
          <span className="text-dark-600 dark:text-dark-400">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-100 dark:bg-red-900/30" />
          <span className="text-dark-600 dark:text-dark-400">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary-500" />
          <span className="text-dark-600 dark:text-dark-400">Selected</span>
        </div>
      </div>
    </div>
  );
}
