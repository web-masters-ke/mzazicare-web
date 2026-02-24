"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth';
import { BottomNav } from '@/components/layout/BottomNav';
import { Button } from '@/components/ui';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Search,
  Send,
  User,
  MoreVertical,
  Sparkles,
  Loader2,
  Plus,
} from 'lucide-react';
import { useMessaging } from '@/hooks/useMessaging';
import { messagingSocket } from '@/services/websocket/messaging.socket';
import { MessageType } from '@/types/messaging';

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = useRef<string | null>(null);
  const hasAutoSelectedConversation = useRef(false);

  const {
    conversations,
    currentConversation,
    messages,
    isLoading,
    error,
    typingUsers,
    fetchConversations,
    fetchMessages,
    sendMessage,
    markAsRead,
    setCurrentConversation,
    emitTyping,
  } = useMessaging();

  // Initialize WebSocket and fetch conversations
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      currentUserId.current = JSON.parse(userStr).id;

      // Connect WebSocket
      messagingSocket.connect(token);

      // Fetch conversations
      fetchConversations().catch((err) => {
        console.error('Failed to fetch conversations:', err);
      });
    }

    return () => {
      messagingSocket.disconnect();
    };
  }, [fetchConversations]);

  // Auto-select conversation from query parameter
  useEffect(() => {
    const conversationId = searchParams.get('conversation');

    if (conversationId && conversations.length > 0 && !hasAutoSelectedConversation.current) {
      const conversation = conversations.find((c) => c.id === conversationId);
      if (conversation) {
        setCurrentConversation(conversation);
        hasAutoSelectedConversation.current = true;

        // Remove query parameter from URL
        router.replace('/dashboard/messages');
      }
    }
  }, [searchParams, conversations, setCurrentConversation, router]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Join/leave conversation rooms
  useEffect(() => {
    if (currentConversation) {
      messagingSocket.joinConversation(currentConversation.id);

      // Fetch messages for the conversation
      fetchMessages(currentConversation.id).catch((err) => {
        console.error('Failed to fetch messages:', err);
      });

      // Mark as read
      markAsRead(currentConversation.id).catch((err) => {
        console.error('Failed to mark as read:', err);
      });

      return () => {
        messagingSocket.leaveConversation(currentConversation.id);
      };
    }
  }, [currentConversation, fetchMessages, markAsRead]);

  // Handle conversation selection
  const handleSelectConversation = (conversationId: string) => {
    const conversation = conversations.find((c) => c.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversation);
    }
  };

  // Filter conversations by search query
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

  // Handle send message
  const handleSendMessage = async () => {
    if (!messageText.trim() || !currentConversation) return;

    try {
      await sendMessage(currentConversation.id, {
        content: messageText,
        type: MessageType.TEXT,
      });
      setMessageText('');

      // Stop typing indicator
      if (isTyping) {
        setIsTyping(false);
        emitTyping(currentConversation.id, false);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to send message');
    }
  };

  // Handle typing indicator
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);

    if (!currentConversation) return;

    // Start typing
    if (!isTyping) {
      setIsTyping(true);
      emitTyping(currentConversation.id, true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      emitTyping(currentConversation.id, false);
    }, 2000);
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Get other participant
  const getOtherParticipant = (conversation: any) => {
    return conversation.participants.find(
      (p: any) => p.userId !== currentUserId.current
    )?.user;
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
                          <p className="text-sm text-dark-600 dark:text-dark-400 truncate">
                            {conversation.lastMessage || 'No messages yet'}
                          </p>
                        </div>
                        {(conversation.unreadCount || 0) > 0 && (
                          <div className="w-5 h-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center">
                            {conversation.unreadCount}
                          </div>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chat Window */}
            {currentConversation ? (
              <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-dark-100 dark:border-dark-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const otherUser = getOtherParticipant(currentConversation);
                      if (!otherUser) return null;

                      return (
                        <>
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
                          <div>
                            <p className="font-semibold text-dark-900 dark:text-white">
                              {otherUser.fullName}
                            </p>
                            <p className="text-xs text-dark-600 dark:text-dark-400">
                              {otherUser.role}
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  <button className="w-8 h-8 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 flex items-center justify-center">
                    <MoreVertical className="w-5 h-5 text-dark-600 dark:text-dark-400" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {isLoading && !messages.length ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <MessageSquare className="w-12 h-12 mx-auto mb-2 text-dark-300" />
                        <p className="text-dark-500">No messages yet</p>
                        <p className="text-sm text-dark-400">Start the conversation!</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {messages
                        .slice()
                        .reverse()
                        .map((message) => {
                          const isOwn = message.senderId === currentUserId.current;

                          return (
                            <div
                              key={message.id}
                              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                  isOwn
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-dark-100 dark:bg-dark-800 text-dark-900 dark:text-white'
                                }`}
                              >
                                {message.isDeleted ? (
                                  <p className="italic opacity-60">This message was deleted</p>
                                ) : (
                                  <>
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
                                    </div>
                                  </>
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

                {/* Message Input */}
                <div className="p-4 border-t border-dark-100 dark:border-dark-800">
                  <div className="flex gap-2">
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
                      disabled={!messageText.trim()}
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
                    Choose a chat from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

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
