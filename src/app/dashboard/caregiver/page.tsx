"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth';
import { DashboardNav } from '@/components/layout/DashboardNav';
import { BottomNav } from '@/components/layout/BottomNav';
import { useAuth } from '@/hooks/useAuth';
import { Button, Spinner } from '@/components/ui';
import { motion } from 'framer-motion';
import { UserRole } from '@/types/models';
import {
  Calendar,
  DollarSign,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  MapPin,
  Users,
  Briefcase,
  Award,
  ArrowRight,
} from 'lucide-react';

function CaregiverDashboardContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    completedJobs: 0,
    upcomingJobs: 0,
    totalEarnings: 0,
    availableBalance: 0,
    rating: 0,
    totalReviews: 0,
  });

  useEffect(() => {
    loadCaregiverStats();
  }, []);

  const loadCaregiverStats = async () => {
    try {
      // TODO: Fetch real stats from API
      setStats({
        totalJobs: 24,
        completedJobs: 18,
        upcomingJobs: 3,
        totalEarnings: 45000,
        availableBalance: 12500,
        rating: 4.8,
        totalReviews: 15,
      });
    } catch (error) {
      console.error('Failed to load caregiver stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const firstName = user?.fullName?.split(' ')[0] || 'Caregiver';

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">
      <DashboardNav />

      <div className="pb-24 pt-8 px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-dark-900 dark:text-white mb-2">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-dark-600 dark:text-dark-400">
            Ready to make a difference today?
          </p>
        </motion.div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {[
            {
              label: 'Total Jobs',
              value: stats.totalJobs,
              icon: Briefcase,
              color: 'bg-blue-500',
            },
            {
              label: 'Completed',
              value: stats.completedJobs,
              icon: CheckCircle,
              color: 'bg-green-500',
            },
            {
              label: 'Upcoming',
              value: stats.upcomingJobs,
              icon: Clock,
              color: 'bg-orange-500',
            },
            {
              label: 'Rating',
              value: stats.rating.toFixed(1),
              icon: Star,
              color: 'bg-yellow-500',
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
                <div
                  className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}
                >
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

        {/* Earnings Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl p-6 sm:p-8 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm mb-1">Total Earnings</p>
              <h2 className="text-4xl font-bold text-white">
                KES {stats.totalEarnings.toLocaleString()}
              </h2>
            </div>
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-white/20">
            <div>
              <p className="text-white/80 text-sm mb-1">Available Balance</p>
              <p className="text-2xl font-bold text-white">
                KES {stats.availableBalance.toLocaleString()}
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push('/dashboard/earnings')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Withdraw
            </Button>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => router.push('/dashboard/bookings')}
            className="bg-dark-50 dark:bg-dark-900 rounded-2xl p-6 border border-dark-100 dark:border-dark-800 hover:border-primary-500 dark:hover:border-primary-500 transition-all group text-left"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-xl flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                <Calendar className="w-6 h-6 text-primary-600 dark:text-primary-400 group-hover:text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-dark-400 group-hover:text-primary-500 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-1">
              My Schedule
            </h3>
            <p className="text-sm text-dark-600 dark:text-dark-400">
              View upcoming appointments
            </p>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            onClick={() => router.push('/dashboard/earnings')}
            className="bg-dark-50 dark:bg-dark-900 rounded-2xl p-6 border border-dark-100 dark:border-dark-800 hover:border-accent-500 dark:hover:border-accent-500 transition-all group text-left"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/20 rounded-xl flex items-center justify-center group-hover:bg-accent-500 transition-colors">
                <DollarSign className="w-6 h-6 text-accent-600 dark:text-accent-400 group-hover:text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-dark-400 group-hover:text-accent-500 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-1">
              My Earnings
            </h3>
            <p className="text-sm text-dark-600 dark:text-dark-400">
              View earnings and withdraw funds
            </p>
          </motion.button>
        </div>

        {/* Profile Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-dark-50 dark:bg-dark-900 rounded-2xl p-6 border border-dark-100 dark:border-dark-800 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-dark-900 dark:text-white">
              Profile Status
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard/profile')}
            >
              View Profile
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-white dark:bg-dark-800 rounded-xl">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-dark-900 dark:text-white">
                  Profile Complete
                </span>
              </div>
              <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                100%
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-white dark:bg-dark-800 rounded-xl">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-medium text-dark-900 dark:text-white">
                  Verification Status
                </span>
              </div>
              <span className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
                Pending
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-white dark:bg-dark-800 rounded-xl">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium text-dark-900 dark:text-white">
                  Reviews
                </span>
              </div>
              <span className="text-xs text-dark-600 dark:text-dark-400 font-semibold">
                {stats.rating.toFixed(1)} ({stats.totalReviews})
              </span>
            </div>
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/20"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-2">
                Need Help?
              </h3>
              <p className="text-sm text-dark-600 dark:text-dark-400 mb-4">
                Check out our caregiver resources and support center
              </p>
              <Button variant="primary" size="sm">
                Get Support
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}

export default function CaregiverDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.CAREGIVER]}>
      <CaregiverDashboardContent />
    </ProtectedRoute>
  );
}
