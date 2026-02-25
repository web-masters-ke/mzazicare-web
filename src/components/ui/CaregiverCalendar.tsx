"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  User,
  DollarSign,
  MapPin,
  CheckCircle,
  AlertCircle,
  Briefcase,
} from 'lucide-react';
import { Button } from './Button';

interface Booking {
  id: string;
  scheduledDate: string;
  duration: number;
  status: string;
  serviceType: string;
  elderlyName?: string;
  address?: string;
  totalAmount?: number;
}

interface AvailabilitySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface CaregiverCalendarProps {
  availability?: AvailabilitySlot[];
  bookings?: Booking[];
  onDateClick?: (date: Date) => void;
}

export function CaregiverCalendar({
  availability = [],
  bookings = [],
  onDateClick,
}: CaregiverCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

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

  // Check if caregiver is available on a specific day
  const isAvailableOnDay = (date: Date) => {
    const dayOfWeek = date.getDay();
    return availability.some(
      (slot) => slot.dayOfWeek === dayOfWeek && slot.isAvailable
    );
  };

  // Get bookings for a specific day
  const getBookingsForDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.scheduledDate).toISOString().split('T')[0];
      return bookingDate === dateStr;
    });
  };

  // Get availability windows for a specific day
  const getAvailabilityWindows = (date: Date) => {
    const dayOfWeek = date.getDay();
    return availability.filter(
      (slot) => slot.dayOfWeek === dayOfWeek && slot.isAvailable
    );
  };

  const handleDayClick = (date: Date) => {
    setSelectedDay(date);
    onDateClick?.(date);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const selectedDayBookings = selectedDay ? getBookingsForDay(selectedDay) : [];
  const selectedDayWindows = selectedDay ? getAvailabilityWindows(selectedDay) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'COMPLETED':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-dark-100 text-dark-700 dark:bg-dark-800 dark:text-dark-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-dark-900 dark:text-white flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary-600" />
          My Schedule
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

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700" />
          <span className="text-dark-600 dark:text-dark-400">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500" />
          <span className="text-dark-600 dark:text-dark-400">Has Bookings</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-dark-200 dark:bg-dark-700" />
          <span className="text-dark-600 dark:text-dark-400">Not Available</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-dark-50 dark:bg-dark-900 rounded-2xl p-4">
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
              const isAvailable = isAvailableOnDay(day);
              const dayBookings = getBookingsForDay(day);
              const hasBookings = dayBookings.length > 0;

              return (
                <motion.button
                  key={day.toISOString()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDayClick(day)}
                  className={`
                    aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-semibold
                    transition-all duration-200 relative
                    ${
                      isSelected
                        ? 'bg-primary-500 text-white shadow-lg ring-2 ring-primary-300'
                        : hasBookings
                        ? 'bg-blue-500 text-white'
                        : isAvailable
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-300 dark:border-green-700'
                        : 'bg-dark-200 dark:bg-dark-700 text-dark-500 dark:text-dark-500'
                    }
                    ${isPast ? 'opacity-50' : ''}
                    ${isToday ? 'ring-2 ring-primary-400' : ''}
                  `}
                >
                  <span>{day.getDate()}</span>
                  {hasBookings && (
                    <div className="absolute bottom-1 flex gap-0.5">
                      {dayBookings.slice(0, 3).map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-white/80'}`}
                        />
                      ))}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Day Details Sidebar */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedDay ? (
              <motion.div
                key={selectedDay.toISOString()}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 p-4 space-y-4"
              >
                <div>
                  <h4 className="text-base font-bold text-dark-900 dark:text-white mb-1">
                    {selectedDay.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </h4>
                  <p className="text-xs text-dark-600 dark:text-dark-400">
                    {selectedDayBookings.length} booking{selectedDayBookings.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Availability Windows */}
                {selectedDayWindows.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-xs font-semibold text-dark-700 dark:text-dark-300">
                        Available Hours
                      </span>
                    </div>
                    <div className="space-y-1">
                      {selectedDayWindows.map((window, idx) => (
                        <div
                          key={idx}
                          className="text-xs px-2 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-700 dark:text-green-400"
                        >
                          {window.startTime} - {window.endTime}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bookings */}
                {selectedDayBookings.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary-600" />
                      <span className="text-xs font-semibold text-dark-700 dark:text-dark-300">
                        Bookings
                      </span>
                    </div>
                    {selectedDayBookings.map((booking) => {
                      const time = new Date(booking.scheduledDate).toTimeString().substring(0, 5);
                      const duration = booking.duration / 60;

                      return (
                        <div
                          key={booking.id}
                          className="p-3 bg-dark-50 dark:bg-dark-800 rounded-xl space-y-2"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-dark-900 dark:text-white">
                                {booking.serviceType?.replace(/_/g, ' ') || 'Service'}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-dark-600 dark:text-dark-400 mt-0.5">
                                <Clock className="w-3 h-3" />
                                {time} ({duration}h)
                              </div>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-lg font-semibold ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </div>

                          {booking.elderlyName && (
                            <div className="flex items-center gap-1.5 text-xs text-dark-600 dark:text-dark-400">
                              <User className="w-3 h-3" />
                              <span>{booking.elderlyName}</span>
                            </div>
                          )}

                          {booking.address && (
                            <div className="flex items-start gap-1.5 text-xs text-dark-600 dark:text-dark-400">
                              <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-1">{booking.address}</span>
                            </div>
                          )}

                          {booking.totalAmount && (
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400">
                              <DollarSign className="w-3 h-3" />
                              <span>KES {booking.totalAmount.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : selectedDayWindows.length > 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                    <p className="text-sm text-dark-600 dark:text-dark-400">
                      No bookings yet
                    </p>
                    <p className="text-xs text-dark-500 dark:text-dark-500 mt-1">
                      You're available for work
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-dark-300 dark:text-dark-700 mx-auto mb-2" />
                    <p className="text-sm text-dark-600 dark:text-dark-400">
                      Day off
                    </p>
                    <p className="text-xs text-dark-500 dark:text-dark-500 mt-1">
                      Not available for bookings
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="no-selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 p-8 text-center"
              >
                <CalendarIcon className="w-12 h-12 text-dark-300 dark:text-dark-700 mx-auto mb-3" />
                <p className="text-sm text-dark-600 dark:text-dark-400">
                  Select a date to view details
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
