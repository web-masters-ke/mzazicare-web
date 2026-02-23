/**
 * Wallet Hook
 * Custom hook for wallet operations
 */

import { useWalletStore } from '@/stores/wallet.store';

export function useWallet() {
  const wallet = useWalletStore((state) => state.wallet);
  const transactions = useWalletStore((state) => state.transactions);
  const isLoading = useWalletStore((state) => state.isLoading);
  const error = useWalletStore((state) => state.error);
  const currentPage = useWalletStore((state) => state.currentPage);
  const totalPages = useWalletStore((state) => state.totalPages);
  const totalTransactions = useWalletStore((state) => state.totalTransactions);

  const fetchWallet = useWalletStore((state) => state.fetchWallet);
  const topUpWallet = useWalletStore((state) => state.topUpWallet);
  const withdrawFromWallet = useWalletStore((state) => state.withdrawFromWallet);
  const fetchTransactions = useWalletStore((state) => state.fetchTransactions);
  const fetchTransactionById = useWalletStore((state) => state.fetchTransactionById);
  const clearError = useWalletStore((state) => state.clearError);
  const reset = useWalletStore((state) => state.reset);

  return {
    // State
    wallet,
    transactions,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalTransactions,

    // Actions
    fetchWallet,
    topUpWallet,
    withdrawFromWallet,
    fetchTransactions,
    fetchTransactionById,
    clearError,
    reset,
  };
}
