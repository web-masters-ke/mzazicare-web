"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth';
import { BottomNav } from '@/components/layout/BottomNav';
import { Button, Spinner } from '@/components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole } from '@/types/models';
import { useWallet } from '@/hooks/useWallet';
import toast from 'react-hot-toast';
import { PaymentStatusModal } from '@/components/wallet/PaymentStatusModal';
import { WalletOverview } from '@/components/wallet/WalletOverview';
import { EscrowList } from '@/components/wallet/EscrowList';
import {
  Wallet,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  DollarSign,
  Phone,
  CheckCircle,
  XCircle,
  Loader2,
  TrendingUp,
  Shield,
  X,
  Sparkles,
  Download,
} from 'lucide-react';

function WalletContent() {
  const router = useRouter();
  const {
    wallet,
    transactions,
    isLoading,
    fetchWallet,
    topUpWallet,
    fetchTransactions,
  } = useWallet();

  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [topUpSuccess, setTopUpSuccess] = useState(false);
  const [topUpError, setTopUpError] = useState<string | null>(null);
  const [showPaymentStatusModal, setShowPaymentStatusModal] = useState(false);
  const [currentCheckoutRequestId, setCurrentCheckoutRequestId] = useState<string | null>(null);
  const [currentTopUpAmount, setCurrentTopUpAmount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'escrows'>('overview');
  const [downloadingStatement, setDownloadingStatement] = useState(false);

  const quickAmounts = [500, 1000, 2000, 5000, 10000];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'transactions', label: 'Transactions', icon: ArrowDownLeft },
    { id: 'escrows', label: 'Escrows', icon: Shield },
  ];

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, []);

  const handleTransactionClick = (transaction: any) => {
    router.push(`/dashboard/wallet/transactions/${transaction.id}`);
  };

  const handleDownloadStatement = async () => {
    try {
      setDownloadingStatement(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet/statement`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download statement');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mzazicare-statement-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Statement downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download statement');
    } finally {
      setDownloadingStatement(false);
    }
  };

  const handleTopUp = async () => {
    if (!topUpAmount || Number(topUpAmount) < 100) {
      toast.error('Please enter a valid amount (minimum KES 100)');
      return;
    }

    if (!phoneNumber || !phoneNumber.match(/^(\+254|0)[17]\d{8}$/)) {
      toast.error('Please enter a valid Kenyan phone number');
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
        phone: formattedPhone,
        amount: Number(topUpAmount),
      });

      setTopUpSuccess(true);
      setCurrentCheckoutRequestId(response.checkoutRequestId);
      setCurrentTopUpAmount(Number(topUpAmount));

      // Close top-up modal and open payment status modal
      setTimeout(() => {
        setShowTopUpModal(false);
        setShowPaymentStatusModal(true);
        setTopUpAmount('');
        setPhoneNumber('');
        setTopUpSuccess(false);
      }, 1500);
    } catch (error: any) {
      console.error('Top-up error:', error);
      setTopUpError(error.response?.data?.message || error.message || 'Failed to initiate payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950">
      <div className="relative pb-24 pt-6 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-2 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            My Wallet
          </h1>
          <p className="text-dark-600 dark:text-dark-400">
            Manage your funds and track your payments
          </p>
        </motion.div>

        {/* Balance Card - Premium Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl mb-8 shadow-2xl"
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-400 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative p-8">
            {isLoading && !wallet ? (
              <div className="flex items-center justify-center py-12">
                <Spinner size="lg" className="text-white" />
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <p className="text-white/80 text-sm font-medium mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Available Balance
                    </p>
                    <motion.h2
                      className="text-6xl font-bold text-white mb-2"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    >
                      {wallet?.balance?.toLocaleString() || '0.00'}
                    </motion.h2>
                    <p className="text-white/70 text-lg font-semibold">
                      KES
                    </p>
                  </div>

                  {/* Decorative chip icon */}
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring" }}
                  >
                    <Wallet className="w-8 h-8 text-white" />
                  </motion.div>
                </div>

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowTopUpModal(true)}
                  className="w-full px-8 py-4 rounded-2xl bg-white text-primary-600 font-semibold flex items-center justify-center gap-3 hover:shadow-2xl transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                    <Plus className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="text-lg">Top Up Wallet</span>
                </motion.button>
              </>
            )}
          </div>
        </motion.div>

        {/* Modern Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative px-6 py-4 rounded-2xl font-semibold transition-all flex items-center gap-3 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/30'
                    : 'bg-white dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:bg-dark-50 dark:hover:bg-dark-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <WalletOverview onTopUp={() => setShowTopUpModal(true)} />
            </motion.div>
          )}

          {activeTab === 'transactions' && (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white dark:bg-dark-900 rounded-3xl shadow-xl border border-dark-100 dark:border-dark-800 overflow-hidden">
                <div className="p-6 border-b border-dark-100 dark:border-dark-800 bg-gradient-to-r from-dark-50 to-white dark:from-dark-800 dark:to-dark-900">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-dark-900 dark:text-white flex items-center gap-3">
                      <ArrowDownLeft className="w-6 h-6 text-primary-500" />
                      Transaction History
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDownloadStatement}
                      disabled={downloadingStatement}
                      className="px-4 py-2 rounded-xl bg-primary-500 text-white font-semibold flex items-center gap-2 hover:bg-primary-600 transition-colors disabled:opacity-50"
                    >
                      {downloadingStatement ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Download Statement
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Spinner size="lg" />
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="p-16 text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/20 dark:to-accent-900/20 flex items-center justify-center">
                      <Wallet className="w-12 h-12 text-primary-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-dark-900 dark:text-white mb-3">
                      No transactions yet
                    </h3>
                    <p className="text-dark-600 dark:text-dark-400 mb-6">
                      Your transaction history will appear here
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => setShowTopUpModal(true)}
                      className="mx-auto"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Top Up Now
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-dark-100 dark:divide-dark-800">
                    {transactions.map((transaction, index) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ x: 4 }}
                        onClick={() => handleTransactionClick(transaction)}
                        className="p-6 hover:bg-dark-50 dark:hover:bg-dark-800 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                              transaction.type === 'credit'
                                ? 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20'
                                : 'bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20'
                            }`}>
                              {transaction.type === 'credit' ? (
                                <ArrowDownLeft className="w-6 h-6 text-green-600 dark:text-green-400" />
                              ) : (
                                <ArrowUpRight className="w-6 h-6 text-red-600 dark:text-red-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-dark-900 dark:text-white text-lg mb-1">
                                {transaction.description}
                              </p>
                              <p className="text-sm text-dark-500 dark:text-dark-500 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-2xl font-bold ${
                              transaction.type === 'credit'
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {transaction.type === 'credit' ? '+' : '-'}
                              {transaction.amount.toLocaleString()}
                            </p>
                            <p className="text-sm text-dark-500 mt-1">
                              Balance: {transaction.balanceAfter.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'escrows' && (
            <motion.div
              key="escrows"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <EscrowList
                onRefresh={() => {
                  fetchWallet();
                  fetchTransactions();
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modern Top Up Modal */}
      <AnimatePresence>
        {showTopUpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => !isProcessing && setShowTopUpModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-dark-900 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl"
            >
              {/* Header with gradient */}
              <div className="relative bg-gradient-to-r from-primary-500 to-accent-500 p-6">
                <button
                  onClick={() => !isProcessing && setShowTopUpModal(false)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors"
                  disabled={isProcessing}
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                    <Plus className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Top Up Wallet</h3>
                    <p className="text-white/80 text-sm">Add funds via M-Pesa</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {topUpError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 flex items-start gap-3"
                  >
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 dark:text-red-400">{topUpError}</p>
                  </motion.div>
                )}

                {topUpSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-4 rounded-2xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/20 flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-700 dark:text-green-400">
                      M-Pesa STK Push sent! Check your phone.
                    </p>
                  </motion.div>
                )}

                {/* Phone Number */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-dark-900 dark:text-white mb-3">
                    M-Pesa Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="0712345678"
                      disabled={isProcessing}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all"
                    />
                  </div>
                  <p className="text-xs text-dark-500 mt-2">
                    Enter your Safaricom number to receive the STK push
                  </p>
                </div>

                {/* Quick Amounts */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-dark-900 dark:text-white mb-3">
                    Quick Amounts
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {quickAmounts.map((amount) => (
                      <motion.button
                        key={amount}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setTopUpAmount(amount.toString())}
                        className={`px-3 py-3 rounded-xl font-semibold text-sm transition-all ${
                          topUpAmount === amount.toString()
                            ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/30'
                            : 'bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-700'
                        }`}
                      >
                        {amount >= 1000 ? `${amount / 1000}K` : amount}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-dark-900 dark:text-white mb-3">
                    Or Enter Custom Amount
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                    <input
                      type="number"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                      placeholder="Enter amount"
                      disabled={isProcessing}
                      min="100"
                      max="100000"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all text-lg font-semibold"
                    />
                  </div>
                  <p className="text-xs text-dark-500 mt-2">
                    Min: KES 100 • Max: KES 100,000
                  </p>
                </div>

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleTopUp}
                  disabled={isProcessing || !topUpAmount || !phoneNumber}
                  className="w-full px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold text-lg flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-primary-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Send STK Push
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Status Modal */}
      {showPaymentStatusModal && currentCheckoutRequestId && (
        <PaymentStatusModal
          checkoutRequestId={currentCheckoutRequestId}
          amount={currentTopUpAmount}
          onSuccess={() => {
            setShowPaymentStatusModal(false);
            setCurrentCheckoutRequestId(null);
            toast.success('Wallet topped up successfully!', { icon: '✅' });
            fetchWallet();
            fetchTransactions();
          }}
          onClose={() => {
            setShowPaymentStatusModal(false);
            setCurrentCheckoutRequestId(null);
            fetchWallet();
            fetchTransactions();
          }}
        />
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
