"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui';
import { useWallet } from '@/hooks/useWallet';
import {
  Loader2,
  CheckCircle,
  XCircle,
  Phone,
  Clock,
  X,
} from 'lucide-react';

interface PaymentStatusModalProps {
  checkoutRequestId: string;
  amount: number;
  onSuccess: () => void;
  onClose: () => void;
}

export function PaymentStatusModal({
  checkoutRequestId,
  amount,
  onSuccess,
  onClose,
}: PaymentStatusModalProps) {
  const { getTopUpStatus } = useWallet();
  const [status, setStatus] = useState<'pending' | 'completed' | 'failed'>('pending');
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const maxPollingTime = 120; // 2 minutes

  useEffect(() => {
    // Start timer
    timerIntervalRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    // Start polling
    pollPaymentStatus();

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const pollPaymentStatus = async () => {
    let attempts = 0;
    const maxAttempts = 40; // Poll for up to 2 minutes (40 * 3 seconds)

    const poll = async () => {
      try {
        attempts++;
        const result = await getTopUpStatus(checkoutRequestId);

        if (result.status === 'completed') {
          setStatus('completed');
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
          }
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
          }
          setTimeout(() => {
            onSuccess();
          }, 2000);
        } else if (result.status === 'failed') {
          setStatus('failed');
          setError('Payment was cancelled or failed. Please try again.');
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
          }
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
          }
        } else if (attempts >= maxAttempts) {
          // Timeout after max attempts
          setStatus('failed');
          setError('Payment confirmation timed out. If money was deducted, it will be credited shortly.');
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
          }
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
          }
        }
      } catch (err) {
        console.error('Error polling payment status:', err);
        // Continue polling unless we've exceeded max attempts
        if (attempts >= maxAttempts) {
          setStatus('failed');
          setError('Could not verify payment status. Please check your transaction history.');
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
          }
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
          }
        }
      }
    };

    // Initial check
    await poll();

    // Set up polling interval (every 3 seconds)
    pollingIntervalRef.current = setInterval(poll, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-dark-900 rounded-2xl max-w-md w-full p-6 relative"
      >
        {/* Close button (only for failed/timeout) */}
        {status === 'failed' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-dark-400 hover:text-dark-600 dark:hover:text-dark-300"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="text-center">
          {/* Icon */}
          <div className="mb-6">
            <AnimatePresence mode="wait">
              {status === 'pending' && (
                <motion.div
                  key="pending"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="w-20 h-20 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center"
                >
                  <Loader2 className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-spin" />
                </motion.div>
              )}
              {status === 'completed' && (
                <motion.div
                  key="completed"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </motion.div>
              )}
              {status === 'failed' && (
                <motion.div
                  key="failed"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center"
                >
                  <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
            {status === 'pending' && 'Waiting for Payment'}
            {status === 'completed' && 'Payment Successful!'}
            {status === 'failed' && 'Payment Failed'}
          </h3>

          {/* Description */}
          <p className="text-dark-600 dark:text-dark-400 mb-6">
            {status === 'pending' && (
              <>
                <Phone className="w-4 h-4 inline mr-1" />
                Check your phone for the M-Pesa PIN prompt
              </>
            )}
            {status === 'completed' && `KES ${amount.toLocaleString()} has been added to your wallet`}
            {status === 'failed' && (error || 'The payment could not be completed')}
          </p>

          {/* Timer (only for pending) */}
          {status === 'pending' && (
            <div className="mb-6 p-4 bg-dark-50 dark:bg-dark-800 rounded-xl">
              <div className="flex items-center justify-center gap-2 text-sm text-dark-600 dark:text-dark-400">
                <Clock className="w-4 h-4" />
                <span>Elapsed time: {formatTime(elapsedTime)}</span>
              </div>
              <div className="mt-2 text-xs text-dark-500">
                This may take up to 2 minutes
              </div>
            </div>
          )}

          {/* Amount display */}
          {status !== 'failed' && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <p className="text-sm text-blue-700 dark:text-blue-400 mb-1">Amount</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-300">
                KES {amount.toLocaleString()}
              </p>
            </div>
          )}

          {/* Loading indicator */}
          {status === 'pending' && (
            <div className="mb-6">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <p className="text-sm text-dark-500 mt-2">Checking payment status...</p>
            </div>
          )}

          {/* Action buttons */}
          {status === 'completed' && (
            <Button
              variant="primary"
              onClick={onSuccess}
              className="w-full"
            >
              Continue
            </Button>
          )}
          {status === 'failed' && (
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={onClose}
                className="flex-1"
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => window.location.reload()}
                className="flex-1"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
