"use client";

import { ProtectedRoute } from '@/components/auth';
import { BottomNav } from '@/components/layout/BottomNav';
import { NotificationBanner } from '@/components/NotificationBanner';
import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Button, Spinner } from '@/components/ui';
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
  Clock,
  DollarSign,
  Star,
  Activity,
  Award,
  CheckCircle,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { useEffect } from 'react';

function DashboardContent() {
  const { user, userRole } = useAuth();
  const router = useRouter();
  const { analytics, isLoading, fetchAnalytics } = useAnalytics();

  useEffect(() => {
    // Redirect caregivers to their specific dashboard
    if (userRole === UserRole.CAREGIVER) {
      router.replace('/dashboard/caregiver');
      return;
    }

    fetchAnalytics();
  }, [userRole, router, fetchAnalytics]);

  const firstName = user?.fullName?.split(' ')[0] || 'there';

  // Show loading while redirecting caregivers
  if (userRole === UserRole.CAREGIVER) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-dark-600 dark:text-dark-400 mt-4">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get activity icon and color
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return { icon: Calendar, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' };
      case 'payment':
        return { icon: DollarSign, color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' };
      case 'visit':
        return { icon: CheckCircle, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' };
      case 'review':
        return { icon: Star, color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400' };
      default:
        return { icon: Activity, color: 'bg-dark-100 text-dark-600 dark:bg-dark-800 dark:text-dark-400' };
    }
  };

  // Format relative time
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">
      <NotificationBanner />
      <div className="pb-24 pt-8 px-4 sm:px-6 max-w-7xl mx-auto">
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
                Here's your care overview
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

        {isLoading && !analytics ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : analytics ? (
          <>
            {/* Financial Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              {[
                {
                  label: 'Total Spent',
                  value: formatCurrency(analytics.totalSpent),
                  icon: DollarSign,
                  color: 'bg-green-500',
                  trend: analytics.monthlySpending > 0 ? `+${formatCurrency(analytics.monthlySpending)} this month` : 'No spending this month',
                },
                {
                  label: 'Upcoming',
                  value: analytics.upcomingBookings,
                  icon: Calendar,
                  color: 'bg-blue-500',
                  trend: `${analytics.activeBookings} active`,
                },
                {
                  label: 'Care Hours',
                  value: Math.round(analytics.totalCareHours),
                  icon: Clock,
                  color: 'bg-orange-500',
                  trend: `${Math.round(analytics.monthlyCareHours)}h this month`,
                },
                {
                  label: 'Avg Rating',
                  value: analytics.averageCaregiverRating > 0 ? analytics.averageCaregiverRating.toFixed(1) : 'N/A',
                  icon: Star,
                  color: 'bg-yellow-500',
                  trend: `${analytics.uniqueCaregivers} caregivers`,
                },
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
                    <div className="text-xs sm:text-sm text-dark-600 dark:text-dark-400 font-medium mb-1">
                      {stat.label}
                    </div>
                    <div className="text-xs text-dark-500 dark:text-dark-500">
                      {stat.trend}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - 2/3 width */}
              <div className="lg:col-span-2 space-y-6">
                {/* Spending Trend */}
                {analytics.spendingTrend.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-dark-50 dark:bg-dark-900 rounded-2xl p-6 border border-dark-100 dark:border-dark-800"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-bold text-dark-900 dark:text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary-500" />
                        Spending Trend
                      </h2>
                      <button
                        onClick={() => router.push('/dashboard/wallet')}
                        className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                      >
                        View details
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Simple Bar Chart */}
                    <div className="flex items-end justify-between gap-2 h-40">
                      {analytics.spendingTrend.map((item, index) => {
                        const maxAmount = Math.max(...analytics.spendingTrend.map((i) => i.amount));
                        const height = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;

                        return (
                          <div key={index} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full flex flex-col items-center">
                              <span className="text-xs text-dark-500 dark:text-dark-500 mb-1">
                                {item.amount > 0 ? formatCurrency(item.amount) : ''}
                              </span>
                              <div
                                className="w-full bg-primary-500 rounded-t-lg transition-all hover:bg-primary-600"
                                style={{ height: `${Math.max(height, 2)}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-dark-600 dark:text-dark-400">
                              {item.month}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-dark-50 dark:bg-dark-900 rounded-2xl p-6 border border-dark-100 dark:border-dark-800"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-dark-900 dark:text-white flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary-500" />
                      Recent Activity
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {analytics.recentActivity.length === 0 ? (
                      <p className="text-center py-8 text-dark-600 dark:text-dark-400">
                        No recent activity
                      </p>
                    ) : (
                      analytics.recentActivity.slice(0, 5).map((activity) => {
                        const { icon: Icon, color } = getActivityIcon(activity.type);
                        return (
                          <div
                            key={activity.id}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-dark-800 transition-colors"
                          >
                            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-dark-900 dark:text-white">
                                {activity.title}
                              </h4>
                              <p className="text-xs text-dark-600 dark:text-dark-400 truncate">
                                {activity.description}
                              </p>
                              <p className="text-xs text-dark-500 dark:text-dark-500 mt-1">
                                {formatRelativeTime(activity.timestamp)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.div>

                {/* Top Caregivers */}
                {analytics.topCaregivers.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-dark-50 dark:bg-dark-900 rounded-2xl p-6 border border-dark-100 dark:border-dark-800"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-dark-900 dark:text-white flex items-center gap-2">
                        <Award className="w-5 h-5 text-primary-500" />
                        Top Caregivers
                      </h2>
                      <button
                        onClick={() => router.push('/dashboard/caregivers')}
                        className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                      >
                        View all
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {analytics.topCaregivers.map((caregiver) => (
                        <div
                          key={caregiver.id}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-dark-800 transition-colors cursor-pointer"
                          onClick={() => router.push(`/dashboard/caregivers/${caregiver.id}`)}
                        >
                          {caregiver.photo ? (
                            <img
                              src={caregiver.photo}
                              alt={caregiver.fullName}
                              className="w-12 h-12 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center text-white font-bold">
                              {caregiver.fullName.charAt(0)}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-dark-900 dark:text-white truncate">
                              {caregiver.fullName}
                            </h4>
                            <div className="flex items-center gap-3 mt-1">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                <span className="text-xs text-dark-600 dark:text-dark-400">
                                  {caregiver.rating > 0 ? caregiver.rating.toFixed(1) : 'N/A'}
                                </span>
                              </div>
                              <span className="text-xs text-dark-500 dark:text-dark-500">
                                {caregiver.sessionsCount} sessions
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-dark-400" />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Right Column - 1/3 width */}
              <div className="space-y-4">
                {/* Quick Action - Book Caregiver */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  onClick={() => router.push('/dashboard/caregivers')}
                  className="w-full bg-primary-500 hover:bg-primary-600 rounded-2xl p-6 text-white transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <Plus className="w-6 h-6" />
                    </div>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold mb-1 text-left">Book a Caregiver</h3>
                  <p className="text-sm text-white/80 text-left">
                    Browse verified professionals
                  </p>
                </motion.button>

                {/* Care Overview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-dark-50 dark:bg-dark-900 rounded-2xl p-6 border border-dark-100 dark:border-dark-800"
                >
                  <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-4">
                    Care Overview
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-pink-500" />
                        <span className="text-sm text-dark-600 dark:text-dark-400">
                          Elderly Profiles
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-dark-900 dark:text-white">
                        {analytics.activeElderly} / {analytics.totalElderly}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-dark-600 dark:text-dark-400">
                          Caregivers
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-dark-900 dark:text-white">
                        {analytics.uniqueCaregivers}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-dark-600 dark:text-dark-400">
                          Completed
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-dark-900 dark:text-white">
                        {analytics.completedBookings}
                      </span>
                    </div>
                    {analytics.pendingPayments > 0 && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-orange-500" />
                          <span className="text-sm text-dark-600 dark:text-dark-400">
                            Pending Payments
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                          {formatCurrency(analytics.pendingPayments)}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Quick Links */}
                <div className="space-y-3">
                  {[
                    {
                      name: 'Manage Elderly',
                      icon: Heart,
                      href: '/dashboard/elderly',
                      color: 'bg-pink-500',
                    },
                    {
                      name: 'My Wallet',
                      icon: DollarSign,
                      href: '/dashboard/wallet',
                      color: 'bg-green-500',
                    },
                    {
                      name: 'All Bookings',
                      icon: Calendar,
                      href: '/dashboard/bookings',
                      color: 'bg-blue-500',
                    },
                  ].map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <motion.button
                        key={link.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
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
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-dark-600 dark:text-dark-400">
              No analytics data available
            </p>
          </div>
        )}
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
