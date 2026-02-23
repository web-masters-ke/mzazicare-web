"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth';
import { BottomNav } from '@/components/layout/BottomNav';
import { Button, Badge, StatCard } from '@/components/ui';
import { motion } from 'framer-motion';
import { UserRole } from '@/types/models';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Clock,
  Download,
  ArrowUpRight,
  CheckCircle,
} from 'lucide-react';

function EarningsContent() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  // Mock earnings data
  const stats = [
    {
      name: 'Total Earnings',
      value: 'KES 45,280',
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+15.3%',
    },
    {
      name: 'This Month',
      value: 'KES 12,450',
      icon: TrendingUp,
      color: 'bg-blue-500',
      change: '+8.2%',
    },
    {
      name: 'Jobs Completed',
      value: '28',
      icon: CheckCircle,
      color: 'bg-purple-500',
      change: '+12',
    },
    {
      name: 'Avg Hourly Rate',
      value: 'KES 650',
      icon: Clock,
      color: 'bg-orange-500',
      change: '+5.1%',
    },
  ];

  const earnings = [
    {
      id: '1',
      bookingId: 'BK-2024-001',
      clientName: 'Mary Smith',
      elderlyName: 'John Smith',
      date: '2026-02-20',
      hours: 4,
      rate: 600,
      amount: 2400,
      status: 'paid',
    },
    {
      id: '2',
      bookingId: 'BK-2024-002',
      clientName: 'Jane Doe',
      elderlyName: 'Alice Doe',
      date: '2026-02-18',
      hours: 6,
      rate: 650,
      amount: 3900,
      status: 'paid',
    },
    {
      id: '3',
      bookingId: 'BK-2024-003',
      clientName: 'Robert Johnson',
      elderlyName: 'Margaret Johnson',
      date: '2026-02-15',
      hours: 5,
      rate: 600,
      amount: 3000,
      status: 'pending',
    },
    {
      id: '4',
      bookingId: 'BK-2024-004',
      clientName: 'Sarah Wilson',
      elderlyName: 'Thomas Wilson',
      date: '2026-02-12',
      hours: 3,
      rate: 650,
      amount: 1950,
      status: 'paid',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'processing':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">
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
              onClick={() => alert('Export feature coming soon!')}
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
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {stat.change}
                  </span>
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
                {earnings.map((earning) => (
                  <tr
                    key={earning.id}
                    className="hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-dark-900 dark:text-white">
                          {earning.bookingId}
                        </p>
                        <p className="text-xs text-dark-600 dark:text-dark-400">
                          {earning.elderlyName}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-dark-900 dark:text-white">
                        {earning.clientName}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-dark-900 dark:text-white">
                        {new Date(earning.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-dark-900 dark:text-white">
                        {earning.hours}h
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-dark-900 dark:text-white">
                        KES {earning.rate}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-dark-900 dark:text-white">
                        KES {earning.amount.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(earning.status)}>
                        {earning.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-dark-100 dark:border-dark-800 flex items-center justify-between">
              <p className="text-sm text-dark-600 dark:text-dark-400">
                Showing 1 to {earnings.length} of {earnings.length} entries
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
                Next Payout
              </h3>
              <p className="text-dark-700 dark:text-dark-300 mb-4">
                Your next payout of <strong>KES 3,000</strong> is scheduled for{' '}
                <strong>March 1, 2026</strong>. Payouts are processed on the 1st and 15th of each month.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push('/dashboard/settings')}
                rightIcon={<ArrowUpRight className="w-4 h-4" />}
              >
                Update Payout Method
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
