"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth';
import { BottomNav } from '@/components/layout/BottomNav';
import { DashboardNav } from '@/components/layout/DashboardNav';
import { Button, Badge, Spinner } from '@/components/ui';
import { motion } from 'framer-motion';
import { UserRole } from '@/types/models';
import toast from 'react-hot-toast';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Clock,
  Download,
  ArrowUpRight,
  CheckCircle,
} from 'lucide-react';
import { caregiverRepository } from '@/repositories/caregiver.repository';
import { useBookings } from '@/hooks/useBookings';

interface EarningsData {
  totalEarnings: string | number;
  availableBalance: string | number;
  thisWeek: {
    amount: number;
    jobs: number;
  };
  thisMonth: {
    amount: number;
    jobs: number;
  };
  allTime: {
    amount: number;
    jobs: number;
  };
}

function EarningsContent() {
  const router = useRouter();
  const { bookings, fetchBookings, isLoading: bookingsLoading } = useBookings();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEarningsData();
    fetchBookings();
  }, []);

  const loadEarningsData = async () => {
    setIsLoading(true);
    try {
      const data = await caregiverRepository.getEarnings();
      setEarnings(data);
    } catch (error) {
      console.error('Failed to load earnings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate stats based on real data
  const calculateStats = () => {
    if (!earnings) return [];

    const periodData = selectedPeriod === 'week'
      ? earnings.thisWeek
      : selectedPeriod === 'month'
      ? earnings.thisMonth
      : earnings.allTime;

    const totalEarnings = typeof earnings.totalEarnings === 'string'
      ? parseFloat(earnings.totalEarnings)
      : earnings.totalEarnings;

    const availableBalance = typeof earnings.availableBalance === 'string'
      ? parseFloat(earnings.availableBalance)
      : earnings.availableBalance;

    // Calculate average hourly rate (rough estimate based on completed jobs)
    const avgHourlyRate = earnings.allTime.jobs > 0
      ? Math.round(earnings.allTime.amount / (earnings.allTime.jobs * 4)) // Assuming avg 4 hours per job
      : 0;

    return [
      {
        name: 'Total Earnings',
        value: `KES ${totalEarnings.toLocaleString()}`,
        icon: DollarSign,
        color: 'bg-green-500',
        change: '',
      },
      {
        name: `This ${selectedPeriod}`,
        value: `KES ${periodData.amount.toLocaleString()}`,
        icon: TrendingUp,
        color: 'bg-blue-500',
        change: '',
      },
      {
        name: 'Jobs Completed',
        value: earnings.allTime.jobs.toString(),
        icon: CheckCircle,
        color: 'bg-purple-500',
        change: '',
      },
      {
        name: 'Available Balance',
        value: `KES ${availableBalance.toLocaleString()}`,
        icon: Clock,
        color: 'bg-orange-500',
        change: '',
      },
    ];
  };

  const stats = calculateStats();

  // Filter completed bookings with payment or escrow info
  const completedBookingsWithPayments = bookings.filter(
    (booking) => booking.status === 'COMPLETED' && (booking.payment || booking.escrow)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'RELEASED':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
      case 'HELD':
      case 'PENDING_RELEASE':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'processing':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'DISPUTED':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  // Helper to get payment status and amount
  const getPaymentInfo = (booking: typeof bookings[0]) => {
    let amount = 0;
    let status = 'pending';

    if (booking.escrow) {
      amount = Number(booking.caregiverAmount) || Number(booking.escrow.amount) || 0;
      status = booking.escrow.status;
    } else if (booking.payment) {
      amount = Number(booking.payment.amount) || 0;
      status = booking.payment.status;
    } else {
      amount = Number(booking.caregiverAmount) || 0;
    }

    return { amount, status };
  };

  if (isLoading || bookingsLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-950">
        <DashboardNav />
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" />
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!earnings) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-950">
        <DashboardNav />
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-dark-600 dark:text-dark-400 mb-4">Failed to load earnings data</p>
          <Button onClick={loadEarningsData}>Try Again</Button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">
      <DashboardNav />
      <div className="relative pb-24 pt-8 px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-1">
                Earnings
              </h1>
              <p className="text-dark-600 dark:text-dark-400">
                Track your income and payments
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => toast('Export feature coming soon!', { icon: '🚧' })}
              leftIcon={<Download className="w-5 h-5" />}
              className="mt-4 sm:mt-0"
            >
              Export Report
            </Button>
          </div>

          {/* Period Selector */}
          <div className="flex gap-2">
            {(['week', 'month', 'year'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-2xl capitalize transition-colors ${
                  selectedPeriod === period
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-50 dark:bg-dark-900 text-dark-700 dark:text-dark-300 border border-dark-200 dark:border-dark-800'
                }`}
              >
                This {period}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="bg-dark-50 dark:bg-dark-900 rounded-2xl p-5 border border-dark-100 dark:border-dark-800"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-2xl`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {stat.change && (
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {stat.change}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-dark-900 dark:text-white mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-dark-600 dark:text-dark-400">{stat.name}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Earnings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-50 dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 overflow-hidden mb-6"
        >
          <div className="p-6 border-b border-dark-100 dark:border-dark-800">
            <h2 className="text-xl font-bold text-dark-900 dark:text-white">
              Payment History
            </h2>
          </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-100 dark:bg-dark-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-600 dark:text-dark-400 uppercase tracking-wider">
                    Booking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-600 dark:text-dark-400 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-600 dark:text-dark-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-600 dark:text-dark-400 uppercase tracking-wider">
                    Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-600 dark:text-dark-400 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-600 dark:text-dark-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-600 dark:text-dark-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-100 dark:divide-dark-800">
                {completedBookingsWithPayments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <p className="text-dark-600 dark:text-dark-400">
                        No payment history yet. Complete jobs to see earnings here.
                      </p>
                    </td>
                  </tr>
                ) : (
                  completedBookingsWithPayments.map((booking) => {
                    const paymentInfo = getPaymentInfo(booking);
                    const durationHours = Math.round(booking.duration / 60);
                    const hourlyRate = durationHours > 0 ? Math.round(paymentInfo.amount / durationHours) : 0;

                    return (
                      <tr
                        key={booking.id}
                        className="hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors cursor-pointer"
                        onClick={() => router.push(`/dashboard/bookings/${booking.id}`)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-dark-900 dark:text-white">
                              {booking.id.slice(0, 8)}
                            </p>
                            <p className="text-xs text-dark-600 dark:text-dark-400">
                              {booking.elderly?.fullName || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm text-dark-900 dark:text-white">
                            {booking.user?.fullName || 'Unknown'}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm text-dark-900 dark:text-white">
                            {new Date(booking.scheduledDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm text-dark-900 dark:text-white">
                            {durationHours}h
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm text-dark-900 dark:text-white">
                            KES {hourlyRate.toLocaleString()}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm font-semibold text-dark-900 dark:text-white">
                            KES {paymentInfo.amount.toLocaleString()}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getStatusColor(paymentInfo.status)}>
                            {paymentInfo.status}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-dark-100 dark:border-dark-800 flex items-center justify-between">
              <p className="text-sm text-dark-600 dark:text-dark-400">
                Showing 1 to {completedBookingsWithPayments.length} of {completedBookingsWithPayments.length} entries
              </p>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="ghost" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
        </motion.div>

        {/* Payout Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-dark-50 dark:bg-dark-900 rounded-2xl p-6 border border-dark-100 dark:border-dark-800"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-2">
                Request Payout
              </h3>
              <p className="text-dark-700 dark:text-dark-300 mb-4">
                Your available balance is{' '}
                <strong>
                  KES {(typeof earnings.availableBalance === 'string'
                    ? parseFloat(earnings.availableBalance)
                    : earnings.availableBalance).toLocaleString()}
                </strong>.
                {' '}Payouts are processed within 24 hours and require a minimum balance of KES 100.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const balance = typeof earnings.availableBalance === 'string'
                    ? parseFloat(earnings.availableBalance)
                    : earnings.availableBalance;
                  if (balance < 100) {
                    toast.error('Minimum payout amount is KES 100. Complete more jobs to reach the minimum.');
                  } else {
                    router.push('/dashboard/payout');
                  }
                }}
                rightIcon={<ArrowUpRight className="w-4 h-4" />}
              >
                Request Payout
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}

export default function EarningsPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.CAREGIVER]}>
      <EarningsContent />
    </ProtectedRoute>
  );
}
