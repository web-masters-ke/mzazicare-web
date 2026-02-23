/**
 * Wallet Store
 * Manages wallet state using Zustand
 */

import { create } from 'zustand';
import {
  Wallet,
  Transaction,
  TopUpWalletRequest,
  TopUpWalletResponse,
  WithdrawWalletRequest,
  WithdrawWalletResponse,
} from '@/types/models';
import { walletRepository } from '@/repositories/wallet.repository';

interface WalletState {
  wallet: Wallet | null;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalTransactions: number;

  // Actions
  fetchWallet: () => Promise<void>;
  topUpWallet: (data: TopUpWalletRequest) => Promise<TopUpWalletResponse>;
  withdrawFromWallet: (data: WithdrawWalletRequest) => Promise<WithdrawWalletResponse>;
  fetchTransactions: (page?: number, limit?: number) => Promise<void>;
  fetchTransactionById: (id: string) => Promise<Transaction>;
  clearError: () => void;
  reset: () => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  wallet: null,
  transactions: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalTransactions: 0,

  fetchWallet: async () => {
    set({ isLoading: true, error: null });
    try {
      const wallet = await walletRepository.getWallet();
      set({ wallet, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to fetch wallet',
        isLoading: false,
      });
      throw error;
    }
  },

  topUpWallet: async (data: TopUpWalletRequest): Promise<TopUpWalletResponse> => {
    set({ isLoading: true, error: null });
    try {
      const response = await walletRepository.topUpWallet(data);
      set({ isLoading: false });
      // Refresh wallet after top-up initiation
      get().fetchWallet();
      return response;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to initiate top-up',
        isLoading: false,
      });
      throw error;
    }
  },

  withdrawFromWallet: async (data: WithdrawWalletRequest): Promise<WithdrawWalletResponse> => {
    set({ isLoading: true, error: null });
    try {
      const response = await walletRepository.withdrawFromWallet(data);
      set({ isLoading: false });
      // Refresh wallet and transactions after withdrawal
      get().fetchWallet();
      get().fetchTransactions();
      return response;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to process withdrawal',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchTransactions: async (page: number = 1, limit: number = 20) => {
    set({ isLoading: true, error: null });
    try {
      const response = await walletRepository.getTransactions(page, limit);
      set({
        transactions: response.data,
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        totalTransactions: response.pagination.totalItems,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to fetch transactions',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchTransactionById: async (id: string): Promise<Transaction> => {
    set({ isLoading: true, error: null });
    try {
      const transaction = await walletRepository.getTransactionById(id);
      set({ isLoading: false });
      return transaction;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to fetch transaction',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      wallet: null,
      transactions: [],
      isLoading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      totalTransactions: 0,
    }),
}));
