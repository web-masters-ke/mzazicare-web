/**
 * API Endpoints
 * Centralized endpoint definitions for all API calls
 * Mirrors mobile app's ApiEndpoints
 */

export const ApiEndpoints = {
  // Authentication
  auth: {
    sendOtp: '/auth/send-otp',
    verifyOtp: '/auth/verify-otp',
    login: '/auth/login',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh',
    setPassword: '/auth/password/set',
    resetPasswordRequest: '/auth/password/reset-request',
    resetPassword: '/auth/password/reset',
    logoutAll: '/auth/logout-all',
  },

  // User Profile
  user: {
    profile: '/users/me',
    updateProfile: '/users/me',
    uploadPhoto: '/users/me/photo',
    familyMembers: '/users/me/family-members',
    addFamilyMember: '/users/me/family-members',
    updateFamilyMember: (id: string) => `/users/me/family-members/${id}`,
    deleteFamilyMember: (id: string) => `/users/me/family-members/${id}`,
    deviceToken: '/users/me/device-token',
    deleteDeviceToken: '/users/me/device-token',
  },

  // Elderly Management
  elderly: {
    list: '/elderly',
    create: '/elderly',
    byId: (id: string) => `/elderly/${id}`,
    update: (id: string) => `/elderly/${id}`,
    delete: (id: string) => `/elderly/${id}`,
    uploadPhoto: (id: string) => `/elderly/${id}/photo`,
    emergencyContacts: (id: string) => `/elderly/${id}/emergency-contacts`,
    addEmergencyContact: (id: string) => `/elderly/${id}/emergency-contacts`,
    updateEmergencyContact: (elderlyId: string, contactId: string) =>
      `/elderly/${elderlyId}/emergency-contacts/${contactId}`,
    deleteEmergencyContact: (elderlyId: string, contactId: string) =>
      `/elderly/${elderlyId}/emergency-contacts/${contactId}`,
  },

  // Caregiver
  caregiver: {
    register: '/caregivers/register',
    myProfile: '/caregivers/me',
    updateProfile: '/caregivers/me',
    uploadDocuments: '/caregivers/documents/upload',
    submitDocuments: '/caregivers/documents',
    updateSkills: '/caregivers/me/skills',
    updateAvailability: '/caregivers/me/availability',
    updateServiceAreas: '/caregivers/me/service-areas',
    toggleOnline: '/caregivers/me/toggle-online',
    earnings: '/caregivers/me/earnings',
    requestPayout: '/caregivers/me/payout',
    search: '/caregivers/search',
    match: '/caregivers/match',
    byId: (id: string) => `/caregivers/${id}`,
    reviews: (id: string) => `/caregivers/${id}/reviews`,
    availability: (id: string) => `/caregivers/${id}/availability`,
  },

  // Bookings - Family User
  booking: {
    family: {
      list: '/bookings',
      create: '/bookings',
      byId: (id: string) => `/bookings/${id}`,
      cancel: (id: string) => `/bookings/${id}/cancel`,
      reschedule: (id: string) => `/bookings/${id}/reschedule`,
      assignCaregiver: (id: string) => `/bookings/${id}/assign-caregiver`,
      recurring: '/bookings/recurring',
      recurringById: (groupId: string) => `/bookings/recurring/${groupId}`,
      cancelRecurring: (groupId: string) => `/bookings/recurring/${groupId}`,
    },
    caregiver: {
      pending: '/caregiver/bookings/pending',
      upcoming: '/caregiver/bookings/upcoming',
      history: '/caregiver/bookings/history',
      open: '/caregiver/bookings/open',
      claim: (id: string) => `/caregiver/bookings/${id}/claim`,
      accept: (id: string) => `/caregiver/bookings/${id}/accept`,
      decline: (id: string) => `/caregiver/bookings/${id}/decline`,
    },
  },

  // Visits
  visit: {
    byBookingId: (bookingId: string) => `/visits/${bookingId}`,
    checkIn: (bookingId: string) => `/visits/${bookingId}/check-in`,
    checkOut: (bookingId: string) => `/visits/${bookingId}/check-out`,
    submitReport: (bookingId: string) => `/visits/${bookingId}/report`,
    getReport: (bookingId: string) => `/visits/${bookingId}/report`,
  },

  // Wallet & Payments
  wallet: {
    get: '/wallet',
    topUp: '/wallet/topup',
    withdraw: '/wallet/withdraw',
    transactions: '/wallet/transactions',
    transactionById: (id: string) => `/wallet/transactions/${id}`,
  },

  payment: {
    initiate: '/payments/initiate',
    status: (id: string) => `/payments/${id}/status`,
    callback: '/payments/callback',
  },

  // Notifications
  notifications: {
    list: '/notifications',
    unreadCount: '/notifications/unread-count',
    markAsRead: (id: string) => `/notifications/${id}/read`,
    markAllAsRead: '/notifications/read-all',
    delete: (id: string) => `/notifications/${id}`,
    registerToken: '/notifications/device-token',
    unregisterToken: '/notifications/device-token',
  },

  // Reviews
  reviews: {
    create: '/reviews',
    byId: (id: string) => `/reviews/${id}`,
    update: (id: string) => `/reviews/${id}`,
    delete: (id: string) => `/reviews/${id}`,
  },

  // Services
  services: {
    list: '/services',
    byId: (id: string) => `/services/${id}`,
  },

  // Emergency
  emergency: {
    create: '/emergency',
    list: '/emergency',
    byId: (id: string) => `/emergency/${id}`,
    resolve: (id: string) => `/emergency/${id}/resolve`,
    cancel: (id: string) => `/emergency/${id}/cancel`,
  },

  // Support
  support: {
    tickets: '/support/tickets',
    createTicket: '/support/tickets',
    byId: (id: string) => `/support/tickets/${id}`,
    addMessage: (id: string) => `/support/tickets/${id}/messages`,
    close: (id: string) => `/support/tickets/${id}/close`,
  },

  // Analytics
  analytics: {
    familyDashboard: '/analytics/dashboard/family',
  },

  // Messaging
  messaging: {
    // Conversations
    createConversation: '/messaging/conversations',
    getConversations: '/messaging/conversations',
    getConversationById: (conversationId: string) => `/messaging/conversations/${conversationId}`,
    updateConversation: (conversationId: string) => `/messaging/conversations/${conversationId}`,
    deleteConversation: (conversationId: string) => `/messaging/conversations/${conversationId}`,
    archiveConversation: (conversationId: string) => `/messaging/conversations/${conversationId}/archive`,
    unarchiveConversation: (conversationId: string) => `/messaging/conversations/${conversationId}/unarchive`,
    muteConversation: (conversationId: string) => `/messaging/conversations/${conversationId}/mute`,
    unmuteConversation: (conversationId: string) => `/messaging/conversations/${conversationId}/unmute`,

    // Messages
    getMessages: (conversationId: string) => `/messaging/conversations/${conversationId}/messages`,
    sendMessage: (conversationId: string) => `/messaging/conversations/${conversationId}/messages`,
    markAsRead: (conversationId: string) => `/messaging/conversations/${conversationId}/read`,
    deleteMessage: (messageId: string) => `/messaging/messages/${messageId}`,
    editMessage: (messageId: string) => `/messaging/messages/${messageId}`,
    forwardMessage: (messageId: string) => `/messaging/messages/${messageId}/forward`,
    getMediaGallery: (conversationId: string) => `/messaging/conversations/${conversationId}/media`,

    // Reactions
    addReaction: (messageId: string) => `/messaging/messages/${messageId}/reactions`,
    removeReaction: (messageId: string, emoji: string) => `/messaging/messages/${messageId}/reactions/${emoji}`,
    getReactions: (messageId: string) => `/messaging/messages/${messageId}/reactions`,

    // Pinned Messages
    pinMessage: (conversationId: string) => `/messaging/conversations/${conversationId}/pin`,
    unpinMessage: (messageId: string) => `/messaging/messages/${messageId}/pin`,
    getPinnedMessages: (conversationId: string) => `/messaging/conversations/${conversationId}/pinned`,

    // Scheduled Messages
    scheduleMessage: (conversationId: string) => `/messaging/conversations/${conversationId}/schedule`,
    getScheduledMessages: (conversationId: string) => `/messaging/conversations/${conversationId}/scheduled`,
    cancelScheduledMessage: (scheduledMessageId: string) => `/messaging/scheduled/${scheduledMessageId}`,

    // Participants
    addParticipant: (conversationId: string) => `/messaging/conversations/${conversationId}/participants`,
    removeParticipant: (conversationId: string, userId: string) => `/messaging/conversations/${conversationId}/participants/${userId}`,
    updateParticipantRole: (conversationId: string, userId: string) => `/messaging/conversations/${conversationId}/participants/${userId}/role`,

    // Typing
    emitTyping: (conversationId: string) => `/messaging/conversations/${conversationId}/typing`,

    // Online Users
    getOnlineUsers: '/messaging/online-users',
  },
} as const;
