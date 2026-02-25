// Firebase Cloud Messaging Service Worker

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase in service worker
firebase.initializeApp({
  apiKey: "AIzaSyAOtherApiKey", // Will be replaced via env
  authDomain: "wasaachat.firebaseapp.com",
  projectId: "wasaachat",
  storageBucket: "wasaachat.appspot.com",
  messagingSenderId: "113043719708336689955",
  appId: "1:113043719708336689955:web:app_id"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification?.title || 'MzaziCare';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click received.');

  event.notification.close();

  const data = event.notification.data;
  let url = '/dashboard';

  // Route based on notification type
  if (data?.bookingId) {
    url = `/dashboard/bookings/${data.bookingId}`;
  } else if (data?.type === 'EMERGENCY' && data?.emergencyId) {
    url = `/dashboard/emergencies/${data.emergencyId}`;
  }

  event.waitUntil(
    clients.openWindow(url)
  );
});
