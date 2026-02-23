/**
 * Messaging Store
 * Manages messaging state using Zustand
 */

import { create } from 'zustand';
import {
  Conversation,
  Message,
  PinnedMessage,
  ScheduledMessage,
  MessageReaction,
  CreateConversationRequest,
  SendMessageRequest,
  EditMessageRequest,
  ScheduleMessageRequest,
  GetMessagesParams,
  ReactionsResponse,
} from '@/types/models';
import { messagingRepository } from '@/repositories/messaging.repository';

interface MessagingState {
  // State
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  pinnedMessages: PinnedMessage[];
  scheduledMessages: ScheduledMessage[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;

  // Typing indicators
  typingUsers: Set<string>;

  // Actions - Conversations
  fetchConversations: () => Promise<void>;
  fetchConversationById: (conversationId: string) => Promise<void>;
  createConversation: (data: CreateConversationRequest) => Promise<Conversation>;
  updateConversation: (
    conversationId: string,
    data: { name?: string; description?: string; imageUrl?: string }
  ) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  archiveConversation: (conversationId: string) => Promise<void>;
  unarchiveConversation: (conversationId: string) => Promise<void>;
  muteConversation: (conversationId: string, hours?: number) => Promise<void>;
  unmuteConversation: (conversationId: string) => Promise<void>;
  setCurrentConversation: (conversation: Conversation | null) => void;

  // Actions - Messages
  fetchMessages: (conversationId: string, params?: GetMessagesParams) => Promise<void>;
  loadMoreMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, data: SendMessageRequest) => Promise<Message>;
  markAsRead: (conversationId: string, messageIds?: string[]) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  editMessage: (messageId: string, content: string) => Promise<void>;
  forwardMessage: (messageId: string, conversationIds: string[]) => Promise<void>;

  // Actions - Reactions
  addReaction: (messageId: string, emoji: string) => Promise<void>;
  removeReaction: (messageId: string, emoji: string) => Promise<void>;

  // Actions - Pinned Messages
  pinMessage: (conversationId: string, messageId: string) => Promise<void>;
  unpinMessage: (conversationId: string, messageId: string) => Promise<void>;
  fetchPinnedMessages: (conversationId: string) => Promise<void>;

  // Actions - Scheduled Messages
  scheduleMessage: (conversationId: string, data: ScheduleMessageRequest) => Promise<void>;
  fetchScheduledMessages: (conversationId: string) => Promise<void>;
  cancelScheduledMessage: (scheduledMessageId: string) => Promise<void>;

  // Actions - Participants
  addParticipant: (conversationId: string, userId: string) => Promise<void>;
  removeParticipant: (conversationId: string, userId: string) => Promise<void>;
  updateParticipantRole: (conversationId: string, userId: string, isAdmin: boolean) => Promise<void>;

  // Actions - Typing
  emitTyping: (conversationId: string, isTyping: boolean) => Promise<void>;
  addTypingUser: (userId: string) => void;
  removeTypingUser: (userId: string) => void;

  // Real-time handlers (to be called by WebSocket service)
  handleNewMessage: (message: Message) => void;
  handleMessageRead: (conversationId: string, userId: string, messageIds: string[]) => void;
  handleMessageEdited: (messageId: string, content: string, editedAt: string) => void;
  handleMessageDeleted: (messageId: string, conversationId: string) => void;
  handleReactionAdded: (messageId: string, reaction: MessageReaction) => void;
  handleReactionRemoved: (messageId: string, userId: string, emoji: string) => void;
  handleMessagePinned: (pinnedMessage: PinnedMessage) => void;
  handleMessageUnpinned: (messageId: string, conversationId: string) => void;

  // Utility
  clearError: () => void;
  reset: () => void;
}

