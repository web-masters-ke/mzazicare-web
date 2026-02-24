/**
 * Messaging Repository
 * Handles messaging-related API calls
 */

import { apiClient } from '@/services/api/api-client';
import { ApiEndpoints } from '@/config/api-endpoints';
import {
  Conversation,
  Message,
  PinnedMessage,
  ScheduledMessage,
  ConversationParticipant,
  CreateConversationRequest,
  SendMessageRequest,
  MarkAsReadRequest,
  EditMessageRequest,
  AddReactionRequest,
  ForwardMessageRequest,
  ScheduleMessageRequest,
  GetMessagesParams,
  GetMediaGalleryParams,
  ReactionsResponse,
  MessageReaction,
  PaginatedResponse,
  ApiResponse,
} from '@/types/models';

export class MessagingRepository {
  /**
   * Create a new conversation
   */
  async createConversation(data: CreateConversationRequest): Promise<Conversation> {
    try {
      const response = await apiClient.post<ApiResponse<Conversation>>(
        ApiEndpoints.messaging.createConversation,
        data
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all conversations
   */
  async getConversations(): Promise<Conversation[]> {
    try {
      const response = await apiClient.get<ApiResponse<{ conversations: Conversation[], pagination: any }>>(
        ApiEndpoints.messaging.getConversations
      );

      const data = this.extractData(response.data);
      return data.conversations;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get conversation by ID
   */
  async getConversationById(conversationId: string): Promise<Conversation> {
    try {
      const response = await apiClient.get<ApiResponse<Conversation>>(
        ApiEndpoints.messaging.getConversationById(conversationId)
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update conversation
   */
  async updateConversation(
    conversationId: string,
    data: { name?: string; description?: string; imageUrl?: string }
  ): Promise<Conversation> {
    try {
      const response = await apiClient.patch<ApiResponse<Conversation>>(
        ApiEndpoints.messaging.updateConversation(conversationId),
        data
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete conversation
   */
  async deleteConversation(conversationId: string): Promise<void> {
    try {
      await apiClient.delete(
        ApiEndpoints.messaging.deleteConversation(conversationId)
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Archive conversation
   */
  async archiveConversation(conversationId: string): Promise<void> {
    try {
      await apiClient.post(
        ApiEndpoints.messaging.archiveConversation(conversationId)
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Unarchive conversation
   */
  async unarchiveConversation(conversationId: string): Promise<void> {
    try {
      await apiClient.post(
        ApiEndpoints.messaging.unarchiveConversation(conversationId)
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mute conversation
   */
  async muteConversation(conversationId: string, hours?: number): Promise<void> {
    try {
      await apiClient.post(
        ApiEndpoints.messaging.muteConversation(conversationId),
        { hours }
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Unmute conversation
   */
  async unmuteConversation(conversationId: string): Promise<void> {
    try {
      await apiClient.post(
        ApiEndpoints.messaging.unmuteConversation(conversationId)
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get messages in a conversation
   */
  async getMessages(
    conversationId: string,
    params?: GetMessagesParams
  ): Promise<PaginatedResponse<Message>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const url = `${ApiEndpoints.messaging.getMessages(conversationId)}${
        queryParams.toString() ? `?${queryParams.toString()}` : ''
      }`;

      const response = await apiClient.get<ApiResponse<{ messages: Message[], pagination: any }>>(url);

      const data = this.extractData(response.data);
      return {
        data: data.messages,
        pagination: data.pagination,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Send a message
   */
  async sendMessage(
    conversationId: string,
    data: SendMessageRequest
  ): Promise<Message> {
    try {
      const response = await apiClient.post<ApiResponse<Message>>(
        ApiEndpoints.messaging.sendMessage(conversationId),
        data
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mark messages as read
   */
  async markAsRead(
    conversationId: string,
    messageIds?: string[]
  ): Promise<void> {
    try {
      await apiClient.post(
        ApiEndpoints.messaging.markAsRead(conversationId),
        messageIds ? { messageIds } : {}
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a message
   */
  async deleteMessage(messageId: string): Promise<void> {
    try {
      await apiClient.delete(
        ApiEndpoints.messaging.deleteMessage(messageId)
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Edit a message
   */
  async editMessage(
    messageId: string,
    data: EditMessageRequest
  ): Promise<Message> {
    try {
      const response = await apiClient.patch<ApiResponse<Message>>(
        ApiEndpoints.messaging.editMessage(messageId),
        data
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Forward a message
   */
  async forwardMessage(
    messageId: string,
    data: ForwardMessageRequest
  ): Promise<Message[]> {
    try {
      const response = await apiClient.post<ApiResponse<Message[]>>(
        ApiEndpoints.messaging.forwardMessage(messageId),
        data
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get media gallery
   */
  async getMediaGallery(
    conversationId: string,
    params?: GetMediaGalleryParams
  ): Promise<PaginatedResponse<Message>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.type) queryParams.append('type', params.type);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const url = `${ApiEndpoints.messaging.getMediaGallery(conversationId)}${
        queryParams.toString() ? `?${queryParams.toString()}` : ''
      }`;

      const response = await apiClient.get<ApiResponse<PaginatedResponse<Message>>>(url);

      return this.extractPaginatedData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Add reaction to a message
   */
  async addReaction(
    messageId: string,
    emoji: string
  ): Promise<MessageReaction> {
    try {
      const response = await apiClient.post<ApiResponse<MessageReaction>>(
        ApiEndpoints.messaging.addReaction(messageId),
        { emoji }
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove reaction from a message
   */
  async removeReaction(messageId: string, emoji: string): Promise<void> {
    try {
      await apiClient.delete(
        ApiEndpoints.messaging.removeReaction(messageId, emoji)
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get reactions for a message
   */
  async getReactions(messageId: string): Promise<ReactionsResponse> {
    try {
      const response = await apiClient.get<ApiResponse<ReactionsResponse>>(
        ApiEndpoints.messaging.getReactions(messageId)
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Pin a message
   */
  async pinMessage(
    conversationId: string,
    messageId: string
  ): Promise<PinnedMessage> {
    try {
      const response = await apiClient.post<ApiResponse<PinnedMessage>>(
        `/messaging/conversations/${conversationId}/pin/${messageId}`
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Unpin a message
   */
  async unpinMessage(messageId: string): Promise<void> {
    try {
      await apiClient.delete(ApiEndpoints.messaging.unpinMessage(messageId));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get pinned messages
   */
  async getPinnedMessages(conversationId: string): Promise<PinnedMessage[]> {
    try {
      const response = await apiClient.get<ApiResponse<PinnedMessage[]>>(
        ApiEndpoints.messaging.getPinnedMessages(conversationId)
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Schedule a message
   */
  async scheduleMessage(
    conversationId: string,
    data: ScheduleMessageRequest
  ): Promise<ScheduledMessage> {
    try {
      const response = await apiClient.post<ApiResponse<ScheduledMessage>>(
        ApiEndpoints.messaging.scheduleMessage(conversationId),
        data
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get scheduled messages
   */
  async getScheduledMessages(conversationId: string): Promise<ScheduledMessage[]> {
    try {
      const response = await apiClient.get<ApiResponse<ScheduledMessage[]>>(
        ApiEndpoints.messaging.getScheduledMessages(conversationId)
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cancel a scheduled message
   */
  async cancelScheduledMessage(scheduledMessageId: string): Promise<void> {
    try {
      await apiClient.delete(
        ApiEndpoints.messaging.cancelScheduledMessage(scheduledMessageId)
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Add participant to conversation
   */
  async addParticipant(
    conversationId: string,
    userId: string
  ): Promise<ConversationParticipant> {
    try {
      const response = await apiClient.post<ApiResponse<ConversationParticipant>>(
        ApiEndpoints.messaging.addParticipant(conversationId),
        { userId }
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove participant from conversation
   */
  async removeParticipant(conversationId: string, userId: string): Promise<void> {
    try {
      await apiClient.delete(
        ApiEndpoints.messaging.removeParticipant(conversationId, userId)
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update participant role
   */
  async updateParticipantRole(
    conversationId: string,
    userId: string,
    isAdmin: boolean
  ): Promise<ConversationParticipant> {
    try {
      const response = await apiClient.patch<ApiResponse<ConversationParticipant>>(
        ApiEndpoints.messaging.updateParticipantRole(conversationId, userId),
        { isAdmin }
      );

      return this.extractData(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Emit typing indicator
   */
  async emitTyping(conversationId: string, isTyping: boolean): Promise<void> {
    try {
      await apiClient.post(
        ApiEndpoints.messaging.emitTyping(conversationId),
        { isTyping }
      );
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

export const messagingRepository = new MessagingRepository();
