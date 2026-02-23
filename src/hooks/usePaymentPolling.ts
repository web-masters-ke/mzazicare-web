/**
 * Payment Polling Hook
 * Polls payment status until it's completed or failed
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface PaymentStatusData {
  id: string;
  status: PaymentStatus;
  amount: number;
  method: string;
  mpesaReceiptNumber?: string;
  resultDesc?: string;
  createdAt: string;
  updatedAt: string;
}

interface UsePaymentPollingOptions {
  checkoutRequestId: string;
  onSuccess?: (data: PaymentStatusData) => void;
  onFailure?: (data: PaymentStatusData) => void;
  onCancel?: (data: PaymentStatusData) => void;
  pollInterval?: number; // milliseconds
  maxAttempts?: number;
  enabled?: boolean;
}

export function usePaymentPolling({
  checkoutRequestId,
  onSuccess,
  onFailure,
  onCancel,
  pollInterval = 3000, // Poll every 3 seconds
  maxAttempts = 40, // 40 attempts * 3 seconds = 2 minutes max
  enabled = true,
}: UsePaymentPollingOptions) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusData | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const attemptsRef = useRef(0);

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  const checkPaymentStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Not authenticated');
        stopPolling();
        return;
      }

      // Query wallet top-up status by checkoutRequestId
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wallet/topup/status/${checkoutRequestId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch payment status');
      }

      const result = await response.json();

      if (result.success && result.data) {
        const data: PaymentStatusData = result.data;
        setPaymentStatus(data);
        attemptsRef.current += 1;
        setAttempts(attemptsRef.current);

        // Check if payment is in final state
        if (data.status === 'COMPLETED') {
          stopPolling();
          onSuccess?.(data);
        } else if (data.status === 'FAILED') {
          stopPolling();
          onFailure?.(data);
        } else if (data.status === 'CANCELLED') {
          stopPolling();
          onCancel?.(data);
        }

        // Stop after max attempts
        if (attemptsRef.current >= maxAttempts) {
          stopPolling();
          setError('Payment status check timeout. Please check your wallet manually.');
        }
      }
    } catch (err: any) {
      console.error('Payment polling error:', err);
      setError(err.message || 'Failed to check payment status');

      // Don't stop polling on transient errors, but stop after max attempts
      attemptsRef.current += 1;
      setAttempts(attemptsRef.current);

      if (attemptsRef.current >= maxAttempts) {
        stopPolling();
      }
    }
  }, [checkoutRequestId, maxAttempts, onSuccess, onFailure, onCancel, stopPolling]);

  const startPolling = useCallback(() => {
    if (isPolling || !enabled) return;

    attemptsRef.current = 0;
    setAttempts(0);
    setError(null);
    setIsPolling(true);

    // Check immediately
    checkPaymentStatus();

    // Then poll at intervals
    pollIntervalRef.current = setInterval(checkPaymentStatus, pollInterval);
  }, [isPolling, enabled, checkPaymentStatus, pollInterval]);

  // Auto-start polling when enabled
  useEffect(() => {
    if (enabled && checkoutRequestId) {
      startPolling();
    }

    return () => {
      stopPolling();
    };
  }, [enabled, checkoutRequestId, startPolling, stopPolling]);

  return {
    paymentStatus,
    isPolling,
    error,
    attempts,
    maxAttempts,
    startPolling,
    stopPolling,
  };
}
