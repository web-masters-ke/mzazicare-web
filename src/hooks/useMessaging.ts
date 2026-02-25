/**
 * Messaging Hook
 * Custom hook for messaging operations
 */

import { useMessagingStore } from '@/stores/messaging.store';

export function useMessaging() {
  // State
  const conversations = useMessagingStore((state) => state.conversations);
  const currentConversation = useMessagingStore((state) => state.currentConversation);
  const messages = useMessagingStore((state) => state.messages);
  const pinnedMessages = useMessagingStore((state) => state.pinnedMessages);
  const scheduledMessages = useMessagingStore((state) => state.scheduledMessages);
  const isLoading = useMessagingStore((state) => state.isLoading);
  const error = useMessagingStore((state) => state.error);
  const currentPage = useMessagingStore((state) => state.currentPage);
  const totalPages = useMessagingStore((state) => state.totalPages);
  const hasMore = useMessagingStore((state) => state.hasMore);
  const typingUsers = useMessagingStore((state) => state.typingUsers);

  // Actions - Conversations
  const fetchConversations = useMessagingStore((state) => state.fetchConversations);
  const fetchConversationById = useMessagingStore((state) => state.fetchConversationById);
  const createConversation = useMessagingStore((state) => state.createConversation);
  const updateConversation = useMessagingStore((state) => state.updateConversation);
  const deleteConversation = useMessagingStore((state) => state.deleteConversation);
  const archiveConversation = useMessagingStore((state) => state.archiveConversation);
  const unarchiveConversation = useMessagingStore((state) => state.unarchiveConversation);
  const muteConversation = useMessagingStore((state) => state.muteConversation);
  const unmuteConversation = useMessagingStore((state) => state.unmuteConversation);
  const setCurrentConversation = useMessagingStore((state) => state.setCurrentConversation);

  // Actions - Messages
  const fetchMessages = useMessagingStore((state) => state.fetchMessages);
  const loadMoreMessages = useMessagingStore((state) => state.loadMoreMessages);
  const sendMessage = useMessagingStore((state) => state.sendMessage);
  const markAsRead = useMessagingStore((state) => state.markAsRead);
  const deleteMessage = useMessagingStore((state) => state.deleteMessage);
  const editMessage = useMessagingStore((state) => state.editMessage);
  const forwardMessage = useMessagingStore((state) => state.forwardMessage);

  // Actions - Reactions
  const addReaction = useMessagingStore((state) => state.addReaction);
  const removeReaction = useMessagingStore((state) => state.removeReaction);

  // Actions - Pinned Messages
  const pinMessage = useMessagingStore((state) => state.pinMessage);
  const unpinMessage = useMessagingStore((state) => state.unpinMessage);
  const fetchPinnedMessages = useMessagingStore((state) => state.fetchPinnedMessages);

  // Actions - Scheduled Messages
  const scheduleMessage = useMessagingStore((state) => state.scheduleMessage);
  const fetchScheduledMessages = useMessagingStore((state) => state.fetchScheduledMessages);
  const cancelScheduledMessage = useMessagingStore((state) => state.cancelScheduledMessage);

  // Actions - Participants
  const addParticipant = useMessagingStore((state) => state.addParticipant);
  const removeParticipant = useMessagingStore((state) => state.removeParticipant);
  const updateParticipantRole = useMessagingStore((state) => state.updateParticipantRole);

  // Actions - Typing
  const emitTyping = useMessagingStore((state) => state.emitTyping);
  const addTypingUser = useMessagingStore((state) => state.addTypingUser);
  const removeTypingUser = useMessagingStore((state) => state.removeTypingUser);

  // Real-time handlers
  const handleNewMessage = useMessagingStore((state) => state.handleNewMessage);
  const handleMessageRead = useMessagingStore((state) => state.handleMessageRead);
  const handleMessageEdited = useMessagingStore((state) => state.handleMessageEdited);
  const handleMessageDeleted = useMessagingStore((state) => state.handleMessageDeleted);
  const handleReactionAdded = useMessagingStore((state) => state.handleReactionAdded);
  const handleReactionRemoved = useMessagingStore((state) => state.handleReactionRemoved);
  const handleMessagePinned = useMessagingStore((state) => state.handleMessagePinned);
  const handleMessageUnpinned = useMessagingStore((state) => state.handleMessageUnpinned);

  // Utility
  const clearError = useMessagingStore((state) => state.clearError);
  const reset = useMessagingStore((state) => state.reset);

  return {
    // State
    conversations,
    currentConversation,
    messages,
    pinnedMessages,
    scheduledMessages,
    isLoading,
    error,
    currentPage,
    totalPages,
    hasMore,
    typingUsers,

    // Actions - Conversations
    fetchConversations,
    fetchConversationById,
    createConversation,
    updateConversation,
    deleteConversation,
    archiveConversation,
    unarchiveConversation,
    muteConversation,
    unmuteConversation,
    setCurrentConversation,

    // Actions - Messages
    fetchMessages,
    loadMoreMessages,
    sendMessage,
    markAsRead,
    deleteMessage,
    editMessage,
    forwardMessage,

    // Actions - Reactions
    addReaction,
    removeReaction,

    // Actions - Pinned Messages
    pinMessage,
    unpinMessage,
    fetchPinnedMessages,

    // Actions - Scheduled Messages
    scheduleMessage,
    fetchScheduledMessages,
    cancelScheduledMessage,

    // Actions - Participants
    addParticipant,
    removeParticipant,
    updateParticipantRole,

    // Actions - Typing
    emitTyping,
    addTypingUser,
    removeTypingUser,

    // Real-time handlers
    handleNewMessage,
    handleMessageRead,
    handleMessageEdited,
    handleMessageDeleted,
    handleReactionAdded,
    handleReactionRemoved,
    handleMessagePinned,
    handleMessageUnpinned,

    // Utility
    clearError,
    reset,
  };
}
