"use client";

import { ProtectedRoute } from '@/components/auth';
import { BottomNav } from '@/components/layout/BottomNav';
import { NotificationBanner } from '@/components/NotificationBanner';
import { useAuth } from '@/hooks/useAuth';
import { useBookings } from '@/hooks/useBookings';
import { Button } from '@/components/ui';
import { motion } from 'framer-motion';
import { UserRole } from '@/types/models';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  TrendingUp,
  Heart,
  Users,
  ArrowRight,
  Plus,
  Sparkles,
  Clock,
  DollarSign,
  Star,
} from 'lucide-react';
import { useEffect } from 'react';

function DashboardContent() {
  const { user, userRole } = useAuth();
  const router = useRouter();
  const { bookings, fetchBookings, upcomingBookings } = useBookings();

  useEffect(() => {
    fetchBookings();
  }, []);

  const firstName = user?.fullName?.split(' ')[0] || 'there';

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">
      <NotificationBanner />
      <div className="pb-24 pt-8 px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-dark-900 dark:text-white mb-1">
                Hey, {firstName} 👋
              </h1>
              <p className="text-dark-600 dark:text-dark-400">
                {userRole === UserRole.FAMILY_USER ? "Let's find the perfect care" : "Ready to make a difference today?"}
              </p>
            </div>

            <button
              onClick={() => router.push('/dashboard/settings')}
              className="w-12 h-12 rounded-2xl bg-dark-100 dark:bg-dark-800 flex items-center justify-center hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors"
            >
              <div className="w-8 h-8 bg-primary-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                {firstName.charAt(0).toUpperCase()}
              </div>
            </button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {[
            { label: 'Total', value: bookings.length, icon: Calendar, color: 'bg-blue-500' },
            { label: 'Upcoming', value: upcomingBookings.length, icon: Clock, color: 'bg-orange-500' },
            { label: 'This Month', value: 'KES 2.4K', icon: DollarSign, color: 'bg-green-500' },
            { label: 'Rating', value: '4.9', icon: Star, color: 'bg-yellow-500' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-dark-50 dark:bg-dark-900 rounded-2xl p-4 sm:p-5 border border-dark-100 dark:border-dark-800"
              >
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-dark-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-dark-600 dark:text-dark-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Main Content - Two Column on Desktop */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Wider */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Bookings - Modern List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-dark-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary-500" />
                  Upcoming Sessions
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/dashboard/bookings')}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="text-primary-600 hover:text-primary-700"
                >
                  See all
                </Button>
              </div>

              <div className="space-y-3">
                {upcomingBookings.length === 0 ? (
                  <div className="bg-dark-50 dark:bg-dark-900 rounded-2xl p-12 text-center border border-dark-100 dark:border-dark-800">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                      <Calendar className="w-10 h-10 text-primary-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-2">
                      No upcoming bookings
                    </h3>
                    <p className="text-dark-600 dark:text-dark-400 mb-6">
                      {userRole === UserRole.FAMILY_USER
                        ? "Start by finding a caregiver"
                        : "Browse available jobs"}
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => router.push(userRole === UserRole.FAMILY_USER ? '/dashboard/caregivers' : '/dashboard/jobs')}
                    >
                      {userRole === UserRole.FAMILY_USER ? 'Find Caregivers' : 'Browse Jobs'}
                    </Button>
                  </div>
                ) : (
                  upcomingBookings.slice(0, 3).map((booking, index) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      onClick={() => router.push(`/dashboard/bookings/${booking.id}`)}
                      className="bg-dark-50 dark:bg-dark-900 rounded-2xl p-5 border border-dark-100 dark:border-dark-800 hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-primary-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {booking.elderly?.firstName?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-dark-900 dark:text-white truncate">
                            {booking.elderly?.firstName} {booking.elderly?.lastName}
                          </h4>
                          <p className="text-sm text-dark-600 dark:text-dark-400">
                            {booking.scheduledStartTime && new Date(booking.scheduledStartTime).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-dark-400" />
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-4">
            {/* Quick Action Button */}
            <button
              onClick={() => router.push(userRole === UserRole.FAMILY_USER ? '/dashboard/caregivers' : '/dashboard/jobs')}
              className="w-full bg-primary-500 hover:bg-primary-600 rounded-2xl p-6 text-white transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Plus className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-1">
                {userRole === UserRole.FAMILY_USER ? 'Book a Caregiver' : 'Find a Job'}
              </h3>
              <p className="text-sm text-white/80">
                {userRole === UserRole.FAMILY_USER ? 'Browse verified professionals' : 'Explore opportunities'}
              </p>
            </button>

            {/* Quick Links */}
            {userRole === UserRole.FAMILY_USER && (
              <div className="space-y-3">
                {[
                  { name: 'Manage Elderly', icon: Heart, href: '/dashboard/elderly', color: 'bg-pink-500' },
                  { name: 'My Wallet', icon: DollarSign, href: '/dashboard/wallet', color: 'bg-green-500' },
                ].map((link) => {
                  const Icon = link.icon;
                  return (
                    <button
                      key={link.name}
                      onClick={() => router.push(link.href)}
                      className="w-full bg-dark-50 dark:bg-dark-900 rounded-2xl p-4 border border-dark-100 dark:border-dark-800 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${link.color} flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="flex-1 text-left font-medium text-dark-900 dark:text-white">
                          {link.name}
                        </span>
                        <ArrowRight className="w-4 h-4 text-dark-400" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
