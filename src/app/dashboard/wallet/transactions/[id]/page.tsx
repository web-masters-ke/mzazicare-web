"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Receipt, Calendar, Hash, ArrowDownLeft, ArrowUpRight, CheckCircle, Download, Loader2 } from 'lucide-react';
import { walletRepository } from '@/repositories/wallet.repository';
import { ProtectedRoute } from '@/components/auth';
import { UserRole } from '@/types/models';
import toast from 'react-hot-toast';

function TransactionDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const transactionId = params.id as string;

  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransaction();
  }, [transactionId]);

  const loadTransaction = async () => {
    try {
      setLoading(true);
      const data = await walletRepository.getTransactionById(transactionId);
      setTransaction(data);
    } catch (error: any) {
      console.error('Error loading transaction:', error);
      toast.error(error.message || 'Failed to load transaction');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-primary-200 dark:border-primary-900"></div>
          <div className="w-16 h-16 rounded-full border-4 border-t-primary-500 animate-spin absolute top-0"></div>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-4">Transaction Not Found</h2>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header - Hide on print */}
        <div className="mb-8 print:hidden">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 text-dark-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Wallet</span>
          </motion.button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-2">Transaction Receipt</h1>
              <p className="text-dark-600 dark:text-dark-400">
                View your transaction details
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 text-dark-900 dark:text-white font-semibold flex items-center gap-2 hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Print/Save
            </motion.button>
          </div>
        </div>

        {/* Receipt Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-900 rounded-3xl shadow-2xl overflow-hidden border border-dark-100 dark:border-dark-800 relative"
        >
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none overflow-hidden">
            <div className="text-9xl font-bold text-primary-500 transform -rotate-45 whitespace-nowrap">
              MZAZICARE
            </div>
          </div>

          {/* Header */}
          <div className="relative bg-gradient-to-r from-primary-500 to-accent-500 p-8 sm:p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Receipt className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Transaction Receipt</h2>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-6 h-6 text-white" />
              <p className="text-white/90 text-lg font-medium">Completed</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 sm:p-12 relative">
            {/* Amount */}
            <div className="text-center mb-12 pb-12 border-b-2 border-dark-200 dark:border-dark-700">
              <p className="text-sm text-dark-500 dark:text-dark-400 mb-3 uppercase tracking-wide font-semibold">Transaction Amount</p>
              <div className="flex items-center justify-center gap-3 mb-3">
                {transaction.type === 'credit' ? (
                  <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <ArrowDownLeft className="w-7 h-7 text-green-600 dark:text-green-400" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                    <ArrowUpRight className="w-7 h-7 text-red-600 dark:text-red-400" />
                  </div>
                )}
                <h3 className={`text-6xl font-bold ${
                  transaction.type === 'credit'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'}{transaction.amount.toLocaleString()}
                </h3>
              </div>
              <p className="text-2xl font-semibold text-dark-600 dark:text-dark-400">KES</p>
            </div>

            {/* Details Grid */}
            <div className="space-y-8">
              <div>
                <p className="text-xs font-semibold text-dark-500 dark:text-dark-400 mb-2 uppercase tracking-wide">Description</p>
                <p className="text-xl font-semibold text-dark-900 dark:text-white">
                  {transaction.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="p-6 rounded-2xl bg-dark-50 dark:bg-dark-800">
                  <p className="text-xs font-semibold text-dark-500 dark:text-dark-400 mb-2 uppercase tracking-wide">Balance Before</p>
                  <p className="text-2xl font-bold text-dark-900 dark:text-white">
                    {transaction.balanceBefore.toLocaleString()} <span className="text-lg">KES</span>
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-dark-50 dark:bg-dark-800">
                  <p className="text-xs font-semibold text-dark-500 dark:text-dark-400 mb-2 uppercase tracking-wide">Balance After</p>
                  <p className="text-2xl font-bold text-dark-900 dark:text-white">
                    {transaction.balanceAfter.toLocaleString()} <span className="text-lg">KES</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-2xl bg-dark-50 dark:bg-dark-800">
                <Calendar className="w-6 h-6 text-dark-500 dark:text-dark-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-xs font-semibold text-dark-500 dark:text-dark-400 mb-2 uppercase tracking-wide">Date & Time</p>
                  <p className="text-lg font-semibold text-dark-900 dark:text-white">
                    {formatDate(transaction.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-2xl bg-dark-50 dark:bg-dark-800">
                <Hash className="w-6 h-6 text-dark-500 dark:text-dark-400 flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-dark-500 dark:text-dark-400 mb-2 uppercase tracking-wide">Transaction ID</p>
                  <p className="text-sm font-mono text-dark-900 dark:text-white break-all">
                    {transaction.id}
                  </p>
                </div>
              </div>

              {transaction.mpesaRef && (
                <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border border-green-200 dark:border-green-800">
                  <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-2 uppercase tracking-wide">M-Pesa Reference</p>
                    <p className="text-lg font-bold text-green-900 dark:text-green-300">
                      {transaction.mpesaRef}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t-2 border-dark-200 dark:border-dark-700 text-center">
              <p className="text-sm text-dark-600 dark:text-dark-400 mb-2">
                Thank you for using MzaziCare
              </p>
              <p className="text-xs text-dark-500 dark:text-dark-500">
                Trusted Elderly Care Platform • {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          @page {
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  );
}

export default function TransactionDetailsPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.FAMILY_USER]}>
      <TransactionDetailsContent />
    </ProtectedRoute>
  );
}
