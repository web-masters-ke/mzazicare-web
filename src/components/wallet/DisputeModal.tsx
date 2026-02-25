"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui';
import { walletRepository } from '@/repositories/wallet.repository';
import toast from 'react-hot-toast';

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  escrow: any;
  onSubmitted: () => void;
}

const DISPUTE_REASONS = [
  { value: 'SERVICE_NOT_PERFORMED', label: 'Service Not Performed' },
  { value: 'POOR_QUALITY', label: 'Poor Quality Service' },
  { value: 'INCOMPLETE_TASKS', label: 'Incomplete Tasks' },
  { value: 'CAREGIVER_NO_SHOW', label: 'Caregiver Did Not Show Up' },
  { value: 'SAFETY_CONCERN', label: 'Safety Concern' },
  { value: 'OTHER', label: 'Other' },
];

export function DisputeModal({ isOpen, onClose, escrow, onSubmitted }: DisputeModalProps) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason) {
      toast.error('Please select a reason');
      return;
    }

    if (description.length < 10) {
      toast.error('Please provide more details (at least 10 characters)');
      return;
    }

    try {
      setLoading(true);
      await walletRepository.fileDispute(escrow.id, {
        reason,
        description,
      });
      onSubmitted();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to file dispute');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-dark-900 rounded-2xl max-w-lg w-full p-6 relative"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-dark-400 hover:text-dark-600 dark:hover:text-dark-300"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-dark-900 dark:text-white">
                  File Dispute
                </h2>
                <p className="text-sm text-dark-600 dark:text-dark-400">
                  KES {Number(escrow.totalAmount).toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-dark-600 dark:text-dark-400 mt-2">
              If you're unhappy with the service, file a dispute to request a refund or resolution.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Reason */}
            <div>
              <label className="block text-sm font-semibold text-dark-900 dark:text-white mb-2">
                Reason for Dispute *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-dark-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
                disabled={loading}
              >
                <option value="">Select a reason...</option>
                {DISPUTE_REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-dark-900 dark:text-white mb-2">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-dark-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[120px] resize-none"
                placeholder="Explain what happened and why you're filing this dispute..."
                required
                minLength={10}
                disabled={loading}
              />
              <p className="text-xs text-dark-500 mt-1">
                {description.length}/500 characters (minimum 10)
              </p>
            </div>

            {/* Warning */}
            <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-200 dark:border-orange-800">
              <p className="text-sm text-orange-900 dark:text-orange-400">
                <strong>Note:</strong> Filing a dispute will pause the release of funds. An admin will review your case and make a decision.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="danger"
                isLoading={loading}
                className="flex-1"
              >
                File Dispute
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
