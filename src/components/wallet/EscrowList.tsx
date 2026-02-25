"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Clock,
  Check,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui';
import { walletRepository } from '@/repositories/wallet.repository';
import { DisputeModal } from './DisputeModal';
import toast from 'react-hot-toast';

interface EscrowListProps {
  escrows?: any[];
  onRefresh?: () => void;
}

export function EscrowList({ escrows: initialEscrows, onRefresh }: EscrowListProps) {
  const [escrows, setEscrows] = useState<any[]>(initialEscrows || []);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [selectedEscrow, setSelectedEscrow] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [loading, setLoading] = useState(!initialEscrows);

  useEffect(() => {
    if (!initialEscrows) {
      loadEscrows();
    }
  }, [initialEscrows]);

  const loadEscrows = async () => {
    try {
      setLoading(true);
      const data = await walletRepository.getMyEscrows();
      setEscrows(data.data || []);
    } catch (error) {
      console.error('[EscrowList] Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRelease = async (escrowId: string) => {
    try {
      setActionLoading(escrowId);
      await walletRepository.approveEscrowRelease(escrowId);
      toast.success('Release approved! Funds will be released to caregiver.');
      onRefresh?.();
      loadEscrows();
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve release');
    } finally {
      setActionLoading(null);
    }
  };

  const handleFileDispute = (escrow: any) => {
    setSelectedEscrow(escrow);
    setDisputeModalOpen(true);
  };

  const handleDisputeSubmitted = () => {
    toast.success('Dispute filed successfully');
    onRefresh?.();
    loadEscrows();
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; className: string; icon: any }> = {
      HELD: {
        label: 'Held',
        className: 'bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
        icon: Shield,
      },
      PENDING_RELEASE: {
        label: 'Pending Release',
        className: 'bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800',
        icon: Clock,
      },
      RELEASED: {
        label: 'Released',
        className: 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800',
        icon: Check,
      },
      DISPUTED: {
        label: 'Disputed',
        className: 'bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/20 dark:to-rose-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800',
        icon: AlertTriangle,
      },
      REFUNDED: {
        label: 'Refunded',
        className: 'bg-gradient-to-r from-purple-100 to-fuchsia-100 dark:from-purple-900/20 dark:to-fuchsia-900/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800',
        icon: CheckCircle2,
      },
    };

    const config = badges[status] || badges.HELD;
    const Icon = config.icon;

    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-xs ${config.className}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </div>
    );
  };

  const getReleaseDeadline = (escrow: any) => {
    if (!escrow.releaseDeadline) return null;
    const deadline = new Date(escrow.releaseDeadline);
    const now = new Date();
    const hoursLeft = Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60));

    if (hoursLeft < 0) return 'Overdue';
    if (hoursLeft < 1) return 'Less than 1 hour';
    if (hoursLeft < 24) return `${hoursLeft} hours left`;
    const daysLeft = Math.floor(hoursLeft / 24);
    return `${daysLeft} day${daysLeft > 1 ? 's' : ''} left`;
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

  if (escrows.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-900 rounded-3xl shadow-xl border border-dark-100 dark:border-dark-800 overflow-hidden">
        <div className="p-16 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/20 dark:to-accent-900/20 flex items-center justify-center">
            <Shield className="w-12 h-12 text-primary-500" />
          </div>
          <h3 className="text-2xl font-bold text-dark-900 dark:text-white mb-3">
            No Active Escrows
          </h3>
          <p className="text-dark-600 dark:text-dark-400">
            Your protected payments will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {escrows.map((escrow, index) => (
          <motion.div
            key={escrow.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
          >
            <div className="bg-white dark:bg-dark-900 rounded-3xl shadow-xl border border-dark-100 dark:border-dark-800 overflow-hidden">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-dark-900 dark:text-white">
                        {escrow.booking?.serviceType?.name || 'Booking'}
                      </h3>
                      {getStatusBadge(escrow.status)}
                    </div>
                    <div className="flex items-center gap-2 text-dark-600 dark:text-dark-400 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/20 dark:to-accent-900/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                          {escrow.booking?.caregiver?.user?.fullName?.charAt(0) || 'C'}
                        </span>
                      </div>
                      <span className="font-medium">
                        {escrow.booking?.caregiver?.user?.fullName || 'N/A'}
                      </span>
                    </div>
                    {escrow.booking?.scheduledDate && (
                      <p className="text-sm text-dark-500">
                        {new Date(escrow.booking.scheduledDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-dark-500 mb-1">Amount</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                      {Number(escrow.totalAmount).toLocaleString()}
                    </p>
                    <p className="text-sm font-semibold text-dark-600 dark:text-dark-400">KES</p>
                    {escrow.status === 'PENDING_RELEASE' && (
                      <div className="mt-3 px-3 py-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                        <p className="text-xs font-semibold text-orange-700 dark:text-orange-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {getReleaseDeadline(escrow)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {escrow.status === 'PENDING_RELEASE' && escrow.releaseMode === 'FAMILY_APPROVAL' && !escrow.approvedByFamily && (
                  <div className="flex gap-4 mb-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleApproveRelease(escrow.id)}
                      disabled={actionLoading !== null}
                      className="flex-1 px-6 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-50"
                    >
                      {actionLoading === escrow.id ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          Approve Release
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleFileDispute(escrow)}
                      disabled={actionLoading !== null}
                      className="flex-1 px-6 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-red-500/30 transition-all disabled:opacity-50"
                    >
                      <AlertCircle className="w-5 h-5" />
                      File Dispute
                    </motion.button>
                  </div>
                )}

                {escrow.status === 'PENDING_RELEASE' && !escrow.dispute && escrow.releaseMode === 'AUTO_RELEASE' && (
                  <div className="mb-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleFileDispute(escrow)}
                      disabled={actionLoading !== null}
                      className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-red-500/30 transition-all disabled:opacity-50"
                    >
                      <AlertCircle className="w-5 h-5" />
                      File Dispute
                    </motion.button>
                  </div>
                )}

                {/* Dispute Info */}
                {escrow.dispute && (
                  <div className="mb-6 p-5 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/10 dark:to-rose-900/10 rounded-2xl border border-red-200 dark:border-red-800">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-red-900 dark:text-red-400 text-lg mb-2">
                          Dispute Filed
                        </p>
                        <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                          <span className="font-semibold">Reason:</span> {escrow.dispute.reason.replace(/_/g, ' ')}
                        </p>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-100 dark:bg-red-900/30">
                          <span className="text-xs font-semibold text-red-700 dark:text-red-400">
                            {escrow.dispute.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Expand Details */}
                <motion.button
                  whileHover={{ x: 4 }}
                  onClick={() => setExpandedId(expandedId === escrow.id ? null : escrow.id)}
                  className="flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                >
                  {expandedId === escrow.id ? 'Hide' : 'Show'} details
                  {expandedId === escrow.id ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </motion.button>

                <AnimatePresence>
                  {expandedId === escrow.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-6 pt-6 border-t border-dark-200 dark:border-dark-700"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-dark-50 dark:bg-dark-800">
                          <p className="text-xs font-medium text-dark-500 dark:text-dark-400 mb-2">
                            Platform Fee (10%)
                          </p>
                          <p className="text-lg font-bold text-dark-900 dark:text-white">
                            {Number(escrow.platformFee).toLocaleString()} KES
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-dark-50 dark:bg-dark-800">
                          <p className="text-xs font-medium text-dark-500 dark:text-dark-400 mb-2">
                            Caregiver Amount
                          </p>
                          <p className="text-lg font-bold text-dark-900 dark:text-white">
                            {Number(escrow.caregiverAmount).toLocaleString()} KES
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-dark-50 dark:bg-dark-800">
                          <p className="text-xs font-medium text-dark-500 dark:text-dark-400 mb-2">
                            Created On
                          </p>
                          <p className="text-sm font-semibold text-dark-900 dark:text-white">
                            {new Date(escrow.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-dark-50 dark:bg-dark-800">
                          <p className="text-xs font-medium text-dark-500 dark:text-dark-400 mb-2">
                            Release Mode
                          </p>
                          <p className="text-sm font-semibold text-dark-900 dark:text-white">
                            {escrow.releaseMode === 'AUTO_RELEASE' ? 'Auto (24h)' : 'Approval (48h)'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedEscrow && (
        <DisputeModal
          isOpen={disputeModalOpen}
          onClose={() => {
            setDisputeModalOpen(false);
            setSelectedEscrow(null);
          }}
          escrow={selectedEscrow}
          onSubmitted={handleDisputeSubmitted}
        />
      )}
    </>
  );
}
