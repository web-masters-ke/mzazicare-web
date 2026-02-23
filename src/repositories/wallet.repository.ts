/**
 * Wallet Repository
 * Handles wallet-related API calls
 */

import { apiClient } from '@/services/api/api-client';
import { ApiEndpoints } from '@/config/api-endpoints';
import {
  Wallet,
  Transaction,
  TopUpWalletRequest,
  TopUpWalletResponse,
  WithdrawWalletRequest,
  WithdrawWalletResponse,
  PaginatedResponse,
  ApiResponse,
} from '@/types/models';

export class WalletRepository {
  /**
   * Get user wallet
   */
  async getWallet(): Promise<Wallet> {
    try {
      const response = await apiClient.get<ApiResponse<Wallet>>(
        ApiEndpoints.wallet.get
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Top up wallet via M-Pesa
   */
  async topUpWallet(data: TopUpWalletRequest): Promise<TopUpWalletResponse> {
    try {
      const response = await apiClient.post<ApiResponse<TopUpWalletResponse>>(
        ApiEndpoints.wallet.topUp,
        data
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get wallet transactions with pagination
   */
  async getTransactions(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Transaction>> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await apiClient.get<ApiResponse<PaginatedResponse<Transaction>>>(
        `${ApiEndpoints.wallet.transactions}?${params.toString()}`
      );

      return this.extractPaginatedData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get transaction by ID
   */
  async getTransactionById(transactionId: string): Promise<Transaction> {
    try {
      const response = await apiClient.get<ApiResponse<Transaction>>(
        ApiEndpoints.wallet.transactionById(transactionId)
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Withdraw from wallet
   */
  async withdrawFromWallet(data: WithdrawWalletRequest): Promise<WithdrawWalletResponse> {
    try {
      const response = await apiClient.post<ApiResponse<WithdrawWalletResponse>>(
        ApiEndpoints.wallet.withdraw,
        data
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Extract data from API response
   */
  private extractData<T>(response: ApiResponse<T>): T {
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch data');
  }

  /**
   * Extract paginated data from API response
   */
  private extractPaginatedData<T>(response: ApiResponse<PaginatedResponse<T>>): PaginatedResponse<T> {
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch data');
  }
}

export const walletRepository = new WalletRepository();