export const useMessagingStore = create<MessagingState>((set, get) => ({
  // Initial state
  conversations: [],
  currentConversation: null,
  messages: [],
  pinnedMessages: [],
  scheduledMessages: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  hasMore: false,
  typingUsers: new Set(),

  // Conversations
  fetchConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const conversations = await messagingRepository.getConversations();
      set({ conversations, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to fetch conversations',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchConversationById: async (conversationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const conversation = await messagingRepository.getConversationById(conversationId);
      set({ currentConversation: conversation, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to fetch conversation',
        isLoading: false,
      });
      throw error;
    }
  },

  createConversation: async (data: CreateConversationRequest): Promise<Conversation> => {
    set({ isLoading: true, error: null });
    try {
      const conversation = await messagingRepository.createConversation(data);
      set((state) => ({
        conversations: [conversation, ...(Array.isArray(state.conversations) ? state.conversations : [])],
        currentConversation: conversation,
        isLoading: false,
      }));
      return conversation;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to create conversation',
        isLoading: false,
      });
      throw error;
    }
  },

  updateConversation: async (
    conversationId: string,
    data: { name?: string; description?: string; imageUrl?: string }
  ) => {
    set({ isLoading: true, error: null });
    try {
      const updatedConversation = await messagingRepository.updateConversation(conversationId, data);
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === conversationId ? updatedConversation : c
        ),
        currentConversation:
          state.currentConversation?.id === conversationId
            ? updatedConversation
            : state.currentConversation,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to update conversation',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteConversation: async (conversationId: string) => {
    set({ isLoading: true, error: null });
    try {
      await messagingRepository.deleteConversation(conversationId);
      set((state) => ({
        conversations: state.conversations.filter((c) => c.id !== conversationId),
        currentConversation:
          state.currentConversation?.id === conversationId ? null : state.currentConversation,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to delete conversation',
        isLoading: false,
      });
      throw error;
    }
  },

  archiveConversation: async (conversationId: string) => {
    set({ isLoading: true, error: null });
    try {
      await messagingRepository.archiveConversation(conversationId);
      set((state) => ({
        conversations: state.conversations.filter((c) => c.id !== conversationId),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to archive conversation',
        isLoading: false,
      });
      throw error;
    }
  },

  unarchiveConversation: async (conversationId: string) => {
    set({ isLoading: true, error: null });
    try {
      await messagingRepository.unarchiveConversation(conversationId);
      get().fetchConversations();
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to unarchive conversation',
        isLoading: false,
      });
      throw error;
    }
  },

  muteConversation: async (conversationId: string, hours?: number) => {
    set({ isLoading: true, error: null });
    try {
      await messagingRepository.muteConversation(conversationId, hours);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to mute conversation',
        isLoading: false,
      });
      throw error;
    }
  },

  unmuteConversation: async (conversationId: string) => {
    set({ isLoading: true, error: null });
    try {
      await messagingRepository.unmuteConversation(conversationId);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to unmute conversation',
        isLoading: false,
      });
      throw error;
    }
  },

  setCurrentConversation: (conversation: Conversation | null) => {
    set({ currentConversation: conversation, messages: [], currentPage: 1, hasMore: false });
  },

  // Messages
  fetchMessages: async (conversationId: string, params?: GetMessagesParams) => {
    set({ isLoading: true, error: null });
    try {
      const response = await messagingRepository.getMessages(conversationId, params);
      set({
        messages: response.data,
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        hasMore: response.pagination.currentPage < response.pagination.totalPages,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to fetch messages',
        isLoading: false,
      });
      throw error;
    }
  },

  loadMoreMessages: async (conversationId: string) => {
    const { currentPage, hasMore, isLoading } = get();
    if (!hasMore || isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const response = await messagingRepository.getMessages(conversationId, {
        page: currentPage + 1,
      });
      set((state) => ({
        messages: [...state.messages, ...response.data],
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        hasMore: response.pagination.currentPage < response.pagination.totalPages,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to load more messages',
        isLoading: false,
      });
      throw error;
    }
  },

  sendMessage: async (conversationId: string, data: SendMessageRequest): Promise<Message> => {
    set({ error: null });
    try {
      const message = await messagingRepository.sendMessage(conversationId, data);
      set((state) => ({
        messages: [message, ...state.messages],
        conversations: state.conversations.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                lastMessage: message.content,
                lastMessageAt: message.createdAt,
              }
            : c
        ),
      }));
      return message;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to send message',
      });
      throw error;
    }
  },

  markAsRead: async (conversationId: string, messageIds?: string[]) => {
    try {
      await messagingRepository.markAsRead(conversationId, messageIds);
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === conversationId ? { ...c, unreadCount: 0 } : c
        ),
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to mark as read',
      });
      throw error;
    }
  },

  deleteMessage: async (messageId: string) => {
    set({ error: null });
    try {
      await messagingRepository.deleteMessage(messageId);
      set((state) => ({
        messages: state.messages.filter((m) => m.id !== messageId),
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to delete message',
      });
      throw error;
    }
  },

  editMessage: async (messageId: string, content: string) => {
    set({ error: null });
    try {
      const updatedMessage = await messagingRepository.editMessage(messageId, { content });
      set((state) => ({
        messages: state.messages.map((m) => (m.id === messageId ? updatedMessage : m)),
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to edit message',
      });
      throw error;
    }
  },

  forwardMessage: async (messageId: string, conversationIds: string[]) => {
    set({ error: null });
    try {
      await messagingRepository.forwardMessage(messageId, { conversationIds });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to forward message',
      });
      throw error;
    }
  },

  // Reactions
  addReaction: async (messageId: string, emoji: string) => {
    set({ error: null });
    try {
      const reaction = await messagingRepository.addReaction(messageId, emoji);
      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === messageId
            ? {
                ...m,
                reactions: [...(m.reactions || []), reaction],
              }
            : m
        ),
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to add reaction',
      });
      throw error;
    }
  },

  removeReaction: async (messageId: string, emoji: string) => {
    set({ error: null });
    try {
      await messagingRepository.removeReaction(messageId, emoji);
      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === messageId
            ? {
                ...m,
                reactions: (m.reactions || []).filter((r) => r.emoji !== emoji),
              }
            : m
        ),
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to remove reaction',
      });
      throw error;
    }
  },

  // Pinned Messages
  pinMessage: async (conversationId: string, messageId: string) => {
    set({ error: null });
    try {
      const pinnedMessage = await messagingRepository.pinMessage(conversationId, messageId);
      set((state) => ({
        pinnedMessages: [pinnedMessage, ...state.pinnedMessages],
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to pin message',
      });
      throw error;
    }
  },

  unpinMessage: async (conversationId: string, messageId: string) => {
    set({ error: null });
    try {
      await messagingRepository.unpinMessage(conversationId, messageId);
      set((state) => ({
        pinnedMessages: state.pinnedMessages.filter((p) => p.messageId !== messageId),
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to unpin message',
      });
      throw error;
    }
  },

  fetchPinnedMessages: async (conversationId: string) => {
    set({ error: null });
    try {
      const pinnedMessages = await messagingRepository.getPinnedMessages(conversationId);
      set({ pinnedMessages });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to fetch pinned messages',
      });
      throw error;
    }
  },

  // Scheduled Messages
  scheduleMessage: async (conversationId: string, data: ScheduleMessageRequest) => {
    set({ error: null });
    try {
      const scheduledMessage = await messagingRepository.scheduleMessage(conversationId, data);
      set((state) => ({
        scheduledMessages: [scheduledMessage, ...state.scheduledMessages],
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to schedule message',
      });
      throw error;
    }
  },

  fetchScheduledMessages: async (conversationId: string) => {
    set({ error: null });
    try {
      const scheduledMessages = await messagingRepository.getScheduledMessages(conversationId);
      set({ scheduledMessages });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to fetch scheduled messages',
      });
      throw error;
    }
  },

  cancelScheduledMessage: async (scheduledMessageId: string) => {
    set({ error: null });
    try {
      await messagingRepository.cancelScheduledMessage(scheduledMessageId);
      set((state) => ({
        scheduledMessages: state.scheduledMessages.filter((s) => s.id !== scheduledMessageId),
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to cancel scheduled message',
      });
      throw error;
    }
  },

  // Participants
  addParticipant: async (conversationId: string, userId: string) => {
    set({ error: null });
    try {
      const participant = await messagingRepository.addParticipant(conversationId, userId);
      set((state) => ({
        currentConversation: state.currentConversation
          ? {
              ...state.currentConversation,
              participants: [...state.currentConversation.participants, participant],
            }
          : null,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to add participant',
      });
      throw error;
    }
  },

  removeParticipant: async (conversationId: string, userId: string) => {
    set({ error: null });
    try {
      await messagingRepository.removeParticipant(conversationId, userId);
      set((state) => ({
        currentConversation: state.currentConversation
          ? {
              ...state.currentConversation,
              participants: state.currentConversation.participants.filter(
                (p) => p.userId !== userId
              ),
            }
          : null,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to remove participant',
      });
      throw error;
    }
  },

  updateParticipantRole: async (conversationId: string, userId: string, isAdmin: boolean) => {
    set({ error: null });
    try {
      const updatedParticipant = await messagingRepository.updateParticipantRole(
        conversationId,
        userId,
        isAdmin
      );
      set((state) => ({
        currentConversation: state.currentConversation
          ? {
              ...state.currentConversation,
              participants: state.currentConversation.participants.map((p) =>
                p.userId === userId ? updatedParticipant : p
              ),
            }
          : null,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to update participant role',
      });
      throw error;
    }
  },

  // Typing
  emitTyping: async (conversationId: string, isTyping: boolean) => {
    try {
      await messagingRepository.emitTyping(conversationId, isTyping);
    } catch (error: any) {
      // Silently fail for typing indicators
    }
  },

  addTypingUser: (userId: string) => {
    set((state) => ({
      typingUsers: new Set([...state.typingUsers, userId]),
    }));
  },

  removeTypingUser: (userId: string) => {
    set((state) => {
      const newTypingUsers = new Set(state.typingUsers);
      newTypingUsers.delete(userId);
      return { typingUsers: newTypingUsers };
    });
  },

  // Real-time handlers
  handleNewMessage: (message: Message) => {
    set((state) => ({
      messages: [message, ...state.messages],
      conversations: state.conversations.map((c) =>
        c.id === message.conversationId
          ? {
              ...c,
              lastMessage: message.content,
              lastMessageAt: message.createdAt,
              unreadCount: (c.unreadCount || 0) + 1,
            }
          : c
      ),
    }));
  },

  handleMessageRead: (conversationId: string, userId: string, messageIds: string[]) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      ),
    }));
  },

  handleMessageEdited: (messageId: string, content: string, editedAt: string) => {
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === messageId
          ? { ...m, content, isEdited: true, editedAt }
          : m
      ),
    }));
  },

  handleMessageDeleted: (messageId: string, conversationId: string) => {
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === messageId
          ? { ...m, isDeleted: true, content: 'This message was deleted' }
          : m
      ),
    }));
  },

  handleReactionAdded: (messageId: string, reaction: MessageReaction) => {
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === messageId
          ? {
              ...m,
              reactions: [...(m.reactions || []), reaction],
            }
          : m
      ),
    }));
  },

  handleReactionRemoved: (messageId: string, userId: string, emoji: string) => {
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === messageId
          ? {
              ...m,
              reactions: (m.reactions || []).filter(
                (r) => !(r.userId === userId && r.emoji === emoji)
              ),
            }
          : m
      ),
    }));
  },

  handleMessagePinned: (pinnedMessage: PinnedMessage) => {
    set((state) => ({
      pinnedMessages: [pinnedMessage, ...state.pinnedMessages],
    }));
  },

  handleMessageUnpinned: (messageId: string, conversationId: string) => {
    set((state) => ({
      pinnedMessages: state.pinnedMessages.filter((p) => p.messageId !== messageId),
    }));
  },

  // Utility
  clearError: () => set({ error: null }),

  reset: () =>
    set({
      conversations: [],
      currentConversation: null,
      messages: [],
      pinnedMessages: [],
      scheduledMessages: [],
      isLoading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      hasMore: false,
      typingUsers: new Set(),
    }),
}));
