"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth';
import { BottomNav } from '@/components/layout/BottomNav';
import { Button, Spinner } from '@/components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { useMessaging } from '@/hooks/useMessaging';
import { useAuth } from '@/hooks/useAuth';
import { messagingSocket } from '@/services/websocket/messaging.socket';
import { Message, MessageType, PinnedMessage } from '@/types/messaging';
import {
  MessageSquare,
  Send,
  Search,
  User,
  Plus,
  Loader2,
  MoreVertical,
  Edit2,
  Trash2,
  Reply,
  Forward,
  Pin,
  Smile,
  Clock,
  Image as ImageIcon,
  Paperclip,
  X,
  Check,
  CheckCheck,
  Calendar,
} from 'lucide-react';

// Emoji reactions
const EMOJI_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🎉', '🔥', '👏'];

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const {
    conversations,
    currentConversation,
    messages,
    isLoading,
    typingUsers,
    fetchConversations,
    setCurrentConversation,
    fetchMessages,
    sendMessage,
    editMessage,
    deleteMessage,
    forwardMessage,
    pinMessage,
    unpinMessage,
    addReaction,
    removeReaction,
    scheduleMessage,
    markAsRead,
    getPinnedMessages,
  } = useMessaging();

  const [searchQuery, setSearchQuery] = useState('');
  const [messageText, setMessageText] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [reactionPickerMessage, setReactionPickerMessage] = useState<string | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [forwardMessageId, setForwardMessageId] = useState<string | null>(null);
  const [selectedForwardConversations, setSelectedForwardConversations] = useState<string[]>([]);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [pinnedMessages, setPinnedMessages] = useState<PinnedMessage[]>([]);
  const [showPinnedPanel, setShowPinnedPanel] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = useRef<string>(user?.id || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchedConversationId = useRef<string | null>(null);

  useEffect(() => {
    currentUserId.current = user?.id || '';
  }, [user]);

  useEffect(() => {
    if (user) {
      messagingSocket.connect(localStorage.getItem('accessToken') || '');
      fetchConversations();
    }

    return () => {
      messagingSocket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const conversationId = searchParams.get('conversation');
    if (conversationId && conversations.length > 0) {
      // Only select if not already selected to prevent unnecessary re-fetches
      if (!currentConversation || currentConversation.id !== conversationId) {
        const conversation = conversations.find((c) => c.id === conversationId);
        if (conversation) {
          handleSelectConversation(conversation.id);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, conversations]);

  useEffect(() => {
    if (!currentConversation) {
      lastFetchedConversationId.current = null;
      return;
    }

    if (currentConversation.id !== lastFetchedConversationId.current) {
      lastFetchedConversationId.current = currentConversation.id;

      fetchMessages(currentConversation.id);
      markAsRead(currentConversation.id);
      messagingSocket.joinConversation(currentConversation.id);

      // Fetch pinned messages
      loadPinnedMessages();

      return () => {
        messagingSocket.leaveConversation(currentConversation.id);
      };
    } else {
      // Already fetched, just join conversation
      messagingSocket.joinConversation(currentConversation.id);
      return () => {
        messagingSocket.leaveConversation(currentConversation.id);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentConversation?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadPinnedMessages = useCallback(async () => {
    if (!currentConversation) return;
    try {
      const pinned = await getPinnedMessages(currentConversation.id);
      setPinnedMessages(pinned);
    } catch (error) {
      console.error('Failed to load pinned messages:', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentConversation?.id]);

  const handleSelectConversation = useCallback((conversationId: string) => {
    const conversation = conversations.find((c) => c.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations]);

  const filteredConversations = conversations.filter((conversation) => {
    const otherParticipant = conversation.participants.find(
      (p) => p.userId !== currentUserId.current
    );
    return (
      otherParticipant?.user.fullName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) || false
    );
  });

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);

    if (!currentConversation) return;

    messagingSocket.emitTyping(currentConversation.id);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      messagingSocket.stopTyping(currentConversation.id);
    }, 3000);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() && !selectedFile) return;
    if (!currentConversation) return;

    try {
      const messageData: any = {
        content: messageText,
        type: selectedFile ? (selectedFile.type.startsWith('image/') ? MessageType.IMAGE : MessageType.FILE) : MessageType.TEXT,
      };

      if (replyToMessage) {
        messageData.replyToId = replyToMessage.id;
      }

      if (selectedFile) {
        // Upload file first
        const formData = new FormData();
        formData.append('file', selectedFile);

        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          messageData.attachments = [data.url];
        }
      }

      await sendMessage(currentConversation.id, messageData);
      setMessageText('');
      setReplyToMessage(null);
      setSelectedFile(null);
      setFilePreview(null);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      messagingSocket.stopTyping(currentConversation.id);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleMessageContextMenu = (e: React.MouseEvent, message: Message) => {
    e.preventDefault();
    setSelectedMessage(message);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleEditMessage = async () => {
    if (!editText.trim() || !editingMessageId) return;

    try {
      await editMessage(editingMessageId, { content: editText });
      setEditingMessageId(null);
      setEditText('');
    } catch (error) {
      console.error('Failed to edit message:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Delete this message?')) return;

    try {
      await deleteMessage(messageId);
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const handlePinMessage = async (messageId: string) => {
    if (!currentConversation) return;

    try {
      await pinMessage(currentConversation.id, messageId);
      loadPinnedMessages();
    } catch (error) {
      console.error('Failed to pin message:', error);
    }
  };

  const handleUnpinMessage = async (messageId: string) => {
    try {
      await unpinMessage(messageId);
      loadPinnedMessages();
    } catch (error) {
      console.error('Failed to unpin message:', error);
      alert('Failed to unpin message');
    }
  };

  const handleAddReaction = async (messageId: string, emoji: string) => {
    try {
      await addReaction(messageId, emoji);
      setShowReactionPicker(false);
      setReactionPickerMessage(null);
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  };

  const handleRemoveReaction = async (messageId: string, emoji: string) => {
    try {
      await removeReaction(messageId, emoji);
    } catch (error) {
      console.error('Failed to remove reaction:', error);
    }
  };

  const handleScheduleMessage = async () => {
    if (!messageText.trim() || !scheduleDate || !scheduleTime || !currentConversation) return;

    try {
      const scheduledFor = new Date(`${scheduleDate}T${scheduleTime}`);
      await scheduleMessage(currentConversation.id, {
        content: messageText,
        type: MessageType.TEXT,
        scheduledFor: scheduledFor.toISOString(),
      });

      setShowScheduleModal(false);
      setScheduleDate('');
      setScheduleTime('');
      setMessageText('');
      alert('Message scheduled successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to schedule message');
    }
  };

  const handleForwardMessage = async () => {
    if (!forwardMessageId || selectedForwardConversations.length === 0) return;

    try {
      await forwardMessage(forwardMessageId, selectedForwardConversations);
      setShowForwardModal(false);
      setForwardMessageId(null);
      setSelectedForwardConversations([]);
      alert('Message forwarded successfully!');
    } catch (error) {
      console.error('Failed to forward message:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setFilePreview(url);
      }
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const getOtherParticipant = (conversation: any) => {
    return conversation.participants.find(
      (p: any) => p.userId !== currentUserId.current
    )?.user;
  };

  const isMessagePinned = (messageId: string) => {
    return pinnedMessages.some((pm) => pm.messageId === messageId);
  };

  const getUserReaction = (message: Message, emoji: string) => {
    return message.reactions?.find(
      (r) => r.emoji === emoji && r.userId === currentUserId.current
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">
      <div className="relative pb-24 pt-8 px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-start justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-1">
              Messages
            </h1>
            <p className="text-dark-600 dark:text-dark-400">
              Chat with caregivers and families
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => router.push('/dashboard/caregivers')}
          >
            New Message
          </Button>
        </motion.div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-50 dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 overflow-hidden"
          style={{ height: 'calc(100vh - 280px)' }}
        >
          <div className="flex h-full">
            {/* Chat List */}
            <div className="w-80 border-r border-dark-100 dark:border-dark-800 flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-dark-100 dark:border-dark-800">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-dark-100 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 text-dark-900 dark:text-white placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  />
                </div>
              </div>

              {/* Chat List */}
              <div className="flex-1 overflow-y-auto">
                {isLoading && !conversations.length ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-dark-500">No conversations found</p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => {
                    const otherUser = getOtherParticipant(conversation);
                    if (!otherUser) return null;

                    return (
                      <button
                        key={conversation.id}
                        onClick={() => handleSelectConversation(conversation.id)}
                        className={`w-full p-4 flex items-start gap-3 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors ${
                          currentConversation?.id === conversation.id
                            ? 'bg-dark-100 dark:bg-dark-800'
                            : ''
                        }`}
                      >
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 flex-shrink-0">
                            {otherUser.profilePhoto ? (
                              <img
                                src={otherUser.profilePhoto}
                                alt={otherUser.fullName}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <User className="w-6 h-6" />
                            )}
                          </div>
                          {/* Online status indicator - placeholder */}
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-dark-900 rounded-full" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-dark-900 dark:text-white truncate">
                              {otherUser.fullName}
                            </p>
                            {conversation.lastMessageAt && (
                              <span className="text-xs text-dark-500">
                                {formatTimestamp(conversation.lastMessageAt)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-dark-600 dark:text-dark-400 truncate">
                              {conversation.lastMessage || 'No messages yet'}
                            </p>
                            {(conversation.unreadCount || 0) > 0 && (
                              <span className="ml-2 px-2 py-0.5 bg-primary-500 text-white text-xs rounded-full">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chat Messages */}
            {currentConversation ? (
              <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-dark-100 dark:border-dark-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400">
                        {getOtherParticipant(currentConversation)?.profilePhoto ? (
                          <img
                            src={getOtherParticipant(currentConversation)?.profilePhoto}
                            alt={getOtherParticipant(currentConversation)?.fullName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-dark-900 rounded-full" />
                    </div>
                    <div>
                      <p className="font-semibold text-dark-900 dark:text-white">
                        {getOtherParticipant(currentConversation)?.fullName}
                      </p>
                      <p className="text-xs text-dark-500">Online</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {pinnedMessages.length > 0 && (
                      <button
                        onClick={() => setShowPinnedPanel(!showPinnedPanel)}
                        className="px-3 py-1.5 rounded-lg bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-sm font-medium flex items-center gap-1"
                      >
                        <Pin className="w-4 h-4" />
                        {pinnedMessages.length} pinned
                      </button>
                    )}
                    <button
                      onClick={() => router.push(`/dashboard/messages/media?conversation=${currentConversation.id}`)}
                      className="w-8 h-8 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 flex items-center justify-center"
                    >
                      <ImageIcon className="w-5 h-5 text-dark-600 dark:text-dark-400" />
                    </button>
                    <button className="w-8 h-8 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 flex items-center justify-center">
                      <MoreVertical className="w-5 h-5 text-dark-600 dark:text-dark-400" />
                    </button>
                  </div>
                </div>

                {/* Pinned Messages Panel */}
                <AnimatePresence>
                  {showPinnedPanel && pinnedMessages.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-b border-dark-100 dark:border-dark-800 bg-primary-50 dark:bg-primary-900/10 overflow-hidden"
                    >
                      <div className="p-4 space-y-2 max-h-48 overflow-y-auto">
                        {pinnedMessages.map((pinnedMsg) => (
                          <div
                            key={pinnedMsg.id}
                            className="flex items-start gap-2 bg-white dark:bg-dark-800 rounded-lg p-3"
                          >
                            <Pin className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-dark-900 dark:text-white">
                                {pinnedMsg.message?.sender?.fullName || 'Unknown'}
                              </p>
                              <p className="text-sm text-dark-600 dark:text-dark-400 truncate">
                                {pinnedMsg.message?.content || 'Pinned message'}
                              </p>
                            </div>
                            <button
                              onClick={() => handleUnpinMessage(pinnedMsg.messageId)}
                              className="text-dark-500 hover:text-red-500"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {isLoading && (!messages || messages.length === 0) ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                    </div>
                  ) : !messages || messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <MessageSquare className="w-12 h-12 mx-auto mb-2 text-dark-300" />
                        <p className="text-dark-500">No messages yet</p>
                        <p className="text-sm text-dark-400">Start the conversation!</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {(messages || [])
                        .slice()
                        .reverse()
                        .map((message) => {
                          const isOwn = message.senderId === currentUserId.current;
                          const isPinned = isMessagePinned(message.id);

                          return (
                            <div
                              key={message.id}
                              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                onContextMenu={(e) => handleMessageContextMenu(e, message)}
                                className={`max-w-[70%] group relative`}
                              >
                                {/* Reply indicator */}
                                {message.replyToId && (
                                  <div className={`text-xs mb-1 px-2 py-1 rounded ${isOwn ? 'text-primary-200' : 'text-dark-500'}`}>
                                    Replying to message
                                  </div>
                                )}

                                {/* Message bubble */}
                                {editingMessageId === message.id ? (
                                  <div className="bg-white dark:bg-dark-800 rounded-2xl p-3 border border-dark-200 dark:border-dark-700">
                                    <input
                                      type="text"
                                      value={editText}
                                      onChange={(e) => setEditText(e.target.value)}
                                      onKeyPress={(e) => e.key === 'Enter' && handleEditMessage()}
                                      className="w-full px-2 py-1 bg-transparent text-dark-900 dark:text-white focus:outline-none"
                                      autoFocus
                                    />
                                    <div className="flex gap-2 mt-2">
                                      <button
                                        onClick={handleEditMessage}
                                        className="px-3 py-1 bg-primary-500 text-white rounded-lg text-xs"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={() => {
                                          setEditingMessageId(null);
                                          setEditText('');
                                        }}
                                        className="px-3 py-1 bg-dark-200 dark:bg-dark-700 text-dark-900 dark:text-white rounded-lg text-xs"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    className={`rounded-2xl px-4 py-2 ${
                                      isOwn
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-dark-100 dark:bg-dark-800 text-dark-900 dark:text-white'
                                    }`}
                                  >
                                    {isPinned && (
                                      <div className="flex items-center gap-1 mb-1">
                                        <Pin className="w-3 h-3" />
                                        <span className="text-xs opacity-75">Pinned</span>
                                      </div>
                                    )}

                                    {message.isDeleted ? (
                                      <p className="italic opacity-60">This message was deleted</p>
                                    ) : (
                                      <>
                                        {message.attachments && message.attachments.length > 0 && (
                                          <div className="mb-2">
                                            {message.type === MessageType.IMAGE ? (
                                              <img
                                                src={message.attachments[0]}
                                                alt="Attachment"
                                                className="rounded-lg max-w-xs"
                                              />
                                            ) : (
                                              <a
                                                href={message.attachments[0]}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-sm underline"
                                              >
                                                <Paperclip className="w-4 h-4" />
                                                View attachment
                                              </a>
                                            )}
                                          </div>
                                        )}
                                        <p>{message.content}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                          <p
                                            className={`text-xs ${
                                              isOwn ? 'text-primary-100' : 'text-dark-500'
                                            }`}
                                          >
                                            {formatTimestamp(message.createdAt)}
                                          </p>
                                          {message.isEdited && (
                                            <span
                                              className={`text-xs italic ${
                                                isOwn ? 'text-primary-100' : 'text-dark-500'
                                              }`}
                                            >
                                              (edited)
                                            </span>
                                          )}
                                          {isOwn && (
                                            <div className={`text-xs ${isOwn ? 'text-primary-100' : 'text-dark-500'}`}>
                                              {message.readReceipts?.some((r) => r.status === 'READ') ? (
                                                <CheckCheck className="w-3 h-3" />
                                              ) : message.readReceipts?.some((r) => r.status === 'DELIVERED') ? (
                                                <CheckCheck className="w-3 h-3 opacity-50" />
                                              ) : (
                                                <Check className="w-3 h-3 opacity-50" />
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                )}

                                {/* Reactions */}
                                {message.reactions && message.reactions.length > 0 && (
                                  <div className="flex gap-1 mt-1 flex-wrap">
                                    {Object.entries(
                                      message.reactions.reduce((acc: any, r) => {
                                        acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                                        return acc;
                                      }, {})
                                    ).map(([emoji, count]) => (
                                      <button
                                        key={emoji}
                                        onClick={() => {
                                          const userReaction = getUserReaction(message, emoji);
                                          if (userReaction) {
                                            handleRemoveReaction(message.id, emoji);
                                          } else {
                                            handleAddReaction(message.id, emoji);
                                          }
                                        }}
                                        className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 ${
                                          getUserReaction(message, emoji)
                                            ? 'bg-primary-100 dark:bg-primary-900/30'
                                            : 'bg-dark-100 dark:bg-dark-800'
                                        }`}
                                      >
                                        <span>{emoji}</span>
                                        <span>{count as number}</span>
                                      </button>
                                    ))}
                                  </div>
                                )}

                                {/* Quick actions on hover */}
                                {!message.isDeleted && (
                                  <div
                                    className={`absolute top-0 ${
                                      isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'
                                    } opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 px-2`}
                                  >
                                    <button
                                      onClick={() => {
                                        setReactionPickerMessage(message.id);
                                        setShowReactionPicker(true);
                                      }}
                                      className="w-7 h-7 rounded-lg bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700 flex items-center justify-center"
                                    >
                                      <Smile className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => setReplyToMessage(message)}
                                      className="w-7 h-7 rounded-lg bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700 flex items-center justify-center"
                                    >
                                      <Reply className="w-4 h-4" />
                                    </button>
                                    {isOwn && (
                                      <button
                                        onClick={() => {
                                          setEditingMessageId(message.id);
                                          setEditText(message.content);
                                        }}
                                        className="w-7 h-7 rounded-lg bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700 flex items-center justify-center"
                                      >
                                        <Edit2 className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      <div ref={messagesEndRef} />
                    </>
                  )}

                  {/* Typing Indicator */}
                  {typingUsers.size > 0 && (
                    <div className="flex justify-start">
                      <div className="bg-dark-100 dark:bg-dark-800 rounded-2xl px-4 py-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-dark-400 rounded-full animate-bounce delay-75" />
                          <div className="w-2 h-2 bg-dark-400 rounded-full animate-bounce delay-150" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reply Preview */}
                <AnimatePresence>
                  {replyToMessage && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 py-2 border-t border-dark-100 dark:border-dark-800 bg-dark-50 dark:bg-dark-900"
                    >
                      <div className="flex items-center gap-2">
                        <Reply className="w-4 h-4 text-dark-500" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-dark-500">Replying to {replyToMessage.sender.fullName}</p>
                          <p className="text-sm text-dark-900 dark:text-white truncate">
                            {replyToMessage.content}
                          </p>
                        </div>
                        <button onClick={() => setReplyToMessage(null)}>
                          <X className="w-4 h-4 text-dark-500" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* File Preview */}
                <AnimatePresence>
                  {selectedFile && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 py-2 border-t border-dark-100 dark:border-dark-800 bg-dark-50 dark:bg-dark-900"
                    >
                      <div className="flex items-center gap-2">
                        {filePreview ? (
                          <img src={filePreview} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-dark-200 dark:bg-dark-700 flex items-center justify-center">
                            <Paperclip className="w-6 h-6 text-dark-500" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-dark-900 dark:text-white truncate">{selectedFile.name}</p>
                          <p className="text-xs text-dark-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedFile(null);
                            setFilePreview(null);
                          }}
                        >
                          <X className="w-4 h-4 text-dark-500" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Message Input */}
                <div className="p-4 border-t border-dark-100 dark:border-dark-800">
                  <div className="flex gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/*,application/pdf,.doc,.docx"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-10 h-10 rounded-xl bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700 flex items-center justify-center"
                    >
                      <Paperclip className="w-5 h-5 text-dark-600 dark:text-dark-400" />
                    </button>
                    <button
                      onClick={() => setShowScheduleModal(true)}
                      className="w-10 h-10 rounded-xl bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700 flex items-center justify-center"
                    >
                      <Clock className="w-5 h-5 text-dark-600 dark:text-dark-400" />
                    </button>
                    <input
                      type="text"
                      value={messageText}
                      onChange={handleTyping}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-3 rounded-2xl bg-dark-100 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 text-dark-900 dark:text-white placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    />
                    <Button
                      variant="primary"
                      onClick={handleSendMessage}
                      leftIcon={<Send className="w-5 h-5" />}
                      disabled={!messageText.trim() && !selectedFile}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <MessageSquare className="w-10 h-10 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-dark-900 dark:text-white mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-dark-600 dark:text-dark-400">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Context Menu */}
      <AnimatePresence>
        {showContextMenu && selectedMessage && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => {
                setShowContextMenu(false);
                setSelectedMessage(null);
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                position: 'fixed',
                top: contextMenuPosition.y,
                left: contextMenuPosition.x,
              }}
              className="z-50 bg-white dark:bg-dark-900 rounded-xl border border-dark-100 dark:border-dark-800 shadow-lg overflow-hidden min-w-[180px]"
            >
              <button
                onClick={() => {
                  setReplyToMessage(selectedMessage);
                  setShowContextMenu(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-dark-50 dark:hover:bg-dark-800 flex items-center gap-3"
              >
                <Reply className="w-4 h-4" />
                <span>Reply</span>
              </button>
              <button
                onClick={() => {
                  setForwardMessageId(selectedMessage.id);
                  setShowForwardModal(true);
                  setShowContextMenu(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-dark-50 dark:hover:bg-dark-800 flex items-center gap-3"
              >
                <Forward className="w-4 h-4" />
                <span>Forward</span>
              </button>
              {selectedMessage.senderId === currentUserId.current && (
                <button
                  onClick={() => {
                    setEditingMessageId(selectedMessage.id);
                    setEditText(selectedMessage.content);
                    setShowContextMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-dark-50 dark:hover:bg-dark-800 flex items-center gap-3"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              )}
              {isMessagePinned(selectedMessage.id) ? (
                <button
                  onClick={() => {
                    handleUnpinMessage(selectedMessage.id);
                    setShowContextMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-dark-50 dark:hover:bg-dark-800 flex items-center gap-3"
                >
                  <Pin className="w-4 h-4" />
                  <span>Unpin</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    handlePinMessage(selectedMessage.id);
                    setShowContextMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-dark-50 dark:hover:bg-dark-800 flex items-center gap-3"
                >
                  <Pin className="w-4 h-4" />
                  <span>Pin</span>
                </button>
              )}
              {selectedMessage.senderId === currentUserId.current && (
                <button
                  onClick={() => {
                    handleDeleteMessage(selectedMessage.id);
                    setShowContextMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 flex items-center gap-3"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Reaction Picker */}
      <AnimatePresence>
        {showReactionPicker && reactionPickerMessage && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => {
                setShowReactionPicker(false);
                setReactionPickerMessage(null);
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 shadow-lg p-4"
            >
              <div className="flex gap-2">
                {EMOJI_REACTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleAddReaction(reactionPickerMessage, emoji)}
                    className="w-12 h-12 text-2xl hover:bg-dark-100 dark:hover:bg-dark-800 rounded-xl transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Schedule Message Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-dark-900 rounded-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-primary-500" />
                <h3 className="text-xl font-bold text-dark-900 dark:text-white">
                  Schedule Message
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Message
                  </label>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Type your message..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowScheduleModal(false);
                      setScheduleDate('');
                      setScheduleTime('');
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleScheduleMessage}
                    disabled={!messageText.trim() || !scheduleDate || !scheduleTime}
                    className="flex-1"
                  >
                    Schedule
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Forward Message Modal */}
      <AnimatePresence>
        {showForwardModal && forwardMessageId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-dark-900 rounded-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Forward className="w-6 h-6 text-primary-500" />
                <h3 className="text-xl font-bold text-dark-900 dark:text-white">
                  Forward Message
                </h3>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto mb-4">
                {conversations.map((conversation) => {
                  const otherUser = getOtherParticipant(conversation);
                  if (!otherUser) return null;

                  return (
                    <button
                      key={conversation.id}
                      onClick={() => {
                        if (selectedForwardConversations.includes(conversation.id)) {
                          setSelectedForwardConversations(
                            selectedForwardConversations.filter((id) => id !== conversation.id)
                          );
                        } else {
                          setSelectedForwardConversations([
                            ...selectedForwardConversations,
                            conversation.id,
                          ]);
                        }
                      }}
                      className={`w-full p-3 rounded-xl flex items-center gap-3 transition-colors ${
                        selectedForwardConversations.includes(conversation.id)
                          ? 'bg-primary-100 dark:bg-primary-900/30'
                          : 'hover:bg-dark-100 dark:hover:bg-dark-800'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400">
                        {otherUser.profilePhoto ? (
                          <img
                            src={otherUser.profilePhoto}
                            alt={otherUser.fullName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </div>
                      <p className="font-medium text-dark-900 dark:text-white">
                        {otherUser.fullName}
                      </p>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowForwardModal(false);
                    setForwardMessageId(null);
                    setSelectedForwardConversations([]);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleForwardMessage}
                  disabled={selectedForwardConversations.length === 0}
                  className="flex-1"
                >
                  Forward
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}

export default function MessagesPage() {
  return (
    <ProtectedRoute>
      <MessagesContent />
    </ProtectedRoute>
  );
}
