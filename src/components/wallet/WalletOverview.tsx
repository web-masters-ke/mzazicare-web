"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  Shield,
  ArrowRight,
  DollarSign,
  Activity,
  Zap,
} from 'lucide-react';
import { walletRepository } from '@/repositories/wallet.repository';

interface WalletOverviewProps {
  onTopUp?: () => void;
}

export function WalletOverview({ onTopUp }: WalletOverviewProps) {
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    try {
      setLoading(true);
      const data = await walletRepository.getWalletOverview();
      setOverview(data);
    } catch (error) {
      console.error('[WalletOverview] Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-primary-200 dark:border-primary-900"></div>
          <div className="w-16 h-16 rounded-full border-4 border-t-primary-500 animate-spin absolute top-0"></div>
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="text-center py-12 bg-white dark:bg-dark-900 rounded-3xl">
        <p className="text-dark-600 dark:text-dark-400">Failed to load wallet overview</p>
      </div>
    );
  }

  const mainStats = [
    {
      label: 'Available Balance',
      value: `KES ${overview.balance.toLocaleString()}`,
      icon: Wallet,
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      iconBg: 'bg-green-500',
      change: null,
    },
    {
      label: 'Held in Escrow',
      value: `KES ${(overview.escrowStats.totalHeld + overview.escrowStats.totalPendingRelease).toLocaleString()}`,
      icon: Shield,
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
      iconBg: 'bg-blue-500',
      subtitle: `${overview.escrowStats.activeEscrows} active`,
      change: null,
    },
  ];

  const secondaryStats = [
    {
      label: 'Pending Release',
      value: `KES ${overview.escrowStats.totalPendingRelease.toLocaleString()}`,
      icon: Clock,
      color: 'text-dark-900 dark:text-white',
      bgColor: 'bg-white dark:bg-dark-800',
      iconBg: 'bg-primary-100 dark:bg-primary-900/20',
      iconColor: 'text-primary-600 dark:text-primary-400',
    },
    {
      label: 'Monthly Spending',
      value: `KES ${overview.monthlySpending.toLocaleString()}`,
      icon: TrendingDown,
      color: 'text-dark-900 dark:text-white',
      bgColor: 'bg-white dark:bg-dark-800',
      iconBg: 'bg-primary-100 dark:bg-primary-900/20',
      iconColor: 'text-primary-600 dark:text-primary-400',
    },
  ];

  if (overview.escrowStats.totalDisputed > 0) {
    secondaryStats.push({
      label: 'Disputed',
      value: `KES ${overview.escrowStats.totalDisputed.toLocaleString()}`,
      icon: AlertTriangle,
      color: 'text-dark-900 dark:text-white',
      bgColor: 'bg-white dark:bg-dark-800',
      iconBg: 'bg-red-100 dark:bg-red-900/20',
      iconColor: 'text-red-600 dark:text-red-400',
    });
  }

  return (
    <div className="space-y-6">
      {/* Main Stats - Large Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mainStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${stat.bgGradient} p-8 shadow-xl border border-white/50 dark:border-dark-700/50`}>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 dark:bg-white/5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />

                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="text-sm font-medium text-dark-600 dark:text-dark-400 mb-2">
                        {stat.label}
                      </p>
                      <p className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                        {stat.value}
                      </p>
                      {stat.subtitle && (
                        <p className="text-xs text-dark-500 mt-2 flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          {stat.subtitle}
                        </p>
                      )}
                    </div>
                    <div className={`w-16 h-16 rounded-2xl ${stat.iconBg} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Secondary Stats - Compact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {secondaryStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className={`relative overflow-hidden rounded-2xl ${stat.bgColor} p-6 shadow-lg border border-dark-100 dark:border-dark-700`}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
                <p className="text-sm text-dark-600 dark:text-dark-400 mb-1">
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Low Balance Alert */}
      {overview.balance < 500 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 p-6 shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-lg mb-1">
                  Low Balance Alert
                </p>
                <p className="text-white/90 text-sm">
                  Top up your wallet to continue booking services seamlessly
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onTopUp}
              className="px-6 py-3 bg-white text-orange-600 rounded-xl font-bold hover:shadow-xl transition-all flex items-center gap-2"
            >
              Top Up
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Recent Activity Preview */}
      {overview.recentTransactions && overview.recentTransactions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-dark-900 rounded-3xl p-6 shadow-xl border border-dark-100 dark:border-dark-800"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-dark-900 dark:text-white flex items-center gap-3">
              <Activity className="w-6 h-6 text-primary-500" />
              Recent Activity
            </h3>
            <span className="text-sm text-dark-500">
              Last {overview.recentTransactions.length} transactions
            </span>
          </div>
          <div className="space-y-3">
            {overview.recentTransactions.slice(0, 3).map((tx: any, i: number) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl bg-dark-50 dark:bg-dark-800 hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tx.type === 'credit'
                      ? 'bg-green-100 dark:bg-green-900/20'
                      : 'bg-red-100 dark:bg-red-900/20'
                  }`}>
                    <DollarSign className={`w-5 h-5 ${
                      tx.type === 'credit'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`} />
                  </div>
                  <div>
                    <p className="font-semibold text-dark-900 dark:text-white text-sm">
                      {tx.description}
                    </p>
                    <p className="text-xs text-dark-500">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className={`font-bold ${
                  tx.type === 'credit'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {tx.type === 'credit' ? '+' : '-'}{Number(tx.amount).toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
