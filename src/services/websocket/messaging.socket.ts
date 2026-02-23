/**
 * Messaging WebSocket Service
 * Handles real-time messaging events via Socket.io
 */

import { io, Socket } from 'socket.io-client';
import { useMessagingStore } from '@/stores/messaging.store';
import {
  MessageNewEvent,
  MessageReadEvent,
  TypingEvent,
  MessageEditedEvent,
  MessageDeletedEvent,
  ReactionAddedEvent,
  ReactionRemovedEvent,
  MessagePinnedEvent,
  MessageUnpinnedEvent,
  UserStatusEvent,
  ScheduledSentEvent,
} from '@/types/messaging';

class MessagingSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private typingTimeouts: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Initialize WebSocket connection
   */
  connect(token: string): void {
    if (this.socket?.connected) {
      console.log('WebSocket already connected');
      return;
    }

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';

    this.socket = io(wsUrl, {
      auth: {
        token: `Bearer ${token}`,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
    });

    this.setupEventListeners();
  }

  /**
   * Disconnect WebSocket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.reconnectAttempts = 0;
      this.typingTimeouts.clear();
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Join a conversation room
   */
  joinConversation(conversationId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('conversation:join', { conversationId });
    }
  }

  /**
   * Leave a conversation room
   */
  leaveConversation(conversationId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('conversation:leave', { conversationId });
    }
  }

  /**
   * Emit typing indicator
   */
  emitTyping(conversationId: string, isTyping: boolean): void {
    if (this.socket?.connected) {
      this.socket.emit('typing', { conversationId, isTyping });
    }
  }

  /**
   * Setup all event listeners
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', this.handleConnect.bind(this));
    this.socket.on('disconnect', this.handleDisconnect.bind(this));
    this.socket.on('connect_error', this.handleConnectError.bind(this));
    this.socket.on('error', this.handleError.bind(this));

    // Message events
    this.socket.on('message:new', this.handleNewMessage.bind(this));
    this.socket.on('message:read', this.handleMessageRead.bind(this));
    this.socket.on('message:edited', this.handleMessageEdited.bind(this));
    this.socket.on('message:deleted', this.handleMessageDeleted.bind(this));

    // Typing events
    this.socket.on('typing:user', this.handleTyping.bind(this));

    // Reaction events
    this.socket.on('reaction:added', this.handleReactionAdded.bind(this));
    this.socket.on('reaction:removed', this.handleReactionRemoved.bind(this));

    // Pinned message events
    this.socket.on('message:pinned', this.handleMessagePinned.bind(this));
    this.socket.on('message:unpinned', this.handleMessageUnpinned.bind(this));

    // User status events
    this.socket.on('user:online', this.handleUserOnline.bind(this));
    this.socket.on('user:offline', this.handleUserOffline.bind(this));

    // Scheduled message events
    this.socket.on('scheduled:sent', this.handleScheduledSent.bind(this));
  }

  // Connection Handlers
  private handleConnect(): void {
    console.log('✅ WebSocket connected');
    this.reconnectAttempts = 0;

    // Rejoin active conversation if any
    const currentConversation = useMessagingStore.getState().currentConversation;
    if (currentConversation) {
      this.joinConversation(currentConversation.id);
    }
  }

  private handleDisconnect(reason: string): void {
    console.log('❌ WebSocket disconnected:', reason);

    if (reason === 'io server disconnect') {
      // Server disconnected, attempt manual reconnect
      this.attemptReconnect();
    }
  }

  private handleConnectError(error: Error): void {
    console.error('WebSocket connection error:', error);
    this.attemptReconnect();
  }

  private handleError(error: any): void {
    console.error('WebSocket error:', error);
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * this.reconnectAttempts;

      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms...`);

      setTimeout(() => {
        this.socket?.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  // Message Event Handlers
  private handleNewMessage(event: MessageNewEvent): void {
    console.log('📨 New message:', event);

    const message = {
      id: event.id,
      conversationId: event.conversationId,
      senderId: event.senderId,
      sender: event.sender,
      content: event.content,
      type: event.type,
      attachments: event.attachments,
      isEdited: false,
      isDeleted: false,
      isSystem: event.type === 'SYSTEM',
      readReceipts: [],
      reactions: [],
      createdAt: event.createdAt,
      updatedAt: event.createdAt,
    };

    useMessagingStore.getState().handleNewMessage(message);
  }

  private handleMessageRead(event: MessageReadEvent): void {
    console.log('✅ Message read:', event);
    useMessagingStore.getState().handleMessageRead(
      event.conversationId,
      event.userId,
      event.messageIds
    );
  }

  private handleMessageEdited(event: MessageEditedEvent): void {
    console.log('✏️ Message edited:', event);
    useMessagingStore.getState().handleMessageEdited(
      event.id,
      event.content,
      event.editedAt
    );
  }

  private handleMessageDeleted(event: MessageDeletedEvent): void {
    console.log('🗑️ Message deleted:', event);
    useMessagingStore.getState().handleMessageDeleted(
      event.messageId,
      event.conversationId
    );
  }

  // Typing Event Handlers
  private handleTyping(event: TypingEvent): void {
    const { conversationId, userId, isTyping } = event;
    const currentConversation = useMessagingStore.getState().currentConversation;

    // Only handle typing for current conversation
    if (currentConversation?.id !== conversationId) return;

    if (isTyping) {
      useMessagingStore.getState().addTypingUser(userId);

      // Clear existing timeout
      const existingTimeout = this.typingTimeouts.get(userId);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      // Auto-remove typing indicator after 3 seconds
      const timeout = setTimeout(() => {
        useMessagingStore.getState().removeTypingUser(userId);
        this.typingTimeouts.delete(userId);
      }, 3000);

      this.typingTimeouts.set(userId, timeout);
    } else {
      useMessagingStore.getState().removeTypingUser(userId);
      const timeout = this.typingTimeouts.get(userId);
      if (timeout) {
        clearTimeout(timeout);
        this.typingTimeouts.delete(userId);
      }
    }
  }

  // Reaction Event Handlers
  private handleReactionAdded(event: ReactionAddedEvent): void {
    console.log('👍 Reaction added:', event);
    useMessagingStore.getState().handleReactionAdded(
      event.messageId,
      event.reaction
    );
  }

  private handleReactionRemoved(event: ReactionRemovedEvent): void {
    console.log('👎 Reaction removed:', event);
    useMessagingStore.getState().handleReactionRemoved(
      event.messageId,
      event.userId,
      event.emoji
    );
  }

  // Pinned Message Event Handlers
  private handleMessagePinned(event: MessagePinnedEvent): void {
    console.log('📌 Message pinned:', event);

    const pinnedMessage = {
      id: event.id,
      conversationId: event.conversationId,
      messageId: event.messageId,
      message: event.message,
      pinnedBy: event.pinnedByUser.id,
      pinnedByUser: event.pinnedByUser,
      pinnedAt: event.pinnedAt,
    };

    useMessagingStore.getState().handleMessagePinned(pinnedMessage);
  }

  private handleMessageUnpinned(event: MessageUnpinnedEvent): void {
    console.log('📍 Message unpinned:', event);
    useMessagingStore.getState().handleMessageUnpinned(
      event.messageId,
      event.conversationId
    );
  }

  // User Status Event Handlers
  private handleUserOnline(event: UserStatusEvent): void {
    console.log('🟢 User online:', event.userId);
    // Could update UI to show online status
  }

  private handleUserOffline(event: UserStatusEvent): void {
    console.log('⚪ User offline:', event.userId);
    // Could update UI to show offline status
  }

  // Scheduled Message Event Handlers
  private handleScheduledSent(event: ScheduledSentEvent): void {
    console.log('⏰ Scheduled message sent:', event);

    // Remove from scheduled messages
    useMessagingStore.getState().cancelScheduledMessage(event.scheduledMessageId);

    // Fetch updated messages to include the sent scheduled message
    const currentConversation = useMessagingStore.getState().currentConversation;
    if (currentConversation) {
      useMessagingStore.getState().fetchMessages(currentConversation.id);
    }
  }
}

// Export singleton instance
export const messagingSocket = new MessagingSocketService();
