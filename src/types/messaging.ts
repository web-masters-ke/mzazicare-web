/**
 * Messaging Type Definitions
 * Mirrors backend messaging models
 */

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  AUDIO = 'AUDIO',
  SYSTEM = 'SYSTEM',
}

export enum MessageStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
}

export enum ConversationType {
  DIRECT = 'direct',
  GROUP = 'group',
}

// User (lightweight for messaging)
export interface MessageUser {
  id: string;
  fullName: string;
  profilePhoto?: string;
  role: string;
}

// Message Model
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender: MessageUser;
  content: string;
  type: MessageType;
  attachments: string[];
  replyToId?: string;
  replyTo?: {
    id: string;
    content: string;
    sender: MessageUser;
  };
  isEdited: boolean;
  editedAt?: string;
  isDeleted: boolean;
  deletedAt?: string;
  isSystem: boolean;
  forwardedFromId?: string;
  forwardedFrom?: {
    id: string;
    sender: MessageUser;
  };
  readReceipts?: MessageReadReceipt[];
  reactions?: MessageReaction[];
  createdAt: string;
  updatedAt: string;
}

// Read Receipt
export interface MessageReadReceipt {
  id: string;
  messageId: string;
  userId: string;
  status: MessageStatus;
  readAt?: string;
  createdAt: string;
}

// Message Reaction
export interface MessageReaction {
  id: string;
  messageId: string;
  userId: string;
  user: MessageUser;
  emoji: string;
  createdAt: string;
}

// Conversation Participant
export interface ConversationParticipant {
  id: string;
  conversationId: string;
  userId: string;
  user: MessageUser;
  lastReadAt?: string;
  mutedUntil?: string;
  isArchived: boolean;
  isAdmin: boolean;
  joinedAt: string;
  leftAt?: string;
}

// Conversation Model
export interface Conversation {
  id: string;
  type: ConversationType;
  participant1Id?: string;
  participant2Id?: string;
  name?: string;
  description?: string;
  imageUrl?: string;
  lastMessageAt?: string;
  lastMessage?: string;
  createdById: string;
  participants: ConversationParticipant[];
  messages?: Message[];
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
}

// Pinned Message
export interface PinnedMessage {
  id: string;
  conversationId: string;
  messageId: string;
  message: Message;
  pinnedBy: string;
  pinnedByUser: MessageUser;
  pinnedAt: string;
}

// Scheduled Message
export interface ScheduledMessage {
  id: string;
  conversationId: string;
  senderId: string;
  sender: MessageUser;
  content: string;
  type: MessageType;
  attachments: string[];
  scheduledFor: string;
  status: 'PENDING' | 'SENT' | 'CANCELLED' | 'FAILED';
  sentMessageId?: string;
  sentAt?: string;
  cancelledAt?: string;
  createdAt: string;
}

// Online Status
export interface UserOnlineStatus {
  userId: string;
  isOnline: boolean;
  lastSeenAt?: string;
}

// Typing Indicator
export interface TypingIndicator {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}

// ============================================
// Request/Response Types
// ============================================

export interface CreateConversationRequest {
  participantIds: string[];
  type?: ConversationType;
  name?: string;
  description?: string;
}

export interface SendMessageRequest {
  content: string;
  type?: MessageType;
  attachments?: string[];
  replyToId?: string;
}

export interface MarkAsReadRequest {
  messageIds?: string[];
}

export interface EditMessageRequest {
  content: string;
}

export interface AddReactionRequest {
  emoji: string;
}

export interface ForwardMessageRequest {
  conversationIds: string[];
}

export interface ScheduleMessageRequest {
  content: string;
  scheduledFor: string;
  type?: MessageType;
  attachments?: string[];
}

export interface GetMessagesParams {
  page?: number;
  limit?: number;
}

export interface GetMediaGalleryParams {
  type?: MessageType;
  page?: number;
  limit?: number;
}

// Reaction Summary
export interface ReactionSummary {
  emoji: string;
  count: number;
  users: MessageUser[];
}

export interface ReactionsResponse {
  reactions: MessageReaction[];
  grouped: Record<string, MessageReaction[]>;
  summary: ReactionSummary[];
}

// WebSocket Event Payloads
export interface MessageNewEvent {
  id: string;
  conversationId: string;
  senderId: string;
  sender: MessageUser;
  content: string;
  type: MessageType;
  attachments: string[];
  createdAt: string;
}

export interface MessageReadEvent {
  conversationId: string;
  userId: string;
  messageIds: string[];
  readAt: string;
}

export interface TypingEvent {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}

export interface MessageEditedEvent {
  id: string;
  content: string;
  isEdited: boolean;
  editedAt: string;
}

export interface MessageDeletedEvent {
  messageId: string;
  conversationId: string;
}

export interface ReactionAddedEvent {
  messageId: string;
  reaction: MessageReaction;
}

export interface ReactionRemovedEvent {
  messageId: string;
  userId: string;
  emoji: string;
}

export interface MessagePinnedEvent {
  id: string;
  conversationId: string;
  messageId: string;
  message: Message;
  pinnedByUser: MessageUser;
  pinnedAt: string;
}

export interface MessageUnpinnedEvent {
  messageId: string;
  conversationId: string;
}

export interface UserStatusEvent {
  userId: string;
  timestamp: string;
}

export interface ScheduledSentEvent {
  scheduledMessageId: string;
  messageId: string;
}
