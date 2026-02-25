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
   * Get top-up status by checkout request ID
   */
  async getTopUpStatus(checkoutRequestId: string): Promise<{
    checkoutRequestId: string;
    status: 'pending' | 'completed' | 'failed';
    amount: number;
    mpesaRef?: string;
    createdAt: string;
    description: string;
  }> {
    try {
      const response = await apiClient.get<ApiResponse<any>>(
        `${ApiEndpoints.wallet.topUp}/status/${checkoutRequestId}`
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get wallet overview with escrow stats
   */
  async getWalletOverview(): Promise<any> {
    try {
      const response = await apiClient.get<ApiResponse<any>>(
        `${ApiEndpoints.wallet.get}/overview`
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get my escrows
   */
  async getMyEscrows(status?: string, page: number = 1, limit: number = 20): Promise<any> {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await apiClient.get<ApiResponse<any>>(
        `/escrow/my-escrows?${params.toString()}`
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get escrow details
   */
  async getEscrowDetails(escrowId: string): Promise<any> {
    try {
      const response = await apiClient.get<ApiResponse<any>>(
        `/escrow/${escrowId}`
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Approve escrow release
   */
  async approveEscrowRelease(escrowId: string): Promise<any> {
    try {
      const response = await apiClient.post<ApiResponse<any>>(
        `/escrow/${escrowId}/approve`
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * File dispute
   */
  async fileDispute(escrowId: string, data: {
    reason: string;
    description: string;
    evidence?: string[];
  }): Promise<any> {
    try {
      const response = await apiClient.post<ApiResponse<any>>(
        `/escrow/${escrowId}/dispute`,
        data
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Withdraw dispute
   */
  async withdrawDispute(escrowId: string): Promise<any> {
    try {
      const response = await apiClient.post<ApiResponse<any>>(
        `/escrow/${escrowId}/withdraw-dispute`
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Download wallet statement as PDF
   */
  async downloadStatement(startDate?: string, endDate?: string): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await apiClient.get(
        `${ApiEndpoints.wallet.get}/statement?${params.toString()}`,
        { responseType: 'blob' }
      );

      return response.data;
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
