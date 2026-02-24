"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth';
import { BottomNav } from '@/components/layout/BottomNav';
import { Button, Badge, Spinner } from '@/components/ui';
import { motion } from 'framer-motion';
import { UserRole } from '@/types/models';
import { useWallet } from '@/hooks/useWallet';
import {
  Wallet,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Calendar,
  DollarSign,
  Phone,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';

function WalletContent() {
  const router = useRouter();
  const {
    wallet,
    transactions,
    isLoading,
    fetchWallet,
    topUpWallet,
    withdrawFromWallet,
    fetchTransactions,
  } = useWallet();

  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'MPESA' | 'BANK'>('MPESA');
  const [withdrawPhone, setWithdrawPhone] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [topUpSuccess, setTopUpSuccess] = useState(false);
  const [topUpError, setTopUpError] = useState<string | null>(null);

  const quickAmounts = [500, 1000, 2000, 5000];

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, []);

  const handleTopUp = async () => {
    if (!topUpAmount || Number(topUpAmount) < 100) {
      alert('Please enter a valid amount (minimum KES 100)');
      return;
    }

    if (!phoneNumber || !phoneNumber.match(/^(\+254|0)[17]\d{8}$/)) {
      alert('Please enter a valid Kenyan phone number');
      return;
    }

    setIsProcessing(true);
    setTopUpError(null);
    setTopUpSuccess(false);

    try {
      // Format phone number to start with +254
      let formattedPhone = phoneNumber;
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '+254' + formattedPhone.substring(1);
      } else if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+254' + formattedPhone;
      }

      const response = await topUpWallet({
        phoneNumber: formattedPhone,
        amount: Number(topUpAmount),
      });

      setTopUpSuccess(true);
      setTopUpAmount('');

      // Show success message
      alert(`M-Pesa STK Push sent! Please check your phone and enter your M-Pesa PIN.\n\nCheckout Request ID: ${response.checkoutRequestId}`);

      setShowTopUpModal(false);

      // Refresh wallet and transactions after a delay to allow for callback processing
      setTimeout(() => {
        fetchWallet();
        fetchTransactions();
      }, 5000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to initiate top-up';
      setTopUpError(errorMessage);
      alert(`Top-up failed: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || Number(withdrawAmount) < 100) {
      alert('Please enter a valid amount (minimum KES 100)');
      return;
    }

    if (!wallet || Number(withdrawAmount) > wallet.balance) {
      alert('Insufficient balance');
      return;
    }

    if (withdrawMethod === 'MPESA') {
      if (!withdrawPhone || !withdrawPhone.match(/^(\+254|0)[17]\d{8}$/)) {
        alert('Please enter a valid Kenyan phone number');
        return;
      }
    }

    setIsProcessing(true);

    try {
      // Format phone number to start with +254
      let formattedPhone = withdrawPhone;
      if (withdrawMethod === 'MPESA') {
        if (formattedPhone.startsWith('0')) {
          formattedPhone = '+254' + formattedPhone.substring(1);
        } else if (!formattedPhone.startsWith('+')) {
          formattedPhone = '+254' + formattedPhone;
        }
      }

      const response = await withdrawFromWallet({
        amount: Number(withdrawAmount),
        method: withdrawMethod,
        phoneNumber: withdrawMethod === 'MPESA' ? formattedPhone : undefined,
      });

      alert(`Withdrawal initiated successfully!\n\n${response.message}\n\nTransaction ID: ${response.transactionId}`);

      setWithdrawAmount('');
      setWithdrawPhone('');
      setShowWithdrawModal(false);
    } catch (error: any) {
      console.error('Withdrawal error:', error);
      alert(error.response?.data?.message || error.message || 'Failed to process withdrawal. Please try again.');
    } finally {
      setIsProcessing(false);
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
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-1">
            Wallet
          </h1>
          <p className="text-dark-600 dark:text-dark-400">
            Manage your balance and transactions
          </p>
        </motion.div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl mb-6"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500" />
          <div className="relative p-8 text-white">
            {isLoading && !wallet ? (
              <div className="flex items-center justify-center py-12">
                <Spinner size="lg" className="text-white" />
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-white/80 mb-2 flex items-center gap-2">
                      Available Balance
                    </p>
                    <h2 className="text-5xl font-bold">
                      KES {wallet?.balance?.toLocaleString() || '0.00'}
                    </h2>
                    <p className="text-white/60 text-sm mt-2">
                      {wallet?.currency || 'KES'}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Wallet className="w-8 h-8" />
                  </div>
                </div>
              </>
            )}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTopUpModal(true)}
                className="flex-1 px-6 py-3 rounded-2xl bg-white/20 border border-white/20 text-white flex items-center justify-center gap-2 hover:bg-white/30 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Top Up
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowWithdrawModal(true)}
                className="flex-1 px-6 py-3 rounded-2xl bg-white/20 border border-white/20 text-white flex items-center justify-center gap-2 hover:bg-white/30 transition-colors"
              >
                <ArrowUpRight className="w-5 h-5" />
                Withdraw
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-50 dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800"
        >
          <div className="p-6 border-b border-dark-100 dark:border-dark-800">
            <h2 className="text-xl font-bold text-dark-900 dark:text-white">
              Transaction History
            </h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Wallet className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-dark-900 dark:text-white mb-2">
                No transactions yet
              </h3>
              <p className="text-dark-600 dark:text-dark-400">
                Your transaction history will appear here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-dark-100 dark:divide-dark-800">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="p-6 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        transaction.type === 'credit'
                          ? 'bg-green-100 dark:bg-green-900/20'
                          : 'bg-red-100 dark:bg-red-900/20'
                      }`}>
                        {transaction.type === 'credit' ? (
                          <ArrowDownLeft className="w-6 h-6 text-green-600 dark:text-green-400" />
                        ) : (
                          <ArrowUpRight className="w-6 h-6 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-dark-900 dark:text-white">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-dark-600 dark:text-dark-400 flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                        {transaction.mpesaRef && (
                          <p className="text-xs text-dark-500 dark:text-dark-500 mt-1">
                            M-Pesa Ref: {transaction.mpesaRef}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        transaction.type === 'credit'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}
                        KES {transaction.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-dark-500 dark:text-dark-500 mt-1">
                        Balance: KES {transaction.balanceAfter.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Top Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 max-w-md w-full"
          >
            <div className="p-6">
              <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-4">
                Top Up Wallet via M-Pesa
              </h3>

              {topUpError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-400">{topUpError}</p>
                </div>
              )}

              {topUpSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/20 flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700 dark:text-green-400">
                    M-Pesa STK Push sent! Check your phone.
                  </p>
                </div>
              )}

              {/* Phone Number */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  M-Pesa Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0712345678 or +254712345678"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <p className="text-xs text-dark-500 dark:text-dark-500 mt-1">
                  Enter the Safaricom number to receive the STK push
                </p>
              </div>

              {/* Quick Amounts */}
              <div className="mb-4">
                <p className="text-sm text-dark-600 dark:text-dark-400 mb-2">Quick amounts</p>
                <div className="grid grid-cols-4 gap-2">
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setTopUpAmount(amount.toString())}
                      className={`px-4 py-2 rounded-xl border transition-colors ${
                        topUpAmount === amount.toString()
                          ? 'bg-primary-500 border-primary-500 text-white'
                          : 'border-dark-200 dark:border-dark-700 text-dark-900 dark:text-white hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-500'
                      }`}
                    >
                      {amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Amount (KES) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    placeholder="Minimum KES 100"
                    min="100"
                    max="100000"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <p className="text-xs text-dark-500 dark:text-dark-500 mt-1">
                  Min: KES 100 • Max: KES 100,000
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowTopUpModal(false);
                    setTopUpError(null);
                    setTopUpSuccess(false);
                  }}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleTopUp}
                  disabled={isProcessing || !topUpAmount || !phoneNumber}
                  className="flex-1"
                  leftIcon={isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : undefined}
                >
                  {isProcessing ? 'Processing...' : 'Send STK Push'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-dark-900 rounded-2xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-4">
              Withdraw Funds
            </h3>

            <div className="space-y-4">
              {/* Withdrawal Method */}
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Withdrawal Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('MPESA')}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      withdrawMethod === 'MPESA'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-dark-200 dark:border-dark-700'
                    }`}
                  >
                    <span className="font-medium text-dark-900 dark:text-white">M-Pesa</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('BANK')}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      withdrawMethod === 'BANK'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-dark-200 dark:border-dark-700'
                    }`}
                  >
                    <span className="font-medium text-dark-900 dark:text-white">Bank Transfer</span>
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Amount (KES)
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full p-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-xs text-dark-500 mt-1">
                  Available balance: KES {wallet?.balance?.toLocaleString() || '0'}
                </p>
              </div>

              {/* Phone Number (M-Pesa only) */}
              {withdrawMethod === 'MPESA' && (
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    M-Pesa Phone Number
                  </label>
                  <input
                    type="tel"
                    value={withdrawPhone}
                    onChange={(e) => setWithdrawPhone(e.target.value)}
                    placeholder="0712345678"
                    className="w-full p-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              )}

              {/* Bank Transfer Note */}
              {withdrawMethod === 'BANK' && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-900/20">
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    Bank transfers typically take 1-3 business days to process. Our support team will contact you for your bank details.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowWithdrawModal(false);
                  setWithdrawAmount('');
                  setWithdrawPhone('');
                }}
                disabled={isProcessing}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleWithdraw}
                disabled={isProcessing || !withdrawAmount}
                className="flex-1"
                leftIcon={isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : undefined}
              >
                {isProcessing ? 'Processing...' : 'Withdraw'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

export default function WalletPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.FAMILY_USER]}>
      <WalletContent />
    </ProtectedRoute>
  );
}
