/**
 * Payment Status Modal
 * Shows real-time payment status with polling
 */

'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePaymentPolling, PaymentStatusData } from '@/hooks/usePaymentPolling';
import { CheckCircle, XCircle, Loader2, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui';

interface PaymentStatusModalProps {
  checkoutRequestId: string;
  amount: number;
  onSuccess?: (data: PaymentStatusData) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function PaymentStatusModal({
  checkoutRequestId,
  amount,
  onSuccess,
  onClose,
  isOpen,
}: PaymentStatusModalProps) {
  const {
    paymentStatus,
    isPolling,
    error,
    attempts,
    maxAttempts,
    stopPolling,
  } = usePaymentPolling({
    checkoutRequestId,
    enabled: isOpen,
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onFailure: () => {
      // Keep modal open to show failure message
    },
    onCancel: () => {
      // Keep modal open to show cancelled message
    },
  });

  // Stop polling when modal closes
  useEffect(() => {
    if (!isOpen) {
      stopPolling();
    }
  }, [isOpen, stopPolling]);

  if (!isOpen) return null;

  const getStatusIcon = () => {
    if (error) {
      return <AlertCircle className="w-16 h-16 text-orange-500" />;
    }

    if (!paymentStatus) {
      return <Loader2 className="w-16 h-16 text-primary-500 animate-spin" />;
    }

    switch (paymentStatus.status) {
      case 'COMPLETED':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'FAILED':
      case 'CANCELLED':
        return <XCircle className="w-16 h-16 text-red-500" />;
      case 'PROCESSING':
      case 'PENDING':
      default:
        return <Loader2 className="w-16 h-16 text-primary-500 animate-spin" />;
    }
  };

  const getStatusTitle = () => {
    if (error) {
      return 'Status Check Error';
    }

    if (!paymentStatus) {
      return 'Checking Payment Status...';
    }

    switch (paymentStatus.status) {
      case 'COMPLETED':
        return 'Payment Successful!';
      case 'FAILED':
        return 'Payment Failed';
      case 'CANCELLED':
        return 'Payment Cancelled';
      case 'PROCESSING':
        return 'Processing Payment...';
      case 'PENDING':
      default:
        return 'Waiting for Payment...';
    }
  };

  const getStatusMessage = () => {
    if (error) {
      return error;
    }

    if (!paymentStatus) {
      return `Please check your phone and enter your M-Pesa PIN to complete the payment of KES ${amount.toLocaleString()}.`;
    }

    switch (paymentStatus.status) {
      case 'COMPLETED':
        return `KES ${amount.toLocaleString()} has been successfully added to your wallet.${
          paymentStatus.mpesaRef ? ` M-Pesa Receipt: ${paymentStatus.mpesaRef}` : ''
        }`;
      case 'FAILED':
        return `The payment could not be completed. ${
          paymentStatus.description || 'Please try again or contact support if the issue persists.'
        }`;
      case 'CANCELLED':
        return 'You cancelled the payment request. No charges were made.';
      case 'PROCESSING':
        return `Verifying your payment of KES ${amount.toLocaleString()}. This usually takes a few seconds...`;
      case 'PENDING':
      default:
        return `Please check your phone and enter your M-Pesa PIN to complete the payment of KES ${amount.toLocaleString()}.`;
    }
  };

  const isFinal = paymentStatus && ['COMPLETED', 'FAILED', 'CANCELLED'].includes(paymentStatus.status);
  const canRetry = paymentStatus && ['FAILED', 'CANCELLED'].includes(paymentStatus.status);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-dark-900 rounded-2xl max-w-md w-full p-6"
          >
            {/* Status Icon */}
            <div className="flex justify-center mb-6">
              {getStatusIcon()}
            </div>

            {/* Status Title */}
            <h3 className="text-2xl font-bold text-dark-900 dark:text-white text-center mb-3">
              {getStatusTitle()}
            </h3>

            {/* Status Message */}
            <p className="text-dark-600 dark:text-dark-400 text-center mb-6">
              {getStatusMessage()}
            </p>

            {/* Progress Indicator */}
            {isPolling && !isFinal && (
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-dark-500 mb-2">
                  <span>Checking status...</span>
                  <span>{attempts} / {maxAttempts}</span>
                </div>
                <div className="w-full bg-dark-200 dark:bg-dark-700 rounded-full h-2">
                  <motion.div
                    className="bg-primary-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(attempts / maxAttempts) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              {isFinal ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Close
                  </Button>
                  {canRetry && paymentStatus.status !== 'COMPLETED' && (
                    <Button
                      variant="primary"
                      onClick={() => {
                        onClose();
                        // Parent component should handle retry
                      }}
                      className="flex-1"
                    >
                      Try Again
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  variant="ghost"
                  onClick={onClose}
                  disabled={isPolling}
                  className="w-full"
                >
                  {isPolling ? 'Checking...' : 'Cancel'}
                </Button>
              )}
            </div>

            {/* Helpful Note */}
            {isPolling && !isFinal && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-blue-600 dark:text-blue-400 flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Payments typically complete within 30 seconds. If you don't see the prompt on your phone,
                    check your M-Pesa menu for pending requests.
                  </span>
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
